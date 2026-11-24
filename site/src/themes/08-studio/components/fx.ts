// 08 作品集工作室的動畫：開場布幕、大字逐行、作品圖遮罩展開＋視差、View 游標、跑馬燈、換頁布幕。
// 規則：最後狀態寫在 CSS；進場一律 gsap.from()；still（?shot／減少動態）時 onReady 不跑。
import { gsap, ScrollTrigger, still, smoothScroll, onReady, canHover } from '../../../lib/motion';

const EASE = 'expo.out';
const root = document.documentElement;

/* ---------- 中英混排拆字：中文一字一格、英文一字一格，標點黏著前一個字 ---------- */
const UNIT = /[「『（《〈“]*(?:[㐀-鿿豈-﫿]|[^\s㐀-鿿豈-﫿「『（《〈，。、！？：；」』）》〉”]+)[，。、！？：；」』）》〉”]*|\s+|[\s\S]/g;
function splitUnits(el: HTMLElement) {
  const original = el.innerHTML;
  const walk = (node: Node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        (n.textContent!.match(UNIT) || []).forEach((tok) => {
          if (/^\s+$/.test(tok)) { frag.append(tok); return; }
          const o = document.createElement('span'); o.className = 'u';
          const i = document.createElement('span'); i.className = 'ui'; i.textContent = tok;
          o.append(i); frag.append(o);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && !(n as Element).matches('svg')) walk(n);
    });
  };
  walk(el);
  const units = [...el.querySelectorAll<HTMLElement>('.u')];
  const tops: number[] = [];
  const line = units.map((u) => {
    const t = Math.round(u.getBoundingClientRect().top);
    let k = tops.findIndex((x) => Math.abs(x - t) < 8);
    if (k < 0) { tops.push(t); k = tops.length - 1; }
    return k;
  });
  return { units, inner: units.map((u) => u.firstElementChild as HTMLElement), line, revert: () => { el.innerHTML = original; } };
}

function riseLines(el: HTMLElement, delay = 0, scroll = false) {
  const s = splitUnits(el);
  return gsap.from(s.inner, {
    yPercent: 120, rotate: 4, duration: 1.3, ease: EASE,
    delay: (i: number) => delay + s.line[i] * 0.1 + (i % 30) * 0.012,
    onComplete: s.revert,
    scrollTrigger: scroll ? { trigger: el, start: 'top 90%', once: true } : undefined,
  });
}

/* ---------- 名字撐滿寬度（版面，不是動畫，截圖時也要跑） ---------- */
function fit() {
  const run = () => document.querySelectorAll<HTMLElement>('[data-fit]').forEach((el) => {
    const box = el.parentElement!;
    const cs = getComputedStyle(box);
    const others = [...box.children].filter((c) => c !== el).reduce((a, c) => a + (c as HTMLElement).offsetWidth + 14, 0);
    const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight) - others;
    el.style.fontSize = '100px';
    const w = el.scrollWidth || 1;
    const max = Number(el.dataset.fitMax || 0.34) * box.clientWidth;
    el.style.fontSize = Math.min(max, (avail / w) * 100 * 0.99) + 'px';
  });
  run();
  document.fonts?.ready.then(run);
  let t = 0;
  addEventListener('resize', () => { clearTimeout(t); t = window.setTimeout(run, 120); });
}

/* ---------- 側欄時鐘 ---------- */
function clock() {
  const els = document.querySelectorAll<HTMLElement>('[data-clock]');
  if (!els.length) return;
  const f = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Taipei' });
  const tick = () => els.forEach((el) => { el.textContent = `${f.format(new Date())} GMT+8`; });
  tick(); setInterval(tick, 30000);
}

/* ---------- 手機選單 ---------- */
function menu() {
  const btn = document.querySelector<HTMLButtonElement>('[data-menu]');
  const set = (open: boolean) => {
    root.classList.toggle('menu-open', open);
    btn?.setAttribute('aria-expanded', String(open));
    const t = btn?.querySelector('.top-btn-t'); if (t) t.textContent = open ? 'Close' : 'Menu';
    const l = smoothScroll(); if (l) open ? l.stop() : l.start();
    if (open && !still) gsap.from('.mnav-link', { yPercent: 60, opacity: 0, duration: 0.9, ease: EASE, stagger: 0.05, delay: 0.15 });
  };
  btn?.addEventListener('click', () => set(!root.classList.contains('menu-open')));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
}

