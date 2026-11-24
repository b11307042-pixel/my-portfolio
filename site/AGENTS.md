# 給 AI 的工作說明（OpenCode／Claude Code 都會讀這份）

這是一個 Astro 個人網站。版型、動畫、手機版都已經寫好，有 10 種風格。
**你的工作只有：搬內容、換設定、跑指令。不要改版面程式碼。**

## 可以改的地方（只有這些）
- `src/content/`：網站內容
  - `profile.md`：個人資料（上面 `---` 之間是欄位，下面是自傳）
  - `projects/<英文檔名>.md`：作品，一個一份
  - `experience/<英文檔名>.md`：經歷，一段一份
  - `posts/<英文檔名>.md`：文章，一篇一份（沒有文章就把資料夾清空，導覽列會自動藏起來）
- `site.config.mjs`：只改 `theme`、`accent`、`contactEndpoint` 這三行
- `code_artifact.html`：第 1 堂做的一頁式網站，使用者給你他自己的就整份蓋掉，不要改裡面的內容
- `public/images/`：放照片，欄位填 `/images/檔名.jpg`
  - 大頭照 `avatar`、生活照 `photos`（關於頁）、作品封面 `cover`、作品頁更多截圖 `gallery`（每張可加 `caption`）
  - 範例的 `me*.webp`、`projects/` 是老師的照片和截圖，換成自己的之後可以刪

## 不要改的地方
- `src/themes/`、`src/shared/`、`src/lib/`、`src/pages/`、`scripts/`、`astro.config.mjs`
- 不要裝新套件、不要改 `package.json`
- 使用者想要的版面改不出來，就換一個風格（`npm run themes` 比較），不要自己寫 CSS

## 常用指令
| 要做什麼 | 指令 |
|---|---|
| 第一次：安裝 | `npm install` |
| 匯入網頁版 AI 寫的內容 | `npm run import`（自己到「下載」找 `網站內容.md`；別的位置就 `npm run import -- 路徑`） |
| 本機預覽 | `npm run dev`，回報它給的網址（通常是 http://localhost:4321）；改了 `site.config.mjs` 就再跑一次 |
| 比較 11 個版本（第 1 堂一頁式＋10 種風格） | `npm run themes`（約 30 秒，跑完會自己結束），打開 http://localhost:4400（圖在 `theme-previews/`） |
| 檢查能不能上線 | `npm run build` |

## 欄位規則（改內容時照做）
- 欄位名稱照現有檔案，不要新增或改名。
- 字串裡有冒號 `:`、井號 `#`，或開頭是數字，前後加雙引號。
- `start` 用 `YYYY-MM`（排序用），`period` 是顯示用文字。
- 作品 `featured: true` 才會上首頁，最多放 3 個；`order` 小的排前面。
- 沒有照片就填 `""`（`photos`、`gallery` 就整行拿掉），不要拿網路圖、不要用 AI 生圖。
- 內容只能來自使用者提供的資料（`我的資料.md`、`網站內容.md`），沒寫的數字、獎項、公司名不要自己編。

## 出錯時
- `npm run build` 失敗：錯誤訊息會寫哪個檔案、哪個欄位，照著改那一個欄位就好，不要動其他檔案。
- 改完只回報「改了哪些檔案」和指令結果，不要打開瀏覽器截圖、不要自己重跑好幾次（免費模型很耗額度）。

## 上線
- GitHub Pages：推上 `main` 會自動部署（`.github/workflows/deploy.yml`）。第一次要先跑：
  `gh api -X POST "repos/{owner}/{repo}/pages" -f build_type=workflow`
- 聯絡表單（存進 D1 資料庫、寄信）：照 `contact-worker/README.md` 做。

## 不要做的事
- 不要把手機、地址、生日、身分證、帳號密碼、API Key 寫進任何檔案（repo 是公開的）。
- 不要 commit `.env`、`.dev.vars`。
