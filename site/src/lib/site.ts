import { getCollection } from 'astro:content';
import config from '../../site.config.mjs';
import theme from '@theme/theme.mjs';

export { config, theme };
export const themeId = __THEME_ID__;

/** 站內連結都要經過 u()，GitHub Pages 的子路徑才不會壞掉 */
export function u(path = '/') {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : '/' + path);
}

// NO_IMAGES=1：假裝使用者還沒放任何照片（檢查版面沒有照片時也好看）
const noImages = typeof process !== 'undefined' && !!process.env?.NO_IMAGES;

/** 圖片路徑：站內路徑會加上子路徑；沒填回傳 undefined */
export function img(src?: string) {
  return src ? u(src) : undefined;
}

export async function getProfile() {
  const [p] = await getCollection('profile');
  if (!p) throw new Error('缺少 src/content/profile.md');
  if (noImages) p.data = { ...p.data, avatar: '', photos: [] };
  return p;
}

export async function getProjects() {
  const all = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  if (noImages) all.forEach((x) => { x.data = { ...x.data, cover: '', gallery: [] }; });
  return all;
}

export async function getExperience() {
  return (await getCollection('experience')).sort((a, b) => b.data.start.localeCompare(a.data.start));
}

export async function getPosts() {
  const all = (await getCollection('posts')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  if (noImages) all.forEach((x) => { x.data = { ...x.data, cover: '' }; });
  return all;
}

/** 文章大約幾分鐘讀完（中文每分鐘約 400 字） */
export function readMinutes(body = '') {
  return Math.max(1, Math.round(body.replace(/\s+/g, '').length / 400));
}

export function fmtDate(d: Date) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

/** 用名字產生縮寫（沒有大頭照時用） */
export function initials(name: string, nameEn?: string) {
  if (nameEn) return nameEn.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  return name.slice(-2);
}

export async function navItems() {
  const posts = await getPosts();
  const items = [
    { href: '/', label: '首頁', en: 'Home' },
    { href: '/about/', label: '關於', en: 'About' },
    { href: '/projects/', label: '作品', en: 'Work' },
    { href: '/experience/', label: '經歷', en: 'Experience' },
    { href: '/blog/', label: '文章', en: 'Writing' },
    { href: '/contact/', label: '聯絡', en: 'Contact' },
  ];
  return posts.length ? items : items.filter((i) => i.href !== '/blog/');
}
