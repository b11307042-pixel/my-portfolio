// 刊頭用的期數、季節、頁碼（建置當天決定）
import { navItems } from '../../../lib/site';

const now = new Date();
const m = now.getMonth() + 1;
export const year = now.getFullYear();
export const month = String(m).padStart(2, '0');
export const season = m >= 3 && m <= 5 ? '春' : m >= 6 && m <= 8 ? '夏' : m >= 9 && m <= 11 ? '秋' : '冬';
export const seasonEn = { 春: 'Spring', 夏: 'Summer', 秋: 'Autumn', 冬: 'Winter' }[season];
export const n2 = (i: number) => String(i).padStart(2, '0');
const cjk = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
/** 1 → 一、12 → 十二（圖說用） */
export function zh(n: number) {
  if (n <= 10) return cjk[n];
  if (n < 20) return '十' + (n % 10 ? cjk[n % 10] : '');
  return cjk[Math.floor(n / 10)] + '十' + (n % 10 ? cjk[n % 10] : '');
}
/** 每一頁在「目錄」裡的頁碼 */
export async function folio(href: string) {
  const items = await navItems();
  const i = Math.max(0, items.findIndex((x) => x.href === href));
  return i === 0 ? 'Cover' : `p.${n2(i * 14)}`;
}
export async function contents() {
  const items = await navItems();
  return items.map((x, i) => ({ ...x, page: i === 0 ? 'Cover' : `p.${n2(i * 14)}` }));
}
