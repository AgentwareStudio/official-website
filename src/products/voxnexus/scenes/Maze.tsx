// The old way and its end. A phone menu grows as the page scrolls — keys, branches, more branches — until one spoken
// sentence breaks it apart and a single line is left. Everything follows `--p` (scroll progress, shared.tsx); the
// positions are fixed numbers, so the built HTML and the browser agree.
import type { VoxCopy } from '../product';
import { useScrollProgress } from './shared';

interface Node { x: number; y: number; key: string; parent: number; dx: number; dy: number }

// A tree of menu keys: one root, then three levels of branches, in a 100 × 100 box.
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '＃', '0', '＊'];
const NODES: Node[] = (() => {
  const out: Node[] = [{ x: 50, y: 10, key: '☎', parent: -1, dx: 0, dy: -60 }];
  const levels = [3, 7, 12];
  let first = 0;
  let k = 0;
  levels.forEach((count, li) => {
    const start = out.length;
    const parents = out.length - first;
    for (let i = 0; i < count; i++) {
      const x = 8 + (84 * (i + 0.5)) / count + ((i * 37 + li * 11) % 7) - 3;
      const y = 32 + li * 24 + ((i * 53) % 9) - 4;
      const a = (i * 2.399 + li) % 6.283;
      out.push({ x, y, key: KEYS[k++ % KEYS.length], parent: first + Math.min(parents - 1, Math.floor((i * parents) / count)), dx: Math.cos(a) * 70, dy: Math.sin(a) * 70 + 20 });
    }
    first = start;
  });
  return out;
})();

export function Maze({ copy }: { copy: VoxCopy }) {
  const [qo, qc] = copy.ui.quote;
  const ref = useScrollProgress<HTMLElement>();
  const m = copy.scenes.maze;
  return (
    <section className="vx-maze" ref={ref} aria-label={`${copy.shift.old} ${copy.shift.now}`}>
      <div className="vx-maze__stage">
        <div className="vx-maze__tree" aria-hidden="true">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            {NODES.slice(1).map((n, i) => {
              const p = NODES[n.parent];
              return <line key={i} x1={p.x} y1={p.y} x2={n.x} y2={n.y} style={{ '--a': (0.04 + (i / NODES.length) * 0.46).toFixed(3) } as React.CSSProperties} />;
            })}
          </svg>
          {NODES.map((n, i) => (
            <span key={i} className="vx-maze__key" style={{ left: `${n.x}%`, top: `${n.y}%`, '--a': (0.02 + (i / NODES.length) * 0.46).toFixed(3), '--dx': n.dx.toFixed(1), '--dy': n.dy.toFixed(1) } as React.CSSProperties}>{n.key}</span>
          ))}
        </div>
        <ul className="vx-maze__menu" aria-hidden="true">
          {m.keys.map((k, i) => <li key={k} style={{ '--a': (0.05 + i * 0.065).toFixed(3) } as React.CSSProperties}>{k}</li>)}
        </ul>
        <div className="wrap vx-maze__copy">
          <p className="vx-maze__old">{copy.shift.old}</p>
          <p className="vx-maze__say" aria-hidden="true">{qo}{m.say}{qc}</p>
          <i className="vx-maze__line" aria-hidden="true" />
          <p className="vx-maze__now">{copy.shift.now}</p>
        </div>
      </div>
    </section>
  );
}
