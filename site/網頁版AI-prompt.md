用剛剛訪問我的內容，幫我寫「個人網站的內容檔」。網站的版型、動畫、手機版老師都做好了（Astro 框架，10 種風格），你只負責內容，不用寫任何 HTML、CSS。

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

===== 檔案：src/content/profile.md =====
---
name: 盧小熙
nameEn: Eric Lu
role: WPORT 職航站創辦人｜AI 工作流講師
tagline: 幫在台灣的外籍人才找到工作，也教大家把 AI 用進工作裡。
intro: 我是盧小熙，做的是 WPORT 職航站，一個給在台外籍人才的求職平台，從零到 1,060 間合作企業。也在大學和企業教 AI 工作流與 SSOT 知識管理。
status: 歡迎洽談 AI 工作坊與企業內訓
location: 台北，台灣
avatar: /images/me.webp
photos:
  - /images/me-talk.webp
  - /images/me-lifeguard.webp
email: hello@example.com
resume: ""
links:
  - label: 個人網站
    url: https://sup-eric.com
  - label: LinkedIn
    url: https://www.linkedin.com/in/xu-xi-lu-922823b9/
  - label: GitHub
    url: https://github.com/ericlu-sys
  - label: Instagram
    url: https://www.instagram.com/eric_rookie_ceo/
highlights:
  - value: "1,060"
    label: WPORT 合作企業
  - value: "90+"
    label: 做過軟體提案的企業
  - value: "24"
    label: 扶青團團長任內專案
  - value: "N2"
    label: 日文檢定
skills:
  - group: AI 與自動化
    items: [AI 工作流設計, Cursor／AI IDE, PRD, Obsidian SSOT, n8n, Vercel, Cloudflare, Google Apps Script]
  - group: 職能
    items: [B2B 業務開發, 專案管理, 客戶提案簡報, Agile, 跨部門協調, 數位轉型顧問]
  - group: 行銷與工具
    items: [GA4, Google Ads, Facebook Ads, Google Search Console, WordPress, Photoshop, Premiere]
  - group: 語言
    items: [中文（母語）, 英文（流利）, 日文 JLPT N2]
traits:
  - title: 把卡關的流程收斂成表單
    text: 僑外生找工作最容易卡在文件。WPORT 把這段流程整理成表單，資料填一次，需要的文件自動產生。
  - title: 用工具管專案，不靠記性
    text: 當扶青團團長那年，20 個人要跑 24 項專案。我導入 Trello，每一項誰負責、做到哪裡，打開就看得到。
  - title: 需要什麼，就學什麼
    text: PS、GA4、GTM、Google Script、OBS，沒有一項是坐下來好好學的，都是因為某件事非做不可才學會。
interests: [溯溪與野溪溫泉, 救生教練（台大第一期）, 主持沙龍與聚會]
quote: 很多當下看起來不相關的點，會在未來連成線。
---

我是盧小熙，現在在做的是 WPORT 職航站，一個給在台外籍人才的求職平台。

說起來也很好笑，大學在教育系不學無術，修了哲學、外交、經濟、西文、日文，大概就是把想學的東西都學了一遍。後來被同班同學慫恿去修資科系的課，從那時候開啟了跟軟體的不解之緣。不過當時菜得可憐，連巴斯卡三角形都寫不出來。

後來到了錫諾系統，開始做各種專案，服務過 O 型環、牙科器材、FMCG、文創、自行車零件這些看起來八竿子打不著的產業。實際做下來才發現，B2B 雖然業態不同，背後的邏輯卻很相似。

可能是社團跟工作都還算主動，有點名氣之後被挖到 WPORT。之後還是一路摸爬滾打，帶著團隊往前走，短影片、雇主品牌、軟體架構更換這些大小事都碰過。現在因為 AI 浪潮，也開始教 AI 課程了。

回頭看，我的人生大概就是一直在嘗試，也一直有人願意給機會。賈伯斯說過，很多當下看起來不相關的點，會在未來連成線。我後來是真的信了。

===== 檔案：src/content/projects/nodullards.md =====
---
title: 無白丁會所
summary: 台北小型策展式沙龍。15–20 人圍坐，橫跨藝術、生活、商業與哲學的深度對話。
role: 共同創辦人
period: 2025 –
tags: [社群經營, 活動策展, 官網]
results:
  - 每場 15–20 人，一位講者起頭，接著整桌深度對話
  - 官網同步場次與相簿，涵蓋講者、議程、場地與現場影像
cover: /images/projects/nodullards.webp
links:
  - label: 網站
    url: https://nodullardsclub.com
featured: false
order: 4
---

## 背景

