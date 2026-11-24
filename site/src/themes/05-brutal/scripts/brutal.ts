// 05 新粗獷：互動與動畫
// 規則：最後狀態都寫在 CSS；進場動畫只在 onReady() 裡用 gsap.from()，?shot 時不跑
import { gsap, ScrollTrigger, SplitText, still, smoothScroll, onReady, canHover } from '../../../lib/motion';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(Draggable, InertiaPlugin);
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector<T>(s);
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s));

const lenis = smoothScroll();

/* ---------- 手機選單 ---------- */
const burger = $('[data-burger]');
const mnav = $('[data-mnav]');
function setMenu(open: boolean) {
  document.documentElement.classList.toggle('menu-open', open);
  burger?.setAttribute('aria-expanded', String(open));
  if (open) {
    lenis?.stop();
    if (!still) gsap.from('.mnav-link', { xPercent: -110, rotation: -4, duration: 0.6, stagger: 0.05, ease: 'back.out(1.4)' });
  } else lenis?.start();
}
burger?.addEventListener('click', () => setMenu(!document.documentElement.classList.contains('menu-open')));
mnav?.addEventListener('click', (e) => { if ((e.target as HTMLElement).closest('a')) setMenu(false); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* ---------- 頁首：往下捲收起、往上捲出現 ---------- */
const hd = $('[data-hd]');
if (hd) {
  let last = 0;
  const onScroll = () => {
    const y = window.scrollY;
    hd.classList.toggle('scrolled', y > 24);
    hd.classList.toggle('hide', y > 300 && y > last && !document.documentElement.classList.contains('menu-open'));
    last = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- 回到最上面 ---------- */
$('[data-totop]')?.addEventListener('click', () => (lenis ? lenis.scrollTo(0, { duration: 1.4 }) : window.scrollTo({ top: 0, behavior: 'smooth' })));

/* ---------- 複製 Email ---------- */
$$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  const label = $('[data-copy-label]', b);
  try { await navigator.clipboard.writeText(b.dataset.copy || ''); if (label) label.textContent = '已複製！'; }
  catch { if (label) label.textContent = '請手動複製'; }
  b.classList.add('done');
  if (!still) gsap.fromTo(b, { scale: 0.85, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
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
      const tags = ($('[data-tags]', cell)?.dataset.tags || '').split('|');
      const ok = !tag || tags.includes(tag);
      cell.hidden = !ok;
      if (ok) shown++;
    });
    if (empty) empty.hidden = shown > 0;
    const vis = cells.filter((x) => !x.hidden);
    if (!still) gsap.fromTo(vis, { y: 40, rotation: () => gsap.utils.random(-3, 3), opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: 'back.out(1.5)', clearProps: 'transform,opacity' });
    ScrollTrigger.refresh();
  }));
}

