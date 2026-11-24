// 09 柔和黏土：互動與動畫
// 規則：最後狀態都寫在 CSS；進場動畫只在 onReady() 裡用 gsap.from()，?shot 時不跑
import { gsap, ScrollTrigger, still, smoothScroll, onReady, canHover } from '../../../lib/motion';

const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));
const lenis = smoothScroll({ lerp: 0.085 });

/* ---------- 手機選單（底部抽屜） ---------- */
const burger = $('[data-burger]');
const sheet = $('[data-sheet]');
const sheetBg = $('[data-sheet-bg]');
function setMenu(open: boolean) {
  document.documentElement.classList.toggle('menu-open', open);
  burger?.setAttribute('aria-expanded', String(open));
  burger?.setAttribute('aria-label', open ? '關閉選單' : '打開選單');
  if (open) {
    lenis?.stop();
    if (!still) {
      gsap.fromTo(sheet, { yPercent: 100 }, { yPercent: 0, duration: 0.7, ease: 'elastic.out(1, 0.8)' });
      gsap.from('.sheet-link', { y: 40, scale: 0.9, opacity: 0, stagger: 0.04, duration: 0.6, ease: 'back.out(2)', delay: 0.1 });
    }
  } else {
    lenis?.start();
    if (sheet) gsap.set(sheet, { clearProps: 'transform' });
  }
}
burger?.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));
sheetBg?.addEventListener('click', () => setMenu(false));
sheet?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ---------- 頁首：捲動後變得更實心 ---------- */
const hd = $('[data-hd]');
if (hd) {
  const on = () => hd.classList.toggle('scrolled', scrollY > 20);
  addEventListener('scroll', on, { passive: true });
  on();
}

/* ---------- 導覽 hover：一顆小果凍跟著滑 ---------- */
const nav = $('[data-nav]');
const ind = $('[data-ind]');
if (nav && ind && canHover) {
  const links = $$('.hd-link', nav);
  const move = (a: HTMLElement, show = true) => gsap.to(ind, { x: a.offsetLeft, width: a.offsetWidth, opacity: show ? 1 : 0, duration: still ? 0 : 0.5, ease: 'elastic.out(1, 0.7)' });
  links.forEach((a) => a.addEventListener('pointerenter', () => move(a)));
  nav.addEventListener('pointerleave', () => gsap.to(ind, { opacity: 0, duration: 0.25 }));
}

/* ---------- 回到上面、複製 Email ---------- */
$('[data-totop]')?.addEventListener('click', () => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : scrollTo({ top: 0, behavior: 'smooth' })));
$$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  const label = $('[data-copy-label]', b);
  try { await navigator.clipboard.writeText(b.dataset.copy || ''); if (label) label.textContent = '複製好了'; }
  catch { if (label) label.textContent = '請手動複製'; }
  b.classList.add('done');
  setTimeout(() => { if (label) label.textContent = '複製'; b.classList.remove('done'); }, 2200);
}));

