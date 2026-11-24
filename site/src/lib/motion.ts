// 動畫工具：GSAP（含 ScrollTrigger、SplitText）＋ Lenis 平滑捲動。
// 在風格的 <script> 裡用：
//   import { gsap, ScrollTrigger, SplitText, still, smoothScroll, onReady } from '../../lib/motion';
//   smoothScroll();
//   onReady(() => { gsap.from('.hero h1', { yPercent: 100, duration: 1.2, ease: 'expo.out' }); });
//
// 規則（截圖、無障礙都靠這個）：
// 1. 內容的「最後狀態」寫在 CSS，進場效果一律用 gsap.from()／fromTo() 從 JS 加上去。
//    不要在 CSS 先把東西藏起來（opacity:0），JS 沒跑或截圖時內容就消失了。
// 2. still 為 true（網址有 ?shot，或系統設定「減少動態」）時，onReady 不會執行，畫面直接是最後狀態。
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);
export { gsap, ScrollTrigger, SplitText };

export const still =
  typeof window !== 'undefined' &&
  (location.search.includes('shot') || matchMedia('(prefers-reduced-motion: reduce)').matches);

let lenis: Lenis | null = null;
/** 平滑捲動；still 時不啟用 */
export function smoothScroll(options: ConstructorParameters<typeof Lenis>[0] = {}) {
  if (still || lenis) return lenis;
  lenis = new Lenis({ lerp: 0.1, ...options });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

/** 字型載入完才跑動畫（SplitText 拆字才不會跑位）；still 時不跑 */
export function onReady(fn: () => void) {
  if (still) return;
  const go = () => (document.fonts ? document.fonts.ready.then(fn) : fn());
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go, { once: true });
  else go();
}

/** 是不是可以 hover 的裝置（手機不要做游標跟隨、磁吸按鈕） */
export const canHover = typeof window !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;