大多數活動是單向的講堂，聽完就散。我們想要的是一個能真的聊起來的地方：人少一點、坐近一點。

## 我做了什麼

- 與夥伴共同創辦，以招待所為據點，打造爐邊對談而非單向講堂的沙龍
- 每場由一位講者起頭，接著是整桌的深度對話，主題涵蓋人才、品味、高端消費與更多
- 官網同步場次與相簿，涵蓋講者、議程、場地與現場影像

===== 檔案：src/content/projects/startup-life.md =====
---
title: 創業人生
summary: 一款像素風創業模擬遊戲：出生隨機，之後每一關自己選，邊玩邊認識中央與地方的創業資源。
role: 企劃與開發（全國青年諮詢組織交流會 G 組）
period: "2026"
tags: [遊戲企劃, 網頁遊戲, 政策資料]
results:
  - 12 種產業、14 個縣市，每個縣市支持的產業都附上政策或新聞來源
  - 100 多張依狀態出現的突發卡：關稅、勞資爭議、結婚生子、僑外生聘用
  - 上線後已有 8,361 人玩過一次
cover: /images/projects/startup-life.webp
gallery:
  - src: /images/projects/startup-life-play.webp
    caption: 遊戲首頁：選一個想做的事，或從已經有公司開始
links:
  - label: 線上玩
    url: https://sup-eric.com/work/youth-growth/#game
featured: true
order: 3
---

## 背景

115 年全國青年諮詢組織交流會，G 組的題目是「數位時代的青年創新與資源對接」。創業補助、貸款、法規很多，但青年很難一次看懂，我們決定做成一款玩一次就知道的遊戲。

## 我做了什麼

- 整理 12 種產業、14 個縣市的支持資源，每一項都附上政策或新聞來源
- 把 U-Start、SBIR、青創貸款、鳳凰貸款等方案做成關卡：條件不符就鎖住，並告訴你為何不達標、怎樣才能達標
- 設計 100 多張依狀態出現的突發卡，另做「補助與攻略」頁，可依縣市、身分篩選

===== 檔案：src/content/projects/wport.md =====
---
title: WPORT 職航站
summary: 專為在台外籍人才設計的求職平台，從零到 1,060 間合作企業。
role: 創辦人／執行長
period: 2024 –
tags: [求職平台, 多語介面, AI 工作流, SSOT]
results:
  - 從零累積到 1,060 間合作企業
  - 僑外生最容易卡關的文件流程，收斂成表單自動產生
  - 內部開發與營運全面導入 AI 工作流與 SSOT 知識管理
cover: /images/projects/wport.webp
links:
  - label: 網站
    url: https://wport.me
featured: true
order: 1
---

## 背景

在台灣的僑外生和外籍工作者，找工作時最大的問題不是能力，是資訊落差：哪些職缺能聘外國人、要準備什麼文件、工作許可怎麼申請，企業端也常常不清楚。

## 我做了什麼

- 創立 WPORT 職航站，做成多語求職平台，處理僑外生與外籍工作者的資訊落差
- 把僑外生所需文件自動化，最容易卡關的流程收斂成表單
- 統籌產品、開發與行銷團隊，主導品牌轉型與平台經營
- 把 AI 工作流與 SSOT 知識管理導入內部開發與營運

===== 檔案：src/content/projects/youth7.md =====
---
title: 桃園市青年諮詢委員會 國際展望組
summary: 第七屆桃園市青年諮詢會國際展望組組長，提出僑外生留台職涯暨生活支持計畫，並建置成果網站。
role: 國際展望組組長（第七屆）
period: 第七屆
tags: [政策提案, 田野調查, 成果網站]
results:
  - 設計法規→生活→產業→共融→媒合五階段留才 SOP
  - 訪談民政、經發、勞動三個局處，加上校園中越雙語問卷
  - 成果網站公開提案全文、活動紀錄與委員互動統計
cover: /images/projects/youth7.webp
links:
  - label: 成果網站
    url: https://youth7.sup-eric.com/
featured: true
order: 2
---

## 背景

桃園有很多僑外生，畢業後想留台工作，卻常常在法規、生活和產業資訊之間迷路。國際展望組想做的，是讓桃園成為僑外生留台的第一站。

## 我做了什麼

- 提出「僑外生留台職涯暨生活支持計畫」，設計法規→生活→產業→共融→媒合五階段留才 SOP
- 田野調查涵蓋民政、經發、勞動三局處訪談與校園中越雙語問卷，提案對接中央與市府既有 KPI
- 建置國際展望組成果網站，公開提案全文、活動紀錄與委員互動統計