/* ---------- 作品篩選 ---------- */
const chips = $$<HTMLButtonElement>('[data-filter]');
if (chips.length) {
  const cells = $$('.pc-cell');
  const empty = $('[data-filter-empty]');
  chips.forEach((c) => c.addEventListener('click', () => {
    const tag = c.dataset.filter || '';
    chips.forEach((x) => { x.classList.toggle('on', x === c); x.setAttribute('aria-pressed', String(x === c)); });
    let shown = 0;
    cells.forEach((cell) => {
      const ok = !tag || ($('[data-tags]', cell)?.dataset.tags || '').split('|').includes(tag);
      cell.hidden = !ok;
      if (ok) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    if (!still) gsap.fromTo(cells.filter((x) => !x.hidden), { y: 30, scale: 0.94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.7, stagger: 0.06, ease: 'back.out(1.6)', clearProps: 'transform,opacity' });
    ScrollTrigger.refresh();
  }));
}

/* ---------- 文章閱讀進度 ---------- */
const bar = $('[data-progress]');
if (bar) {
  const set = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${h > 0 ? Math.min(1, scrollY / h) : 0})`;
  };
  addEventListener('scroll', set, { passive: true });
  set();
}

/* ---------- 截圖橫向拖曳 ---------- */
const gal = $('[data-gal]');
if (gal && canHover) {
  let down = false, sx = 0, sl = 0;
  gal.addEventListener('pointerdown', (e) => { down = true; sx = e.clientX; sl = gal.scrollLeft; gal.classList.add('grab'); });
  addEventListener('pointerup', () => { down = false; gal.classList.remove('grab'); });
  gal.addEventListener('pointermove', (e) => { if (down) gal.scrollLeft = sl - (e.clientX - sx); });
}

/* ---------- 按鈕：按下去會「啾」一下 ---------- */
if (!still) {
  $$('[data-squish], .btn').forEach((b) => {
    b.addEventListener('pointerdown', () => gsap.to(b, { scaleX: 1.06, scaleY: 0.9, duration: 0.12, ease: 'power2.out', overwrite: 'auto' }));
    const up = () => gsap.to(b, { scaleX: 1, scaleY: 1, duration: 0.8, ease: 'elastic.out(1.2, 0.35)', overwrite: 'auto' });
    b.addEventListener('pointerup', up);
    b.addEventListener('pointerleave', up);
  });
}

/* ---------- 卡片：跟著游標 3D 傾斜 ---------- */
if (canHover && !still) {
  $$('[data-tilt]').forEach((el) => {
    gsap.set(el, { transformPerspective: 1000 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });
    const ty = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const k = r.width > 700 ? 3 : 6;
      ry(px * k); rx(-py * k); ty(-6);
    });
    el.addEventListener('pointerleave', () => {
      gsap.to(el, { rotationX: 0, rotationY: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)', overwrite: true });
    });
  });
}

/* ---------- 小夥伴：眼睛跟著游標 ---------- */
const buddies = $$('[data-buddy]');
if (buddies.length && canHover) {
  addEventListener('pointermove', (e) => {
    buddies.forEach((b) => {
      const r = b.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const dx = gsap.utils.clamp(-1, 1, (e.clientX - (r.left + r.width / 2)) / (innerWidth / 2));
      const dy = gsap.utils.clamp(-1, 1, (e.clientY - (r.top + r.height / 2)) / (innerHeight / 2));
      gsap.to($('[data-face]', b), { xPercent: dx * 9, yPercent: dy * 9, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
    });
  });
}

/* ---------- 首頁 hero：滑鼠視差 ---------- */
const stage = $('[data-parallax]');
if (stage && canHover && !still) {
  const layers = $$('[data-depth]', stage).map((el) => ({ x: gsap.quickTo(el, 'x', { duration: 1, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 1, ease: 'power3.out' }), d: parseFloat(el.dataset.depth || '1') }));
  addEventListener('pointermove', (e) => {
    const px = e.clientX / innerWidth - 0.5, py = e.clientY / innerHeight - 0.5;
    layers.forEach((l) => { l.x(px * 24 * l.d); l.y(py * 18 * l.d); });
  });
}

/* ---------- 動畫 ---------- */
onReady(() => {
  // 背景泡泡慢慢飄
  $$('[data-blob]').forEach((b, i) => {
    gsap.to(b, {
      x: () => gsap.utils.random(-140, 140), y: () => gsap.utils.random(-100, 100), scale: () => gsap.utils.random(0.85, 1.2),
      duration: gsap.utils.random(14, 22), ease: 'sine.inOut', repeat: -1, yoyo: true, repeatRefresh: true, delay: i * -3,
    });
  });
  // 小零件上下漂（用 rotation 和 yPercent，不跟視差的 x/y 打架）
  $$('[data-float]').forEach((el, i) => {
    gsap.to(el, { yPercent: i % 2 ? 8 : -8, rotation: i % 2 ? 3 : -3, duration: 3 + (i % 3), ease: 'sine.inOut', repeat: -1, yoyo: true, delay: i * 0.4 });
  });
  // 眨眼
  $$('[data-buddy]').forEach((b) => {
    const eyes = $$('[data-eye]', b);
    const blink = () => {
      gsap.timeline({ onComplete: () => { gsap.delayedCall(gsap.utils.random(2.2, 5), blink); } })
        .to(eyes, { scaleY: 0.1, duration: 0.08, ease: 'power2.in' })
        .to(eyes, { scaleY: 1, duration: 0.18, ease: 'power2.out' });
    };
    gsap.delayedCall(1.5, blink);
  });

  // 首頁 hero
  if ($('.hero')) {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.1 } });
    tl.from('.halo', { scale: 0.4, opacity: 0, duration: 1.6 }, 0)
      .from('.portrait', { scale: 0.6, opacity: 0, duration: 1.4, ease: 'elastic.out(1, 0.6)' }, 0.1)
      .from('[data-hero]', { y: 40, opacity: 0, stagger: 0.09 }, 0.15)
      .from('.hero-art .float-chip, .hero-art .orb', { scale: 0, opacity: 0, stagger: 0.1, duration: 0.9, ease: 'back.out(2.2)' }, 0.6);
    gsap.to('.hero-art', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  // 內頁標題
  const intro = $$('[data-in]');
  if (intro.length) gsap.from(intro, { y: 36, opacity: 0, duration: 1, stagger: 0.08, ease: 'expo.out' });
  const deco = $$('.ph-deco');
  if (deco.length) gsap.from(deco, { scale: 0, duration: 1.2, stagger: 0.12, ease: 'elastic.out(1, 0.5)', delay: 0.2 });
  const nf = $$('.nf-row > *');
  if (nf.length) gsap.from(nf, { y: -120, scale: 0.6, opacity: 0, duration: 1.3, stagger: 0.12, ease: 'elastic.out(1, 0.5)' });

  // 泡泡一顆一顆冒出來
  ScrollTrigger.batch('[data-pop]', {
    start: 'top 92%', once: true,
    onEnter: (els) => gsap.from(els, { scale: 0.5, opacity: 0, y: 30, duration: 0.9, stagger: 0.08, ease: 'elastic.out(1, 0.6)', clearProps: 'transform,opacity' }),
  });
  // 卡片柔柔地浮上來
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 90%', once: true,
    onEnter: (els) => gsap.from(els, { y: 70, scale: 0.96, opacity: 0, duration: 1.1, stagger: 0.1, ease: 'expo.out', clearProps: 'transform,opacity' }),
  });

  // 數字慢慢數上去
  $$('[data-count]').forEach((el) => {
    const raw = el.textContent || '';
    const m = raw.match(/\d[\d,]*/);
    if (!m) return;
    const end = parseInt(m[0].replace(/,/g, ''), 10);
    if (!end || end > 100000) return;
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.6, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 94%', once: true },
      onUpdate: () => { el.textContent = raw.replace(m[0], String(Math.round(o.v))); },
      onComplete: () => { el.textContent = raw; },
    });
  });
});
