// 03 像素冒險：互動與動畫
// 規則：最後狀態都寫在 CSS；進場動畫只在 onReady() 裡用 gsap.from()，?shot 或「減少動態」時不跑。
// 像素感：一律用 steps() 跳格，不做平滑緩動。
import { gsap, ScrollTrigger, SplitText, still, onReady, canHover } from '../../../lib/motion';

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

/* ---------- 手機選單 ---------- */
const menuBtn = $('[data-menu]');
const panel = $('[data-menu-panel]');
function setMenu(open: boolean) {
  document.documentElement.classList.toggle('menu-open', open);
  menuBtn?.setAttribute('aria-expanded', String(open));
  if (open && !still) {
    gsap.from('.menu-box', { scale: 0.6, opacity: 0, duration: 0.24, ease: 'steps(4)' });
    gsap.from('.menu-link', { x: -16, opacity: 0, duration: 0.2, stagger: 0.04, ease: 'steps(3)', delay: 0.12 });
  }
  if (open) $('.menu-link', panel!)?.focus();
}
menuBtn?.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));
panel?.addEventListener('click', (e) => { if (e.target === panel || (e.target as HTMLElement).closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ---------- 頁首捲動後加底色 ---------- */
const hd = $('[data-hd]');
if (hd) {
  const onScroll = () => hd.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- 選單游標：滑到哪一項，▶ 就跳過去（CSS 換位置，這裡加一下「跳」） ---------- */
if (canHover && !still) {
  $$('.hd-link, .choice, .menu-link').forEach((a) => {
    a.addEventListener('pointerenter', () => {
      const c = $('.hd-cur, .choice-cur, .menu-cur', a);
      if (c) gsap.fromTo(c, { x: -8 }, { x: 0, duration: 0.18, ease: 'steps(3)' });
    });
  });
}

/* ---------- 複製 Email ---------- */
$$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  const label = $('[data-copy-label]', b);
  const old = label?.textContent;
  try { await navigator.clipboard.writeText(b.dataset.copy || ''); if (label) label.textContent = '已複製！'; }
  catch { if (label) label.textContent = '請手動複製'; }
  setTimeout(() => { if (label && old) label.textContent = old; }, 2000);
}));

/* ---------- 作品篩選 ---------- */
const chips = $$<HTMLButtonElement>('[data-filter]');
if (chips.length) {
  const cells = $$('.qcell');
  const empty = $('[data-filter-empty]');
  chips.forEach((c) => c.addEventListener('click', () => {
    const tag = c.dataset.filter || '';
    chips.forEach((x) => { x.classList.toggle('on', x === c); x.setAttribute('aria-pressed', String(x === c)); });
    let shown = 0;
    cells.forEach((cell) => {
      const ok = !tag || (cell.dataset.tags || '').split('|').includes(tag);
      cell.hidden = !ok;
      if (ok) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    if (!still) gsap.from(cells.filter((x) => !x.hidden), { y: 16, opacity: 0, duration: 0.24, stagger: 0.05, ease: 'steps(4)', clearProps: 'transform,opacity' });
    ScrollTrigger.refresh();
  }));
}

/* ---------- 文章閱讀進度 ---------- */
const bar = $('[data-progress]');
if (bar) {
  const set = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    // 一格 5%，像血條一樣跳
    const v = h > 0 ? Math.min(1, scrollY / h) : 0;
    bar.style.transform = `scaleX(${Math.round(v * 20) / 20})`;
  };
  addEventListener('scroll', set, { passive: true });
  set();
}

/* ---------- 閃屏：像遊戲切關卡（不等字型，一進頁就閃；?shot／減少動態時不閃） ---------- */
const flash = $('.flash');
if (flash && !still) gsap.fromTo(flash, { opacity: 0.85 }, { opacity: 0, duration: 0.32, ease: 'steps(4)' });

/* ---------- 進場與捲動動畫 ---------- */
onReady(() => {
  // 精靈上下晃（兩格動畫）
  $$('.bob').forEach((el, i) => gsap.to(el, { y: -4, duration: 0.5, ease: 'steps(1)', repeat: -1, yoyo: true, delay: (i % 3) * 0.17 }));
  $$('.nudge').forEach((el) => gsap.to(el, { x: 6, duration: 0.4, ease: 'steps(1)', repeat: -1, yoyo: true }));

  // 標頭與首屏
  const intro = $$('[data-in]');
  if (intro.length) gsap.from(intro, { y: 16, opacity: 0, duration: 0.3, stagger: 0.07, ease: 'steps(4)', delay: 0.2 });

  // 捲到才出現
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 92%',
    once: true,
    onEnter: (els) => gsap.from(els, { y: 24, opacity: 0, duration: 0.3, stagger: 0.07, ease: 'steps(4)', clearProps: 'transform,opacity' }),
  });

  // 量表：一格一格填滿
  $$('.bar-f').forEach((f) => {
    gsap.from(f, { width: 0, duration: 0.8, ease: 'steps(10)', scrollTrigger: { trigger: f, start: 'top 95%', once: true } });
  });

  // 數字往上跳
  $$('[data-count]').forEach((el) => {
    const raw = el.textContent || '';
    const m = raw.match(/\d[\d,]*/);
    if (!m) return;
    const end = parseInt(m[0].replace(/,/g, ''), 10);
    if (!end || end > 1000000) return;
    const comma = m[0].includes(',');
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1, ease: 'steps(20)',
      scrollTrigger: { trigger: el, start: 'top 95%', once: true },
      onUpdate: () => { const n = Math.round(o.v); el.textContent = raw.replace(m[0], comma ? n.toLocaleString('en-US') : String(n)); },
      onComplete: () => { el.textContent = raw; },
    });
  });

  // 對話框：打字機
  $$('[data-type]').forEach((el) => {
    const s = new SplitText(el, { type: 'chars' });
    const box = el.closest('.dlg');
    const next = box ? $('.dlg-next', box) : null;
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    if (next) tl.set(next, { opacity: 0 });
    tl.from(s.chars, { opacity: 0, duration: 0.01, stagger: 0.04, ease: 'none' });
    if (next) tl.set(next, { opacity: 1 });
  });

  // 404：CONTINUE? 倒數
  const cd = $('[data-countdown]');
  if (cd) {
    let n = 9;
    const t = setInterval(() => {
      n -= 1;
      cd.textContent = String(n);
      gsap.fromTo(cd, { scale: 1.4 }, { scale: 1, duration: 0.2, ease: 'steps(2)' });
      if (n <= 0) clearInterval(t);
    }, 1000);
    gsap.from('.go-t span', { y: -120, duration: 0.6, stagger: 0.2, ease: 'steps(6)' });
  }
});
