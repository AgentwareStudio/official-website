// Helpers the VoxNexus scenes share: a scripted timeline, scroll progress as a CSS variable, typed text and the
// breathing voice line.
import { useCallback, useEffect, useRef, useState } from 'react';
import { clamp, prefersReducedMotion } from '../../../lib';

/**
 * A scripted animation of `total` ms. `t` starts at the end (the finished picture, which is also what the built HTML
 * and reduced-motion visitors get); `play()` runs it from 0. `at` cues fire once as the clock passes them.
 */
export function useTimeline(total: number, cues: { at: number; run: () => void }[] = []) {
  const [t, setT] = useState(total);
  const raf = useRef(0);
  const cueRef = useRef(cues);
  cueRef.current = cues;
  // The script can change between renders (another sentence, another length): `play` always runs the current one.
  const totalRef = useRef(total);
  totalRef.current = total;
  const play = useCallback(() => {
    cancelAnimationFrame(raf.current);
    const total = totalRef.current;
    if (prefersReducedMotion()) { setT(total); return; }
    let start = 0;
    let last = -1;
    const step = (now: number) => {
      start ||= now;
      const cur = Math.min(total, now - start);
      for (const c of cueRef.current) if (c.at > last && c.at <= cur) c.run();
      last = cur;
      setT(cur);
      if (cur < total) raf.current = requestAnimationFrame(step);
    };
    setT(0);
    raf.current = requestAnimationFrame(step);
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return { t, play, playing: t < total };
}

/** Calls `run` the first time the element is well inside the viewport. */
export function useFirstView<E extends Element>(run: () => void, threshold = 0.45) {
  const ref = useRef<E | null>(null);
  const done = useRef(false);
  const fn = useRef(run);
  fn.current = run;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || done.current) return;
      done.current = true;
      io.disconnect();
      fn.current();
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return ref;
}

/**
 * Writes how far the element has scrolled through the viewport into its `--p` (0 when its top reaches the top of the
 * viewport, 1 when its bottom reaches the bottom): the progress of a tall section with a sticky stage inside.
 * Without JavaScript or with reduced motion the stylesheet's default (1, the finished picture) stays.
 */
export function useScrollProgress<E extends HTMLElement>() {
  const ref = useRef<E | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      el.style.setProperty('--p', String(span > 0 ? clamp(-r.top / span) : 1));
    };
    const onScroll = () => { raf ||= requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return ref;
}

/** Text that appears a character at a time. The full text is always there for assistive technology and for layout. */
export function Typed({ text, k, className = '' }: { text: string; k: number; className?: string }) {
  const chars = Array.from(text);
  const n = Math.round(clamp(k) * chars.length);
  return (
    <span className={`vx-typed ${className}`}>
      <span className="visually-hidden">{text}</span>
      <span aria-hidden="true">{chars.slice(0, n).join('')}<span className="vx-typed__rest">{chars.slice(n).join('')}</span></span>
    </span>
  );
}

/**
 * The voice line: a glowing waveform across its box. It breathes while idle and swells with `energy` (0–1, read each
 * frame). Drawn only while on screen; one still frame with reduced motion.
 */
export function Wave({ energy, className = '' }: { energy: () => number; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const level = useRef(energy);
  level.current = energy;
  useEffect(() => {
    const canvas = ref.current;
    const g = canvas?.getContext('2d');
    if (!canvas || !g) return;
    let raf = 0;
    let visible = false;
    let w = 0;
    let h = 0;
    let amp = 0.3;
    const accent = getComputedStyle(canvas).getPropertyValue('--accent').trim() || '#4f5bd5';
    const size = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const draw = (now: number) => {
      const time = now / 1000;
      amp += (0.3 + 0.7 * clamp(level.current()) - amp) * 0.08;
      g.clearRect(0, 0, w, h);
      const grad = g.createLinearGradient(0, 0, w, 0);
      grad.addColorStop(0, 'rgba(244,243,239,0)');
      grad.addColorStop(0.18, 'rgba(244,243,239,.95)');
      grad.addColorStop(0.7, accent);
      grad.addColorStop(1, 'rgba(79,91,213,0)');
      for (const [width, alpha, blur] of [[7, 0.14, 14], [1.6, 1, 0]] as const) {
        g.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const u = x / w;
          // Quiet at both ends, loudest a little left of the middle.
          const env = Math.pow(Math.sin(Math.PI * u), 1.6);
          const y = h / 2 + env * amp * (h * 0.42) * (
            Math.sin(u * 22 - time * 3.1) * 0.55 + Math.sin(u * 47 + time * 4.3) * 0.28 + Math.sin(u * 9 - time * 1.2) * 0.4);
          if (x === 0) g.moveTo(x, y); else g.lineTo(x, y);
        }
        g.strokeStyle = grad; g.globalAlpha = alpha; g.lineWidth = width; g.shadowBlur = blur; g.shadowColor = accent;
        g.stroke();
      }
      g.globalAlpha = 1;
    };
    const loop = (now: number) => { draw(now); raf = visible ? requestAnimationFrame(loop) : 0; };
    size();
    if (prefersReducedMotion()) { draw(1200); return; }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);
    const onResize = () => { size(); if (!visible) draw(performance.now()); };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} className={`vx-wave ${className}`} aria-hidden="true" />;
}
