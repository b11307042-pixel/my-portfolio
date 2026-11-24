#!/usr/bin/env node
// 老師改風格用：把某個風格的每一頁截圖（桌機＋手機），檢查版面。
//   npm run shoot -- 05                 先建置 05，再截 8 頁
//   npm run shoot -- 05 --no-images     假裝沒有任何照片
//   npm run shoot -- 05 --pages=/,/about/   只截這幾頁
// 圖存在 theme-previews/<風格>/（-d 桌機 1440 寬、-m 手機 390 寬，整頁長圖）
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const pick = args.find((a) => !a.startsWith('--'));
const all = fs.readdirSync(path.join(root, 'src/themes')).filter((f) => /^\d\d-/.test(f)).sort();
const theme = all.find((t) => pick && (t.startsWith(pick.padStart(2, '0')) || t === pick));
if (!theme) { console.error(`用法：npm run shoot -- <風格編號>。可以用的有：${all.join('、')}`); process.exit(1); }
const noImages = args.includes('--no-images');
const out = path.join(root, 'dist-shoot', theme);
const base = `/${theme}/`;

// 1. 建置
process.stdout.write(`建置 ${theme}${noImages ? '（沒有照片）' : ''} … `);
const astro = path.join(root, 'node_modules', 'astro', 'bin', 'astro.mjs');
const b = spawnSync(process.execPath, [astro, 'build', '--silent'], {
  cwd: root, encoding: 'utf8',
  env: { ...process.env, ...(noImages ? { NO_IMAGES: '1' } : {}), THEME: theme, BASE_PATH: base, OUT_DIR: out },
});
if (b.status !== 0) { console.log('失敗'); console.error(b.stdout, b.stderr); process.exit(1); }
console.log('完成');

// 2. 要截的頁
const first = (dir) => { try { return fs.readdirSync(path.join(out, dir)).find((f) => fs.statSync(path.join(out, dir, f)).isDirectory()); } catch { return undefined; } };
const pagesArg = args.find((a) => a.startsWith('--pages='));
const pages = pagesArg ? pagesArg.slice(8).split(',') : ['/', '/about/', '/projects/', `/projects/${first('projects')}/`, '/experience/', '/blog/', first('blog') ? `/blog/${first('blog')}/` : null, '/contact/', '/404.html'].filter(Boolean);

// 3. 伺服器（隨機 port，可以同時開好幾個）
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname === '/_frame') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(`<!doctype html><style>html,body{margin:0}iframe{border:0;width:390px;height:${url.searchParams.get('h')}px;display:block}</style><iframe src="${url.searchParams.get('u')}"></iframe>`);
  }
  let p = decodeURIComponent(url.pathname);
  if (!p.startsWith(base)) { res.writeHead(404); return res.end(); }
  let f = path.join(out, p.slice(base.length));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('not found'); }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((ok) => server.listen(0, ok));
const origin = `http://localhost:${server.address().port}`;

const browser = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', '/usr/bin/google-chrome', '/usr/bin/chromium'].filter(Boolean).find((p) => fs.existsSync(p));
if (!browser) { console.error('找不到 Chrome／Edge'); process.exit(1); }
const shot = (url, file, w, h) => new Promise((ok) => {
  const p = spawn(browser, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1', `--user-data-dir=${path.join(out, '.chrome')}`,
    `--window-size=${w},${h}`, '--virtual-time-budget=5000', `--screenshot=${file}`, url], { stdio: 'ignore' });
  p.on('exit', ok);
});

const dir = path.join(root, 'theme-previews', theme + (noImages ? '-noimg' : ''));
if (!pagesArg) fs.rmSync(dir, { recursive: true, force: true }); // 只截幾頁時，保留其他頁的舊圖
fs.mkdirSync(dir, { recursive: true });
for (const pg of pages) {
  const name = pg === '/' ? 'home' : pg.replace(/^\/|\/$|\.html$/g, '').replace(/\//g, '_');
  const url = `${origin}${base}${pg.replace(/^\//, '')}${pg.includes('?') ? '&' : '?'}shot`;
  await shot(url, path.join(dir, `${name}-d.png`), 1440, 3000);
  await shot(`${origin}/_frame?h=2600&u=${encodeURIComponent(url)}`, path.join(dir, `${name}-m.png`), 390, 2600);
  console.log(`截圖 ${pg}`);
}
server.close();
console.log(`\n圖在 ${path.relative(root, dir)}/`);
