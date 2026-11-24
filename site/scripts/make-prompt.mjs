#!/usr/bin/env node
// 產生「網頁版AI-prompt.md」：給 Gemini／ChatGPT 網頁版用的完整 prompt，
// 範例直接從 src/content/ 現在的內容打包，範本改了範例就跟著更新。
//   npm run prompt
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const content = path.join(root, 'src/content');
const list = (dir) => fs.readdirSync(path.join(content, dir)).filter((f) => f.endsWith('.md')).sort().map((f) => `src/content/${dir}/${f}`);
const order = ['src/content/profile.md', ...list('projects'), ...list('experience'), ...list('posts')];
const bundle = order
  .map((rel) => {
    let text = fs.readFileSync(path.join(root, rel), 'utf8').trim();
    // 文章只留開頭兩段當格式示範，prompt 才不會太長
    if (rel.startsWith('src/content/posts/')) {
      const [, fm, body] = text.match(/^(---\n[\s\S]*?\n---)\n+([\s\S]*)$/) || [];
      if (fm) text = `${fm}\n\n${body.split(/\n\n+/).slice(0, 2).join('\n\n')}\n\n（範例只放開頭，你的文章要寫完整）`;
    }
    return `===== 檔案：${rel} =====\n${text}\n`;
  })
  .join('\n') + '\n===== 待確認 =====\n- （範例沒有待確認項目；你的版本把沒答到的列在這裡）\n';

const prompt = `用剛剛訪問我的內容，幫我寫「個人網站的內容檔」。網站的版型、動畫、手機版老師都做好了（Astro 框架，10 種風格），你只負責內容，不用寫任何 HTML、CSS。

輸出規則：
1. 給我一個可以下載的檔案「網站內容.md」。不能產生檔案的話，就把全部內容放在同一個程式碼區塊裡。
2. 格式完全照下面的範例：每個檔案前面一行「===== 檔案：路徑 =====」，最後一段是「===== 待確認 =====」。
3. 欄位名稱、順序照範例，不要新增、不要改名。字串裡有冒號「:」、井號「#」或開頭是數字時，前後加雙引號。
4. 作品、經歷、文章一個一份檔案，檔名用英文小寫和「-」（會變成網址），例如 src/content/projects/club-signup.md。
5. 照片先不要填：avatar、cover、resume 留空字串 ""，photos、gallery 整行拿掉（範例裡的照片是示範用的），我之後自己放。

內容品質（這是重點，網站好不好看一半靠內容）：
- tagline：一句話講我想解決什麼問題、想做什麼。不要「熱愛學習、樂於挑戰」這種每個人都能寫的話。
- intro：兩三句，包含我是誰、做過最有代表性的一兩件事、現在在找什麼。
- highlights：3–4 個數字亮點（作品數、使用人數、幹部、證照分數…），只用我講過的數字。
- 個人資料下面的內文（自傳）：3–4 段、第一人稱，每段有一個具體事件，最後一段寫我想去什麼樣的團隊。
- traits：2–3 個做事方式，每個都要有「當時怎麼做」的例子。
- 作品內文至少兩段：「## 背景」「## 我做了什麼」（條列、動詞開頭）；我有講到心得，再加「## 學到的事」；results 寫成果，能有數字就有數字。featured: true 的作品會放首頁，挑最好的 3 個。
- 經歷：打工、實習、社團、幹部、志工、競賽、系上活動都算，一段一份。points 寫「做了什麼＋結果」。start 用 YYYY-MM 格式（排序用）。
- 文章：至少 1 篇，把訪問裡講到的一次經驗寫成 400–600 字心得。
- 我沒講到的不要編：數字、獎項、公司名稱、別人說的話都不行。不知道就寫「待確認」，並列在最後的待確認清單。
- 不要 emoji。手機、地址、生日、身分證字號不要放；email 只放我同意公開的。
- 之後我說要改哪裡，就重新給完整的「網站內容.md」。

範例（盧小熙是老師拿自己的資料做的範例，格式照抄，內容全部換成我的）：

${bundle}`;

const out = path.join(root, '網頁版AI-prompt.md');
fs.writeFileSync(out, prompt);
console.log(`已產生 ${path.relative(root, out)}（${prompt.length} 字）`);
