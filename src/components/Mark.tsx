import { useEffect, useId, useRef } from 'react';
import { prefersReducedMotion } from '../lib';
import { ui } from '../content';

// Official AGENTWARE mark geometry (VIS v1.2.2, motion/agentware_motion_compare.html).
const G = { K: 0.30247, cx: 37.288, base: 71.013, H: 3.066, D: { x: 68.566, y: 45.039 }, r: 6.132, Y0: 64.882 };
const BR_L = 'M20,16 L24.679,16 L24.679,22.6 L20.6,22.6 L20.6,77.4 L24.679,77.4 L24.679,84 L20,84 L14,78 L14,22 Z';
const BR_R = 'M80,16 L75.321,16 L75.321,22.6 L79.4,22.6 L79.4,77.4 L75.321,77.4 L75.321,84 L80,84 L86,78 L86,22 Z';
const LEGS = 'M32.328,71.013 L45.039,28.987 L54.961,28.987 L67.672,71.013 L57.751,71.013 L50,45.387 L42.249,71.013 Z';
const CLIP = 'M53.807,0 L100,0 L100,71.013 L32.328,71.013 Z';

function barPath(sy: number, t = 1) {
  if (t <= 0) return '';
  const S = { x: G.cx + (G.base - sy) * G.K, y: sy };
  const dx = G.D.x - S.x, dy = G.D.y - S.y, L = Math.hypot(dx, dy);
  const ux = dx / L, uy = dy / L, nx = -uy * G.H, ny = ux * G.H;
  const s0 = { x: S.x - ux * 6, y: S.y - uy * 6 };
  const e = { x: S.x + dx * t, y: S.y + dy * t };
  const f = (v: number) => v.toFixed(3);
  return `M${f(s0.x + nx)},${f(s0.y + ny)} L${f(e.x + nx)},${f(e.y + ny)} L${f(e.x - nx)},${f(e.y - ny)} L${f(s0.x - nx)},${f(s0.y - ny)} Z`;
}
const quartOut = (t: number) => 1 - Math.pow(1 - t, 4);
const quartInOut = (t: number) => (t < 0.5 ? 8 * t ** 4 : 1 - Math.pow(-2 * t + 2, 4) / 2);
const seg = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));

/**
 * Live mark: A · Reveal (once per session), B · Pivot (pointer moves the path start along the left leg,
 * the outcome point never moves), C · Working offsets on tap / click. Keyboard: ↑ ↓ to pivot.
 */