/* ---------- View 游標：滑到作品圖上會出現 ---------- */
function viewCursor() {
  const c = document.querySelector<HTMLElement>('.vcur');
  if (!c) return;
  const label = c.querySelector('span')!;
  root.classList.add('has-vcur');
  gsap.set(c, { xPercent: -50, yPercent: -50, scale: 0 });
  const x = gsap.quickTo(c, 'x', { duration: 0.5, ease: 'power3' });
  const y = gsap.quickTo(c, 'y', { duration: 0.5, ease: 'power3' });
  addEventListener('pointermove', (e) => { x(e.clientX); y(e.clientY); });
  document.querySelectorAll<HTMLElement>('[data-view]').forEach((el) => {
    el.addEventListener('pointerenter', () => {
      label.textContent = el.dataset.viewLabel || 'View';
      gsap.to(c, { scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' });
    });
    el.addEventListener('pointerleave', () => gsap.to(c, { scale: 0, duration: 0.4, ease: 'power3.in', overwrite: 'auto' }));
  });
}

/* ---------- 磁吸按鈕 ---------- */
function magnetic() {
  document.querySelectorAll<HTMLElement>('[data-magnet]').forEach((el) => {
    const x = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    const y = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      x((e.clientX - r.left - r.width / 2) * 0.3); y((e.clientY - r.top - r.height / 2) * 0.3);
    });
    el.addEventListener('pointerleave', () => { x(0); y(0); });
  });
}

/* ---------- 開場布幕＋換頁布幕 ---------- */
function curtainIn(after: () => void) {
  const cur = document.querySelector<HTMLElement>('.curtain');
  root.dataset.introRan = '1';
  if (!cur || !root.classList.contains('intro')) { after(); return; }
  let first = true;
  try { first = !sessionStorage.getItem('st-seen'); sessionStorage.setItem('st-seen', '1'); } catch { /* 無痕模式 */ }
  const tl = gsap.timeline({ defaults: { ease: 'expo.inOut' } });
  const n = cur.querySelector<HTMLElement>('[data-count-intro]');
  if (first) {
    const o = { v: 0 };
    tl.from('.curtain-name', { yPercent: 110, duration: 1, ease: EASE })
      .to(o, { v: 100, duration: 1.1, ease: 'power2.inOut', onUpdate: () => { if (n) n.textContent = String(Math.round(o.v)).padStart(2, '0'); } }, 0.1);
  } else {
    gsap.set('.curtain-in', { opacity: 0 });
  }
  tl.to(cur, { yPercent: -100, duration: first ? 1.1 : 0.8 }, first ? '+=0.1' : 0.05)
    .add(() => { root.classList.remove('intro'); gsap.set(cur, { clearProps: 'all' }); gsap.set('.curtain-in', { clearProps: 'opacity' }); }, '>')
    .add(after, first ? '-=0.75' : '-=0.55');
}

function pageLeave() {
  const cur = document.querySelector<HTMLElement>('.curtain');
  if (!cur) return;
  document.addEventListener('click', (e) => {
    const a = (e.target as HTMLElement).closest('a');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
    e.preventDefault();
    root.classList.remove('menu-open');
    gsap.set('.curtain-in', { opacity: 0 });
    gsap.fromTo(cur, { yPercent: 100, visibility: 'visible' }, { yPercent: 0, duration: 0.7, ease: 'expo.inOut', onComplete: () => { location.href = a.href; } });
  });
  addEventListener('pageshow', (e) => { if (e.persisted) gsap.set(cur, { clearProps: 'all' }); });
}

/* ---------- 進場、捲動 ---------- */
function heroIn() {
  const tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.from('.side > *, .top > *', { x: -20, opacity: 0, duration: 1.2, stagger: 0.07 }, 0);
  const fitEl = document.querySelector<HTMLElement>('[data-hero-name]');
  if (fitEl) {
    const s = splitUnits(fitEl);
    tl.from(s.inner, { yPercent: 105, duration: 1.4, stagger: 0.04, onComplete: s.revert }, 0.05);
  }
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const top = el.getBoundingClientRect().top < innerHeight;
    riseLines(el, top ? 0.25 : 0, !top);
  });
}

