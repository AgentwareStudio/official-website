// What spans the whole VoxNexus page, and its last screen.
// Spine: the voice line down the page's edge, as long as the page has been scrolled.
// EndingField: one line among many — the last screen's backdrop.
import { useEffect, useRef } from 'react';
import { clamp, prefersReducedMotion } from '../../../lib';

export function Spine() {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.setProperty('--p', String(max > 0 ? clamp(window.scrollY / max) : 0));
    };
    const onScroll = () => { raf ||= requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); };
  }, []);
  return <div className="vx-spine" ref={ref} aria-hidden="true"><i className="vx-spine__line" /><i className="vx-spine__head" /></div>;
}

// Fixed, scattered lines (a 100 × 60 box): position, length and a delay for their shimmer.
const LINES = Array.from({ length: 46 }, (_, i) => {
  const x = (i * 37.7) % 100;
  const y = 4 + ((i * 23.3) % 52);
  const len = 6 + ((i * 13) % 16);
  return { x, y, len, delay: ((i * 0.37) % 4).toFixed(2), tilt: (((i * 7) % 9) - 4) * 0.5 };
});

export function EndingField() {
  const ref = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    // Shimmer only while on screen.
    const io = new IntersectionObserver(([e]) => el.classList.toggle('is-live', e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <svg className="vx-field" ref={ref} viewBox="0 0 100 60" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {LINES.map((l, i) => <line key={i} x1={l.x} y1={l.y} x2={l.x + l.len} y2={l.y + l.tilt} style={{ animationDelay: `${l.delay}s` }} />)}
    </svg>
  );
}