===== 檔案：src/content/experience/2011-nccu-ta.md =====
---
title: 英文課教學助教
org: 國立政治大學
type: 校內工作
start: 2011-06
period: 2011.06 – 2014.02
summary: College English I、College English III（Culture and Tourism）的教學助教。
points:
  - 協助教授為 3 個班級、每班 40 名學生安排課程與備課
  - 整理論文、簡報與研究資料，批改期中與期末考卷
---

===== 檔案：src/content/experience/2014-wuling.md =====
---
title: 教育替代役
org: 台東縣延平鄉武陵國小
type: 服役
start: 2014-08
period: 2014.08 – 2015.07
summary: 在台東布農族部落的小學服役，教英文。
points:
  - 教授學生英文，並以 Skype 與母語者對話輔助學習
  - 為學校棒球隊設計粉絲專頁
---

===== 檔案：src/content/experience/2015-xinosys.md =====
---
title: 業務 → 專案經理 → 客戶經理 → 業務開發經理
org: 錫諾系統 Xinosys
type: 工作
start: 2015-10
period: 2015.10 – 2024.02
summary: B2B 軟體公司，從業務做起，最後負責業務開發與客戶顧問。
points:
  - 向超過 90 家企業進行 B2B 軟體策略簡報與提案
  - 為 B2B 客戶提供價格策略、通路拓展與供應鏈控管顧問，橫跨 O 型環、牙科器材、FMCG、文創與自行車零件
  - 將年費 12 萬元的採購系統導入 10 家以上客戶並持續維護關係
  - 採用 Agile 流程，以 Trello 與 RD 團隊追蹤專案進度
---

===== 檔案：src/content/experience/2016-rotaract.md =====
---
title: 團長（2017–2018）／副團長（2016–2017）
org: 台北扶輪青年服務團
type: 社團
start: 2016-01
period: 2016.01 – 2018.01
summary: 20 人團隊、24 項專案，學會專案管理的地方。
points:
  - 領導 20 人團隊執行 24 項專案，導入 Trello 進行專案管理
  - 管控贊助社與社費預算逾 10 萬元，分派幹部任務並追蹤進度
  - 參與 2019 年尼泊爾 AED 計畫，赴加德滿都執行
---

===== 檔案：src/content/experience/2024-hotfire.md =====
---
title: 執行長
org: 熱火數碼資訊股份有限公司
type: 工作
start: 2024-03
period: 2024.03 – 現在
summary: 主導品牌轉型與平台經營，統籌產品、開發與行銷團隊。
points:
  - 創立專為外籍人才設計的求職平台 WPORT 職航站，累積 1,060 間企業合作
  - 以數位工具處理國際人才在台就業的資訊落差，包含多語平台與僑外生文件自動化
  - 把 AI 工作流與 SSOT 知識管理導入內部開發與營運流程
---

===== 檔案：src/content/posts/skill-tree-ten-years.md =====
---
title: "【為了 X 學了 Y】一份被需求點開的十年技能樹"
date: 2026-08-19
summary: PS、GA4、Google Script、OBS，這些東西我沒有一項是坐下來好好學的，全部都是因為某件事非做不可才學的。
tags: [自學, 數位行銷]
---

2021 年我在社團的貼文裡列過一份清單，後來被朋友轉了好幾次。內容大概是這樣：

1. 為了做好海報與 Banner 學了 PS、AI
2. 為了快速產出名片學了 AI 的變數與 CSV 匯入
3. 為了剪片學了 PR、AE
4. 為了檢測流量學了 GSC，了解關鍵字 SEO
5. 為了了解流量學了 GA4
6. 為了管理 HTML 碼學了 GTM
7. 為了再行銷學了 FB Pixel
8. 為了自動化學了 Google Script
9. 為了讓其他人能使用學了如何在 GCP 上 Deploy
10. 為了紐約的線上音樂會學了 OBS、電腦對電腦影像傳輸、擷取卡

（範例只放開頭，你的文章要寫完整）

===== 檔案：src/content/posts/stress-test-by-choice.md =====
---
title: "回到原廠設定：為什麼要主動把自己丟回壓力裡"
date: 2026-08-14
summary: 2023 年去上台大救生班，21 天，每天下班六點到十點。我以為我是去學救生，結果我是去做一次壓力測試。
tags: [自我管理, CEO]
cover: /images/me-lifeguard.webp
---

2023 年那年我從社團行政退下來，本以為會多出很多時間。

結果抽空的行事曆恰如坑中的水，掏空了還是會有其他水源注入。整年的時間被各種任務、組織切割得很細，甚至有點毛毛躁躁的。

（範例只放開頭，你的文章要寫完整）

===== 待確認 =====
- （範例沒有待確認項目；你的版本把沒答到的列在這裡）
