// 遊戲化用到的小工具：等級、量表長度、編號
import { getExperience } from '../../../lib/site';

/** 等級＝從第一段經歷到今年幾年（沒有經歷就是 1） */
export async function level() {
  const exp = await getExperience();
  const years = exp.map((e) => parseInt(String(e.data.start).slice(0, 4), 10)).filter((n) => n > 1900);
  if (!years.length) return 1;
  return Math.max(1, new Date().getFullYear() - Math.min(...years) + 1);
}

/** 今年過了多少（當作「下一級經驗值」） */
export const yearProgress = () => {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 1).valueOf();
  const end = new Date(d.getFullYear() + 1, 0, 1).valueOf();
  return Math.round(((d.valueOf() - start) / (end - start)) * 100);
};

/** 亮點的量表長度：有數字就照數字大小（對數）排，沒數字給 80% */
export function meters(values: string[]) {
  const nums = values.map((v) => { const m = v.replace(/,/g, '').match(/\d+(\.\d+)?/); return m ? parseFloat(m[0]) : NaN; });
  const max = Math.max(...nums.filter((n) => !isNaN(n)), 1);
  return nums.map((n) => (isNaN(n) ? 80 : Math.round(35 + 65 * (Math.log10(n + 1) / Math.log10(max + 1)))));
}

export const pad = (n: number, l = 2) => String(n).padStart(l, '0');
export const tones = ['gold', 'coral', 'mint', 'sky'] as const;