/* ---------- 可以拖的貼紙（首頁、關於、404） ---------- */
$$('[data-drag]').forEach((el) => {
  const bounds = el.closest('[data-stage]') ? document.body : el.parentElement!;
  Draggable.create(el, {
    type: 'x,y',
    bounds,
    inertia: true,
    edgeResistance: 0.7,
    zIndexBoost: true,
    onPress() { gsap.to(this.target, { scale: 1.08, rotation: '+=6', duration: 0.25, ease: 'power2.out' }); this.target.classList.add('dragging'); },
    onRelease() { gsap.to(this.target, { scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.35)' }); this.target.classList.remove('dragging'); },
  });
});

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

/* ---------- 作品頁截圖：拖曳橫向捲動 ---------- */
const gal = $('[data-gal]');
if (gal && canHover) {
  let down = false, sx = 0, sl = 0;
  gal.addEventListener('pointerdown', (e) => { down = true; sx = e.clientX; sl = gal.scrollLeft; gal.classList.add('grab'); });
  addEventListener('pointerup', () => { down = false; gal.classList.remove('grab'); });
  gal.addEventListener('pointermove', (e) => { if (down) gal.scrollLeft = sl - (e.clientX - sx); });
}

/* ---------- 卡片 hover：一點點歪 ---------- */
if (canHover && !still) {
  $$('[data-tilt]').forEach((el) => {
    const rot = gsap.quickTo(el, 'rotation', { duration: 0.4, ease: 'back.out(3)' });
    el.addEventListener('pointerenter', () => rot(gsap.utils.random([-1.6, -1.1, 1.1, 1.6])));
    el.addEventListener('pointerleave', () => rot(0));
  });
}

/* ---------- 進場與捲動動畫 ---------- */
onReady(() => {
  // 跑馬燈：一直跑，捲動越快跑越快，往回捲會反向
  const tweens = $$('[data-marquee]').map((m) => {
    const track = $('.mq-track', m)!;
    const t = gsap.to(track, { xPercent: -50, duration: m.classList.contains('mq-lg') ? 38 : 30, ease: 'none', repeat: -1 });
    t.totalTime(t.duration() * 50);
    (t as any)._dir = m.dataset.dir === 'right' ? -1 : 1;
    t.timeScale((t as any)._dir);
    return t;
  });
  const badges = $$('.badge-ring').map((r) => gsap.to(r, { rotation: 360, duration: 16, ease: 'none', repeat: -1, transformOrigin: '50% 50%' }));
  if (tweens.length || badges.length) {
    ScrollTrigger.create({
      onUpdate(self) {
        const v = gsap.utils.clamp(-3000, 3000, self.getVelocity());
        const boost = 1 + Math.abs(v) / 400;
        const sign = self.direction;
        tweens.forEach((t) => {
          const base = (t as any)._dir * sign;
          gsap.to(t, { timeScale: base * boost, duration: 0.15, overwrite: true });
          gsap.to(t, { timeScale: base, duration: 1.2, delay: 0.15, ease: 'power2.out' });
        });
        badges.forEach((b) => { gsap.to(b, { timeScale: sign * boost * 1.5, duration: 0.15, overwrite: true }); gsap.to(b, { timeScale: sign, duration: 1.2, delay: 0.15 }); });
      },
    });
  }

  // 首頁 hero
  const hero = $('.hero');
  if (hero) {
    const tl = gsap.timeline({ defaults: { ease: 'back.out(1.7)', duration: 0.8 } });
    tl.from('.hero-chip', { y: 24, opacity: 0, stagger: 0.08, duration: 0.5 })
      .from('.hn-c > span', { yPercent: 115, rotation: 10, stagger: 0.07, duration: 0.9, ease: 'expo.out' }, '-=0.2')
      .from('.hero-en', { x: -60, opacity: 0, duration: 0.7, ease: 'expo.out' }, '-=0.6')
      .from('.hero-tag mark', { backgroundSize: '0% 40%', duration: 0.9, ease: 'expo.inOut' }, '-=0.4')
      .from('.hero-intro, .hero-ctas', { y: 30, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out' }, '-=0.6')
      .from('.hero-photo', { y: 140, rotation: -14, opacity: 0, duration: 1 }, 0.3)
      .from('.hero-badge', { scale: 0, rotation: -180, duration: 1, ease: 'back.out(1.6)' }, 0.8)
      .from('.hero-art .stk, .stk-arrow', { scale: 0, rotation: () => gsap.utils.random(-90, 90), stagger: 0.1, duration: 0.7, ease: 'back.out(2.4)' }, 1)
      .from('.hero-status .hs-in', { y: 40, opacity: 0, duration: 0.5 }, 1.2)
      .from('.mq-stack .mq', { xPercent: (i: number) => (i % 2 ? 100 : -100), duration: 1.1, ease: 'expo.out', stagger: 0.1 }, 0.9);

    // 照片隨捲動慢慢轉
    gsap.to('.hero-photo', { rotation: 6, y: 60, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  // 內頁標題
  const intro = $$('[data-in]');
  if (intro.length) {
    gsap.from(intro, { y: 50, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'expo.out' });
    const pop = $('[data-pop]');
    if (pop) gsap.from(pop, { scale: 0, rotation: -40, duration: 0.9, delay: 0.3, ease: 'back.out(2)' });
    const ph = $('.ph-en');
    if (ph) gsap.to(ph, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: ph, start: 'top 30%', end: 'bottom top', scrub: true } });
  }
  const nf = $$('.nf-d');
  if (nf.length) gsap.from(nf, { y: -400, rotation: () => gsap.utils.random(-50, 50), duration: 1.1, stagger: 0.12, ease: 'bounce.out' });
  const ct = $('.ct-title');
  if (ct) {
    const s = new SplitText(ct, { type: 'chars' });
    gsap.from(s.chars, { yPercent: 100, rotation: 12, opacity: 0, stagger: 0.05, duration: 0.7, ease: 'back.out(2)' });
  }

  // 捲到才彈進來
  ScrollTrigger.batch('[data-rise]', {
    start: 'top 90%',
    once: true,
    onEnter: (els) => gsap.from(els, { y: 70, rotation: () => gsap.utils.random(-4, 4), opacity: 0, duration: 0.85, stagger: 0.09, ease: 'back.out(1.4)', clearProps: 'transform,opacity' }),
  });

  // 數字跳動
  $$('[data-count]').forEach((el) => {
    const raw = el.textContent || '';
    const m = raw.match(/\d[\d,]*/);
    if (!m) return;
    const end = parseInt(m[0].replace(/,/g, ''), 10);
    if (!end || end > 100000) return;
    const o = { v: 0 };
    gsap.to(o, {
      v: end, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      onUpdate: () => { el.textContent = raw.replace(m[0], String(Math.round(o.v))); },
      onComplete: () => { el.textContent = raw; },
    });
  });

  // 頁尾大字
  const big = $('.ft-big');
  if (big) gsap.from('.ft-big-l', { yPercent: 60, opacity: 0, stagger: 0.12, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: big, start: 'top 90%', once: true } });
});
