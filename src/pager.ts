/*
  Screen pager (desktop home page).
  One wheel gesture / key press = one screen, moved along an ease-in-out curve.
  A screen taller than the window (e.g. the Manifesto) scrolls smoothly inside itself first,
  and hands over to the next screen only when its edge is reached.
  Trackpad momentum is absorbed: after each move, wheel input is ignored until the gesture has gone quiet.
*/

type Stop = { top: number; end: number }; // end > top means a free-scroll zone [top, end]

const DURATION_MIN = 950;
const DURATION_MAX = 1350;
// easeInOutQuart-like curve with a soft start and a long settle
const ease = (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2);

let active = false;
let animating = false;
let gate = false;
let gateTimer = 0;
let raf = 0;
let stops: Stop[] = [];
let freeTarget: number | null = null;
let freeRaf = 0;

const vh = () => window.innerHeight;
const y = () => window.scrollY;
const maxY = () => document.documentElement.scrollHeight - vh();

function collect() {
  const els = Array.from(document.querySelectorAll<HTMLElement>('[data-screen]'));
  const list: Stop[] = els.map((el) => {
    const top = Math.round(el.getBoundingClientRect().top + y());
    const h = el.offsetHeight;
    const end = h > vh() + 4 ? Math.min(maxY(), top + h - vh()) : top;
    return { top: Math.min(top, maxY()), end };
  });
  list.sort((a, b) => a.top - b.top);
  stops = list.filter((s, i) => i === 0 || Math.abs(s.top - list[i - 1].top) > 2);
}

function currentIndex(): number {
  const cy = y();
  let idx = 0;
  for (let i = 0; i < stops.length; i++) if (stops[i].top <= cy + 4) idx = i;
  return idx;
}

export function animateTo(target: number, onDone?: () => void) {
  cancelAnimationFrame(raf);
  cancelAnimationFrame(freeRaf);
  freeRaf = 0;
  freeTarget = null;
  const from = y();
  const to = Math.max(0, Math.min(maxY(), target));
  const dist = Math.abs(to - from);
  if (dist < 1) { onDone?.(); return; }
  const dur = Math.min(DURATION_MAX, DURATION_MIN + dist * 0.12);
  const t0 = performance.now();
  animating = true;
  const step = (now: number) => {
    const k = Math.min(1, (now - t0) / dur);
    window.scrollTo(0, from + (to - from) * ease(k));
    if (k < 1) raf = requestAnimationFrame(step);
    else {
      animating = false;
      armGate();
      onDone?.();
    }
  };
  raf = requestAnimationFrame(step);
}

function armGate() {
  gate = true;
  clearTimeout(gateTimer);
  gateTimer = window.setTimeout(() => (gate = false), 220);
}

function go(dir: 1 | -1) {
  const i = currentIndex();
  const s = stops[i];
  const cy = y();
  // inside a tall screen: move to its edge first
  if (s && s.end > s.top) {
    if (dir === 1 && cy < s.end - 2) return animateTo(Math.min(s.end, cy + vh() * 0.8));
    if (dir === -1 && cy > s.top + 2) return animateTo(Math.max(s.top, cy - vh() * 0.8));
  }
  if (dir === -1 && cy > (s?.top ?? 0) + 2 && !(s && s.end > s.top)) return animateTo(s.top);
  const next = stops[i + dir];
  if (!next) return;
  animateTo(dir === 1 ? next.top : next.end > next.top ? next.end : next.top);
}

