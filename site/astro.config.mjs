import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import config from './site.config.mjs';

// 風格：環境變數 THEME 優先（npm run themes 用），否則讀 site.config.mjs
const theme = process.env.THEME || config.theme;
const themeDir = fileURLToPath(new URL(`./src/themes/${theme}/`, import.meta.url));
if (!fs.existsSync(themeDir)) {
  const all = fs.readdirSync(new URL('./src/themes/', import.meta.url)).filter((f) => /^\d\d-/.test(f));
  throw new Error(`找不到風格「${theme}」。可以用的有：${all.join('、')}`);
}

export default defineConfig({
  site: process.env.SITE_URL || config.siteUrl,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  outDir: process.env.OUT_DIR || './dist',
  vite: {
    resolve: { alias: { '@theme': themeDir } },
    define: { __THEME_ID__: JSON.stringify(theme) },
  },
});
