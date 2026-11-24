# 風格怎麼做（給老師、給改風格的 AI）

學生只改 `src/content/` 和 `site.config.mjs`，**不會碰這個資料夾**。每個風格是一個完整、獨立的網站外觀：自己的版型、元件、CSS、動畫。

## 一個風格有哪些檔案

```
src/themes/05-brutal/
  theme.mjs          名稱、說明、字型網址、themeColor（必填）、favicon（分頁小圖示的顏色：{ bg, fg, radius }，字是名字第一個字）
  Layout.astro       整個網站的外框：<html>、<head><Seo/></head>、頁首、頁尾、全站動畫
  pages/
    Home.astro       首頁                      /
    About.astro      關於                      /about/
    Projects.astro   作品列表                  /projects/
    Project.astro    單一作品（個案頁）        /projects/<id>/   props：entry, index, total, prev, next
    Experience.astro 經歷                      /experience/
    Blog.astro       文章列表                  /blog/
    Post.astro       單篇文章                  /blog/<id>/       props：entry, prev, next
    Contact.astro    聯絡                      /contact/
    NotFound.astro   404
  components/        這個風格自己的元件（可以自由新增）
  styles.css         這個風格的 CSS（檔名自訂，在 Layout 裡 import）
```

路由在 `src/pages/`，只負責把資料交給 `@theme/pages/*.astro`。`@theme` 指向目前選的風格資料夾。

## 共用的東西（不要複製，直接 import）

| 從哪裡 import | 有什麼 |
|---|---|
| `src/lib/site.ts` | `getProfile()` `getProjects()` `getExperience()` `getPosts()` `navItems()` `u(path)`（站內連結一定要包）`img(src)`（圖片路徑，沒填回傳 undefined）`fmtDate()` `initials()` `readMinutes()` `config` `theme` |
| `src/shared/Seo.astro` | `<head>` 裡的 title、description、OG、字型、主色（放在 Layout 的 head） |
| `src/shared/ContactForm.astro` | 聯絡表單（送到 Cloudflare Worker／D1 或顯示寄信按鈕）。樣式自己寫：`.form .field .btn .form-msg .form-off`，送出狀態看 `form[data-state]` |
| `src/lib/motion.ts` | GSAP、ScrollTrigger、SplitText、Lenis 平滑捲動、`still`、`onReady()`、`canHover` |
| `render(entry)`（`astro:content`） | 把 md 內文變成 `<Content />` |

資料欄位見 `src/content.config.ts`。內文（自傳、作品、文章）是 Markdown，風格要幫 `<Content />` 產生的 h2、p、ul、blockquote、img 寫樣式。

## 一定要做到

1. **動畫的最後狀態寫在 CSS，進場動畫用 `gsap.from()` 加上去。** 不要用 CSS 先把內容藏起來。網址有 `?shot`（截圖）或使用者開了「減少動態」，`still` 為 true，`onReady()` 不會跑，畫面直接是最後狀態。
2. **沒有照片也要好看。** 學生一開始都沒有大頭照、作品截圖。`avatar`、`photos`、`cover`、`gallery` 每一個都可能是空的，要有刻意設計過的替代版面，不能是一塊色塊加大字。用 `npm run shoot -- <編號> --no-images` 檢查。
3. **內容長短不一。** 名字可能兩個字或五個字，作品 1 個或 8 個，經歷 0 段，文章 0 篇（`navItems()` 會把文章拿掉），tagline 可能很長，沒有 `nameEn`。
4. **手機版**（390 寬）每一頁都要排過，不是桌機縮小。導覽列在手機要能用。
5. **站內連結都用 `u()`**，網站放在 GitHub Pages 子路徑（`/my-site/`）才不會壞。
6. 不要裝新套件、不要改 `src/` 其他地方、不要用網路上的圖。字型只用 Google Fonts（`theme.mjs` 的 `fonts`）。
7. 文字不要用 emoji。

## 檢查

```
npm run shoot -- 05               # 建置＋8 頁截圖（桌機、手機）到 theme-previews/05-brutal/
npm run shoot -- 05 --no-images   # 沒有照片的版本
npm run themes                    # 10 種風格首頁並排（給學生挑）
```
