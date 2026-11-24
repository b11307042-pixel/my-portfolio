// 復古桌面的小工具
export type IconKind = 'disk' | 'folder' | 'doc' | 'text' | 'image' | 'mail' | 'cv' | 'log' | 'link' | 'trash' | 'bomb' | 'find' | 'app' | 'note';

/** 每一頁對應的桌面圖示與「檔名」 */
export const pageIcon: Record<string, { kind: IconKind; file: string }> = {
  '/': { kind: 'disk', file: 'Desktop' },
  '/about/': { kind: 'text', file: 'About Me.txt' },
  '/projects/': { kind: 'folder', file: 'Projects' },
  '/experience/': { kind: 'log', file: 'History.log' },
  '/blog/': { kind: 'folder', file: 'Writing' },
  '/contact/': { kind: 'mail', file: 'Mail' },
};

/** highlights 的進度條長度：用對數，數字差很多也看得出長短；不是數字（N2）就填滿 */
export function bars(values: string[]) {
  const nums = values.map((v) => parseFloat(v.replace(/[^\d.]/g, '')));
  const max = Math.max(1, ...nums.filter((n) => isFinite(n)));
  return nums.map((n) => (isFinite(n) && n > 0 ? Math.round((0.28 + 0.72 * (Math.log(n + 1) / Math.log(max + 1))) * 100) : 100));
}

/** 圖片檔名（標題列用） */
export const fileName = (src?: string) => (src ? src.split('/').pop() || 'image' : 'image');

export const n2 = (i: number) => String(i).padStart(2, '0');