export function LiveMark({ size = 112, reveal = false, tone = 'dark', label }: { size?: number; reveal?: boolean; tone?: 'dark' | 'light'; label?: string }) {
  const id = useId().replace(/:/g, '');
  const host = useRef<HTMLDivElement>(null);
  const bar = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const brl = useRef<SVGPathElement>(null);
  const brr = useRef<SVGPathElement>(null);
  const wipe = useRef<SVGRectElement>(null);

  useEffect(() => {
    const el = host.current!;
    const k = 120, w = Math.sqrt(k);
    const s = { x: G.Y0, v: 0, target: G.Y0 };
    let running = false, last = 0, busy = false;
    const step = (dt: number) => {
      const f = -k * (s.x - s.target) - 2 * w * s.v;
      s.v += f * dt; s.x += s.v * dt;
      return Math.abs(s.x - s.target) > 0.002 || Math.abs(s.v) > 0.002;
    };
    const loop = (now: number) => {
      const dt = Math.min(0.033, (now - last) / 1000); last = now;
      const moving = step(dt);
      bar.current?.setAttribute('d', barPath(s.x));
      if (moving) requestAnimationFrame(loop); else running = false;
    };
    const kick = () => {
      if (busy) return;
      if (prefersReducedMotion()) { s.x = s.target; bar.current?.setAttribute('d', barPath(s.x)); return; }
      if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); }
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const r = el.getBoundingClientRect();
      const v = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
      s.target = 54 + v * 16; kick();
    };
    const onLeave = () => { s.target = G.Y0; kick(); };
    const offsets = [-8.5, 3.5, -5, 0];
    let oi = -1;
    const onClick = () => {
      if (reveal) { if (!busy) { s.target = G.Y0; s.x = G.Y0; s.v = 0; play(); } return; }
      oi = (oi + 1) % offsets.length; s.target = G.Y0 + offsets[oi]; kick();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
        s.target = Math.min(70, Math.max(54, s.target + (e.key === 'ArrowUp' ? -3 : 3)));
        kick();
      }
      if (e.key === 'Escape' || e.key === 'Home') { s.target = G.Y0; kick(); }
      if (reveal && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onClick(); }
    };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('click', onClick);
    el.addEventListener('keydown', onKey);

    let io: IntersectionObserver | null = null;
    const root = document.documentElement;
    const play = () => {
      busy = true;
      const T0 = performance.now(), dur = 1700;
      const setFrame = (t: number) => {
        const d = quartOut(seg(t, 0, 380));
        dot.current?.setAttribute('r', (G.r * d).toFixed(3));
        const b = quartOut(seg(t, 380, 900));
        brl.current?.setAttribute('transform', `translate(${(-9 * (1 - b)).toFixed(3)} 0)`);
        brr.current?.setAttribute('transform', `translate(${(9 * (1 - b)).toFixed(3)} 0)`);
        if (brl.current && brr.current) brl.current.style.opacity = brr.current.style.opacity = String(b);
        const a = quartOut(seg(t, 760, 1240));
        wipe.current?.setAttribute('y', (G.base - 42.026 * a).toFixed(3));
        wipe.current?.setAttribute('height', a > 0 ? (42.026 * a + 0.5).toFixed(3) : '0');
        bar.current?.setAttribute('d', barPath(G.Y0, quartInOut(seg(t, 1180, 1640))));
      };
      setFrame(0);
      root.classList.remove('reveal-pending');
      const frame = (now: number) => {
        const t = now - T0;
        setFrame(t);
        if (t < dur) requestAnimationFrame(frame);
        else {
          wipe.current?.setAttribute('y', '0'); wipe.current?.setAttribute('height', '100');
          brl.current?.removeAttribute('transform'); brr.current?.removeAttribute('transform');
          if (brl.current && brr.current) brl.current.style.opacity = brr.current.style.opacity = '';
          busy = false;
        }
      };
      requestAnimationFrame(frame);
    };
    if (reveal && !prefersReducedMotion()) {
      io = new IntersectionObserver((es, o) => { if (es.some((x) => x.isIntersecting)) { o.disconnect(); play(); } }, { threshold: 0.4 });
      io.observe(el);
    } else if (reveal) {
      root.classList.remove('reveal-pending');
    }
    return () => {
      io?.disconnect();
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('click', onClick);
      el.removeEventListener('keydown', onKey);
    };
  }, [reveal]);

  return (
    <div
      ref={host}
      className={`live-mark live-mark--${tone}`}
      style={{ width: size, height: size }}
      tabIndex={0}
      role="img"
      aria-label={label ?? (reveal ? ui.markAria : ui.markAriaLight)}
    >
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <defs>
          <clipPath id={`c${id}`}><path d={CLIP} /></clipPath>
          <clipPath id={`w${id}`}><rect ref={wipe} x="0" y="0" width="100" height="100" /></clipPath>
        </defs>
        <path ref={brl} className="ink" d={BR_L} />
        <path ref={brr} className="ink" d={BR_R} />
        <g clipPath={`url(#w${id})`}><path className="ink" d={LEGS} /></g>
        <path ref={bar} className="ink" clipPath={`url(#c${id})`} d={barPath(G.Y0)} />
        <circle ref={dot} className="dot" cx={G.D.x} cy={G.D.y} r={G.r} />
      </svg>
    </div>
  );
}

/** Static official mark (brackets + A + outcome point) for small uses. */
export function StaticMark({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg className={`static-mark ${className}`} viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <path className="ink" d={BR_L} />
      <path className="ink" d={BR_R} />
      <path className="ink" d={LEGS} />
      <path className="ink" d={barPath(G.Y0)} clipPath="none" />
      <circle className="dot" cx={G.D.x} cy={G.D.y} r={G.r} />
    </svg>
  );
}
