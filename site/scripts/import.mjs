#!/usr/bin/env node
// 把網頁版 AI（Gemini／ChatGPT）寫好的「網站內容.md」拆進 src/content/。
//   npm run import -- ~/Downloads/網站內容.md
// 不給路徑：依序找 ./網站內容.md、../網站內容.md、~/Downloads/網站內容.md、~/下載/網站內容.md
//
// 格式：每個檔案前面一行  ===== 檔案：src/content/projects/wport.md =====
//       最後可以有        ===== 待確認 =====（會存成 待確認.md）
// 匯入前會把舊的 src/content 備份到 .backup/<時間>/
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const fail = (msg) => { console.error(`\n匯入失敗：${msg}\n`); process.exit(1); };

const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 23)) fail(`Node.js 版本太舊（現在 ${process.versions.node}），請先安裝 Node.js 24 LTS。`);

const arg = process.argv[2];
const candidates = arg
  ? [arg.replace(/^~(?=$|\/|\\)/, os.homedir())]
  : [path.join(root, '網站內容.md'), path.join(root, '..', '網站內容.md'), path.join(os.homedir(), 'Downloads', '網站內容.md'), path.join(os.homedir(), '下載', '網站內容.md')];
const file = candidates.find((f) => fs.existsSync(f));
if (!file) fail(`找不到檔案：${candidates.join('、')}`);

const text = fs.readFileSync(path.resolve(file), 'utf8').replace(/\r\n/g, '\n');
const marker = /^=+\s*(檔案|file)\s*[:：]\s*(.+?)\s*=+\s*$|^=+\s*待確認\s*=+\s*$/gim;
const parts = [];
let m, last = null;
while ((m = marker.exec(text))) {
  if (last) last.body = text.slice(last.end, m.index);
  last = { path: m[2] ? m[2].trim() : '待確認.md', end: marker.lastIndex };
  parts.push(last);
}
if (last) last.body = text.slice(last.end);
if (!parts.length) fail('檔案裡沒有「===== 檔案：路徑 =====」分隔線。請網頁版 AI 照範例格式重新輸出。');

// 拿掉 AI 常常多包的 ``` 程式碼框
const unfence = (s) => s.trim().replace(/^```[\w-]*\n/, '').replace(/\n```\s*$/, '').trim() + '\n';

const allowed = /^src\/content\/(profile\.md|(projects|experience|posts)\/[a-z0-9][a-z0-9-]*\.md)$/;
const files = [];
for (const p of parts) {
  const rel = p.path.replace(/\\/g, '/').replace(/^\.?\//, '');
  const body = unfence(p.body);
  if (rel === '待確認.md') { files.push({ rel, body }); continue; }
  if (!allowed.test(rel)) fail(`路徑「${rel}」不行。只能是 src/content/profile.md，或 src/content/projects|experience|posts/英文小寫-檔名.md`);
  if (!body.startsWith('---\n')) fail(`${rel} 開頭要是 ---（YAML 欄位區）`);
  files.push({ rel, body });
}
if (!files.some((f) => f.rel === 'src/content/profile.md')) fail('缺少 src/content/profile.md');

// 備份
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backup = path.join(root, '.backup', stamp);
fs.cpSync(path.join(root, 'src/content'), path.join(backup, 'content'), { recursive: true });

// 出現在新內容裡的資料夾，舊檔全部換掉（範例的盧小熙不會留下來）
for (const dir of ['projects', 'experience', 'posts']) {
  if (files.some((f) => f.rel.startsWith(`src/content/${dir}/`))) {
    const d = path.join(root, 'src/content', dir);
    for (const f of fs.readdirSync(d)) if (f.endsWith('.md')) fs.rmSync(path.join(d, f));
  }
}
for (const f of files) {
  const out = path.join(root, f.rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, f.body);
}

const count = (dir) => files.filter((f) => f.rel.startsWith(`src/content/${dir}/`)).length;
console.log(`已匯入：個人資料 1、作品 ${count('projects')}、經歷 ${count('experience')}、文章 ${count('posts')}`);
console.log(`舊內容備份在 .backup/${stamp}/`);
if (files.some((f) => f.rel === '待確認.md')) console.log('還有待確認的項目，見 待確認.md');

// 網站放在 Obsidian 保管庫裡（例如 my-portfolio/site/）：請 Obsidian 略過網站資料夾，
// 不然 node_modules 裡幾百個 .md 會塞滿搜尋和關係圖
const obsidian = path.join(root, '..', '.obsidian');
if (fs.existsSync(obsidian)) {
  try {
    const f = path.join(obsidian, 'app.json');
    const conf = fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : {};
    const dir = path.basename(root) + '/';
    if (!(conf.userIgnoreFilters || []).includes(dir)) {
      conf.userIgnoreFilters = [...(conf.userIgnoreFilters || []), dir];
      fs.writeFileSync(f, JSON.stringify(conf, null, 2));
      console.log(`Obsidian 會略過 ${dir}（重開 Obsidian 後生效）`);
    }
  } catch { /* 設定檔讀不懂就不動 */ }
}

// 檢查格式（欄位缺漏、型別錯誤會在這裡抓到）
const astroBin = path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');
if (!fs.existsSync(astroBin)) { console.log('\n還沒安裝套件：先跑 npm install，再跑 npm run build 檢查。'); process.exit(0); }
const r = spawnSync(process.execPath, [astroBin, 'sync'], { cwd: root, encoding: 'utf8' });
if (r.status !== 0) {
  const msg = (r.stdout + r.stderr).split('\n').filter((l) => /Error|error|Expected|Required|→|Location|\.md/.test(l)).slice(0, 12).join('\n');
  console.error(`\n內容格式有問題，網站還不能建置：\n${msg}\n\n照上面的檔名和欄位修正後，再跑一次 npm run build。`);
  process.exit(1);
}
console.log('格式檢查通過。下一步：npm run dev，打開它給的網址看網站。');
