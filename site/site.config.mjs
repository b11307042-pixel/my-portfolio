// 網站設定：學生只需要改這個檔案的「風格」那一行。
// 10 種風格：01-editorial 02-bento 03-minimal 04-aurora 05-brutal
//           06-terminal 07-magazine 08-studio 09-soft 10-cv
// 先跑 npm run themes 看 10 種長怎樣（圖在 theme-previews/）。
export default {
  theme: '08-studio',         // 風格
  accent: '',                 // 想換主色就填色碼，例如 '#1F5FAF'；空白＝用風格自己的顏色
  contactEndpoint: '',        // 聯絡表單的 Worker 網址（做完 contact-worker 再填）；空白＝只顯示 Email 按鈕
  lang: 'zh-Hant',
  siteUrl: 'https://example.github.io', // 上線後的網址（GitHub Actions 會自動帶，不用改）
};
