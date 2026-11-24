# 聯絡表單：Cloudflare Worker ＋ D1 資料庫 ＋ 寄信通知

網站「聯絡」頁的表單送出後：

```
訪客填表單 ──► Worker（workers.dev 網址）──► 存進 D1 資料庫
                                        └─► 有網域才做：寄一封信到你的信箱
```

- 網站放哪裡都可以（GitHub Pages、Vercel、Cloudflare），表單都送到這支 Worker。
- 已經寫好：檢查欄位、擋機器人（隱藏欄位）、同一個 IP 10 分鐘最多 5 則、只允許你的網站送。
- 費用：Worker 和 D1 免費方案就夠，**不用網域**。寄信要有自己的網域（DNS 放在 Cloudflare，一年約 US$10），寄給「驗證過的自己的信箱」免費。

## 步驟（照順序，貼給 OpenCode）

### 1. 安裝、登入（只做一次）

```
# 在 contact-worker 資料夾裡做
run: cd contact-worker
run: npm install
run: npx wrangler login        # 會開瀏覽器，按 Allow
run: npx wrangler whoami       # 回報登入的帳號
```

### 2. 建資料庫、建資料表

```
run: npx wrangler d1 create contact-db --binding DB --update-config --location apac
# 上面這行會自動把資料庫寫進 wrangler.jsonc，不用手動貼 id
run: npm run db:init
```

### 3. 部署，拿到網址

```
run: npm run deploy
# 回報輸出裡的網址，長得像 https://my-contact.<你的帳號>.workers.dev
```

用瀏覽器打開那個網址，看到 `{"ok":true,...,"db":true}` 就是成功。

### 4. 接到網站上

```
edit: ../site.config.mjs 的 contactEndpoint 填 'https://my-contact.<你的帳號>.workers.dev'
edit: wrangler.jsonc 的 ALLOWED_ORIGIN 填你的網站網址，例如 'https://yourname.github.io'（不要結尾斜線、不要路徑）
run: npm run deploy
run: cd .. && npm run build
# 推上 GitHub，網站更新後到「聯絡」頁送一則測試留言
```

### 5. 看留言

```
run: npm run db:list
```

也可以到 Cloudflare 後台 → Storage & Databases → D1 → contact-db → Console 看。

### 6. 寄信通知（有網域才做）

前提：你的網域已經加到 Cloudflare（免費方案就可以），DNS 由 Cloudflare 管。

```
run: npx wrangler email routing enable 你的網域.com
run: npx wrangler email routing addresses create 你的信箱@gmail.com
# 到信箱點驗證信（沒驗證就收不到）
edit: wrangler.jsonc
  - 拿掉 send_email 那一行前面的 //
  - MAIL_TO 填 你的信箱@gmail.com
  - MAIL_FROM 填 contact@你的網域.com
run: npm run deploy
```

打開 Worker 網址，看到 `"email":true` 就接好了。之後每一則留言都會寄到你的信箱，直接按「回覆」就是回給留言的人。

**沒有網域？** 留言照樣存在 D1，用 `npm run db:list` 看就好。想收通知信，可以改接 Resend 這類寄信服務（免費版不用網域，但只能寄給自己註冊的信箱），請 AI 參考 `src/index.js` 的 `notify()` 改寫。

## 出錯時

| 看到 | 原因 |
|---|---|
| `還沒接上資料庫` | 步驟 2 沒做完，`wrangler.jsonc` 裡沒有 `d1_databases` |
| `no such table: messages` | 沒跑 `npm run db:init` |
| `這個網站不能使用此表單` | `ALLOWED_ORIGIN` 跟網站網址不一樣（注意 http／https、結尾斜線） |
| 網站顯示「沒送出去」 | `contactEndpoint` 網址打錯，或 Worker 還沒部署 |
| `"email":false` | `send_email` 那行還有 `//`，或 `MAIL_TO`、`MAIL_FROM` 沒填 |
| 有存進 D1 但沒收到信 | 信箱沒點驗證信、`MAIL_FROM` 不是你網域的地址；看 Cloudflare 後台 Worker 的 Logs |

## 檔案

| 檔案 | 是什麼 |
|---|---|
| `src/index.js` | Worker 程式（收表單、存 D1、寄信） |
| `schema.sql` | 資料表 `messages` 的定義 |
| `wrangler.jsonc` | Worker 設定：名字、資料庫、寄信、允許的網站 |