// Smooth inertial scroll inside a tall screen (the Manifesto).
// The position is kept as a float and eased toward the target with a time-based exponential,
// so wheel ticks blend into one continuous glide instead of stepping.
let freePos = 0;
let freeVel = 0;
let freeLast = 0;
const FREE_W = 9; // spring frequency (rad/s): critically damped, so velocity stays continuous across wheel ticks
function freeScroll(delta: number, s: Stop) {
  if (!freeRaf) { freePos = y(); freeVel = 0; freeLast = performance.now(); }
  const base = freeTarget ?? freePos;
  // mouse wheels send big discrete steps; soften them so each tick glides
  const d = Math.abs(delta) >= 80 ? delta * 0.9 : delta;
  freeTarget = Math.max(s.top, Math.min(s.end, base + d));
  if (freeRaf) return;
  const tick = (now: number) => {
    if (freeTarget === null) { freeRaf = 0; return; }
    const dt = Math.min(0.032, (now - freeLast) / 1000);
    freeLast = now;
    // semi-implicit Euler on a critically damped spring
    const acc = FREE_W * FREE_W * (freeTarget - freePos) - 2 * FREE_W * freeVel;
    freeVel += acc * dt;
    freePos += freeVel * dt;
    if (Math.abs(freeTarget - freePos) < 0.3 && Math.abs(freeVel) < 4) {
      freePos = freeTarget;
      window.scrollTo(0, freePos);
      freeTarget = null; freeRaf = 0;
      return;
    }
    window.scrollTo(0, freePos);
    freeRaf = requestAnimationFrame(tick);
  };
  freeRaf = requestAnimationFrame(tick);
}

function onWheel(e: WheelEvent) {
  if (!active || e.ctrlKey) return;
  // let inner scrollable areas (e.g. the comparison table on small screens) work horizontally
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
  e.preventDefault();
  const delta = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY;
  if (Math.abs(delta) < 2) return;
  if (animating) return;
  collect();
  const s = stops[currentIndex()];
  const dir: 1 | -1 = delta > 0 ? 1 : -1;
  // tall screen: scroll inside it until its edge
  if (s && s.end > s.top) {
    const target = (freeTarget ?? y()) + delta;
    const inside = dir === 1 ? (freeTarget ?? y()) < s.end - 1 : (freeTarget ?? y()) > s.top + 1;
    if (inside) {
      freeScroll(delta, s);
      armGate();
      void target;
      return;
    }
  }
  if (gate) { armGate(); return; } // still the same gesture (or its momentum)
  go(dir);
}

function onKey(e: KeyboardEvent) {
  if (!active || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  const t = e.target as HTMLElement | null;
  if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
  if (t && t.closest('[role="tablist"], .live-mark, .ln-node')) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) return;
  }
  let dir: 1 | -1 | 0 = 0;
  if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) dir = 1;
  if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) dir = -1;
  if (e.key === 'Home') { e.preventDefault(); animateTo(0); return; }
  if (e.key === 'End') { e.preventDefault(); animateTo(maxY()); return; }
  if (!dir) return;
  e.preventDefault();
  if (animating) return;
  collect();
  go(dir);
}

function onClick(e: MouseEvent) {
  if (!active || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const a = (e.target as HTMLElement).closest('a[href^="#"]') as HTMLAnchorElement | null;
  if (!a) return;
  const id = a.getAttribute('href')!.slice(1);
  const el = id ? document.getElementById(id) : document.body;
  if (!el) return;
  e.preventDefault();
  const top = id === 'top' || !id ? 0 : el.getBoundingClientRect().top + y();
  history.replaceState(null, '', `#${id}`);
  animateTo(top);
}

/** Scroll to a position: eased when the pager is active, native smooth otherwise. */
export function scrollToY(top: number) {
  if (active) animateTo(top);
  else window.scrollTo({ top, behavior: 'smooth' });
}

let inited = false;
export function initPager() {
  if (inited) return;
  inited = true;
  const mq = window.matchMedia('(min-width: 1024px) and (min-height: 700px) and (pointer: fine)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => {
    active = mq.matches && !reduce.matches;
    document.documentElement.classList.toggle('paged', active);
    if (active) collect();
  };
  update();
  mq.addEventListener('change', update);
  reduce.addEventListener('change', update);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('keydown', onKey);
  document.addEventListener('click', onClick);
  window.addEventListener('resize', () => {
    if (!active) return;
    collect();
    // keep the current screen aligned after a resize
    const s = stops[currentIndex()];
    if (s && s.end === s.top) window.scrollTo(0, s.top);
  });
  // align on load if the browser restored a mid-screen position
  window.addEventListener('load', () => {
    if (!active) return;
    collect();
    const s = stops[currentIndex()];
    if (s && s.end === s.top && Math.abs(y() - s.top) > 2) window.scrollTo(0, s.top);
  });
}
