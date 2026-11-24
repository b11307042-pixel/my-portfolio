// 每一頁的編號跟著導覽列：沒有文章時，「聯絡」會自動變成 05
import { navItems } from '../../../lib/site';
export async function pageNum(href: string) {
  const items = await navItems();
  const i = items.findIndex((x) => x.href === href);
  return String((i < 0 ? items.length : i) + 1).padStart(2, '0');
}
export const n2 = (i: number) => String(i).padStart(2, '0');