function scrollFx() {
  gsap.utils.toArray<HTMLElement>('[data-up]').forEach((el) => {
    const top = el.getBoundingClientRect().top < innerHeight * 0.92;
    gsap.from(el, { y: 40, opacity: 0, duration: 1.3, ease: EASE, delay: top ? 0.5 : 0, scrollTrigger: top ? undefined : { trigger: el, start: 'top 92%', once: true } });
  });
  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((wrap) => {
    gsap.from(wrap.children, { y: 40, opacity: 0, duration: 1.2, ease: EASE, stagger: 0.08, scrollTrigger: { trigger: wrap, start: 'top 88%', once: true } });
  });
  // 作品圖：遮罩從中間展開，裡面的圖反向視差
  gsap.utils.toArray<HTMLElement>('[data-media]').forEach((el) => {
    const top = el.getBoundingClientRect().top < innerHeight;
    gsap.from(el, {
      clipPath: 'inset(18% 12% 18% 12%)', duration: 1.6, ease: 'expo.inOut', delay: top ? 0.45 : 0,
      scrollTrigger: top ? undefined : { trigger: el, start: 'top 82%', once: true },
    });
    const im = el.querySelector('.par');
    if (im) {
      gsap.from(im, { scale: 1.3, duration: 2, ease: 'expo.out', delay: top ? 0.45 : 0, scrollTrigger: top ? undefined : { trigger: el, start: 'top 82%', once: true } });
      gsap.fromTo(im, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  });
  gsap.utils.toArray<HTMLElement>('[data-lift]').forEach((el) => {
    gsap.fromTo(el, { yPercent: 6 }, { yPercent: -6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
  });
  // 一段話隨捲動由暗變亮
  gsap.utils.toArray<HTMLElement>('[data-scrub-text]').forEach((el) => {
    const s = splitUnits(el);
    gsap.fromTo(s.inner, { opacity: 0.16 }, { opacity: 1, stagger: 0.05, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true } });
  });
  gsap.utils.toArray<HTMLElement>('[data-rule]').forEach((el) => {
    gsap.from(el, { scaleX: 0, transformOrigin: '0 50%', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 95%', once: true } });
  });
  gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
    const m = el.textContent!.match(/^(\D*)(\d+)(.*)$/);
    if (!m || Number(m[2]) < 2) return;
    const o = { v: 0 };
    gsap.to(o, { v: Number(m[2]), duration: 1.8, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 92%', once: true }, onUpdate: () => { el.textContent = m[1] + Math.round(o.v) + m[3]; } });
  });
  // 跑馬燈：一直往左跑，捲動越快跑越快，方向跟著捲動
  gsap.utils.toArray<HTMLElement>('[data-marquee]').forEach((mq) => {
    const track = mq.querySelector<HTMLElement>('.mq-track');
    if (!track) return;
    const rev = mq.dataset.marquee === 'rev';
    const loop = gsap.fromTo(track, { xPercent: rev ? -50 : 0 }, { xPercent: rev ? 0 : -50, duration: 38, ease: 'none', repeat: -1 });
    let dir = 1;
    ScrollTrigger.create({
      trigger: mq, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        if (self.direction !== dir) dir = self.direction;
        const v = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 220);
        gsap.to(loop, { timeScale: dir * v, duration: 0.2, overwrite: true, onComplete: () => { gsap.to(loop, { timeScale: dir, duration: 1.2 }); } });
      },
    });
  });
}

export function init() {
  if (location.search.includes('shot')) document.querySelectorAll<HTMLImageElement>('img[loading=lazy]').forEach((i) => (i.loading = 'eager'));
  fit();
  clock();
  menu();
  if (still) return;
  smoothScroll({ lerp: 0.09 });
  if (canHover) { viewCursor(); magnetic(); }
  pageLeave();
  onReady(() => curtainIn(() => { heroIn(); scrollFx(); ScrollTrigger.refresh(); }));
}
