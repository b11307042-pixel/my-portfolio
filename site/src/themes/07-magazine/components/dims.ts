// 讀 public/ 裡圖片的寬高（建置時），讓版面能依照片比例排，不用學生自己填尺寸。
// 讀不到（網址、檔案不存在、格式不認得）就回傳 undefined，元件會用預設比例。
import fs from 'node:fs';
import path from 'node:path';

const cache = new Map<string, { w: number; h: number } | undefined>();

export function dims(src?: string): { w: number; h: number } | undefined {
  if (!src || /^https?:/.test(src)) return undefined;
  if (cache.has(src)) return cache.get(src);
  let out: { w: number; h: number } | undefined;
  try {
    const b = fs.readFileSync(path.join(process.cwd(), 'public', src.replace(/^\//, '')));
    if (b[0] === 0x89 && b.toString('ascii', 1, 4) === 'PNG') {
      out = { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    } else if (b[0] === 0xff && b[1] === 0xd8) {
      let i = 2;
      while (i < b.length) {
        if (b[i] !== 0xff) { i++; continue; }
        const m = b[i + 1];
        if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) {
          out = { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }; break;
        }
        i += 2 + b.readUInt16BE(i + 2);
      }
    } else if (b.toString('ascii', 0, 4) === 'RIFF' && b.toString('ascii', 8, 12) === 'WEBP') {
      const t = b.toString('ascii', 12, 16);
      if (t === 'VP8X') out = { w: 1 + b.readUIntLE(24, 3), h: 1 + b.readUIntLE(27, 3) };
      else if (t === 'VP8 ') out = { w: b.readUInt16LE(26) & 0x3fff, h: b.readUInt16LE(28) & 0x3fff };
      else if (t === 'VP8L') {
        const n = b.readUInt32LE(21);
        out = { w: (n & 0x3fff) + 1, h: ((n >> 14) & 0x3fff) + 1 };
      }
    }
  } catch { out = undefined; }
  cache.set(src, out);
  return out;
}

/** 寬高比（寬 / 高），讀不到用 fallback */
export function ratio(src?: string, fallback = 4 / 3) {
  const d = dims(src);
  return d && d.w && d.h ? d.w / d.h : fallback;
}
