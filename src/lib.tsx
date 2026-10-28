import { Fragment, useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

/** Chinese-aware text: "|" separates phrases (lines only wrap between them), "\n" forces a break. */
export function T({ children }: { children: string }) {
  const lines = children.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line.split('|').map((p, j) => (
            <span className="ph" key={j}>
              {p}
            </span>
          ))}
        </Fragment>
      ))}
    </>
  );
}

/** Lines that always start on their own row; each line may still wrap at its "|" phrase boundaries. */
export function Lines({ lines, className = '' }: { lines: string[]; className?: string }) {
  return (
    <>
      {lines.map((l, i) => (
        <span className={`ln ${className}`} key={i}>
          <T>{l}</T>
        </span>
      ))}
    </>
  );
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function useReducedMotion() {
  return useMedia('(prefers-reduced-motion: reduce)');
}

export function useInView<T extends Element>(opts: IntersectionObserverInit = { threshold: 0.2 }) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), opts);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView] as const;
}

/**
 * A media query's current value. Server-rendered HTML has no viewport, so the server snapshot is
 * false; while hydrating, React uses that value and then re-renders with the browser's.
 */
export function useMedia(query: string) {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false);
}

/** Calm fade-up for elements with .reveal, once. */
export function useRevealOnScroll() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (prefersReducedMotion()) {
      els.forEach((e) => e.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** requestAnimationFrame clock (ms) that runs only while `running`. */
export function useClock(running: boolean) {
  const [t, setT] = useState(0);
  const base = useRef<number | null>(null);
  const acc = useRef(0);
  useEffect(() => {
    if (!running) {
      base.current = null;
      return;
    }
    let raf = 0;
    const tick = (now: number) => {
      if (base.current === null) base.current = now - acc.current;
      acc.current = now - base.current;
      setT(acc.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);
  const reset = () => {
    acc.current = 0;
    base.current = null;
    setT(0);
  };
  return [t, reset] as const;
}
