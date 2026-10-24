import { useEffect, useMemo, useRef, useState } from 'react';
import { loop, ui } from '../content';
import { fmt, isZh } from '../i18n';
import { T as Phrase, easeInOut, seg, useMedia, useReducedMotion } from '../lib';

/*
  The runtime loop as a small control-plane console.
  Left: the loop inside the authorization boundary, above the deterministic core it drives.
  Right: what the system is doing right now — the step, an execution trace, and run metrics.
  Signal Orange appears only when a verified outcome is delivered; UI status colours (ok / warn) do the rest.
*/

type NodeId = 'h' | 'n1' | 'n2' | 'n3' | 'n4' | 'n5' | 'n6' | 'n7' | 'out';
type P = [number, number];
type Anchor = 'middle' | 'start' | 'end';
const STEP_OF: Partial<Record<NodeId, number>> = { n1: 0, n2: 1, n3: 2, n4: 3, n5: 4, n6: 5, n7: 6, out: 7 };
const CORE_META = [
  { id: 'mem', en: 'MEMORY', zh: '记忆', from: 'n2' as NodeId },
  { id: 'db', en: 'DATABASE', zh: '数据库', from: 'n4' as NodeId },
  { id: 'api', en: 'APIs · MCP', zh: '接口', from: 'n4' as NodeId },
  { id: 'rules', en: 'BUSINESS RULES', zh: '业务规则', from: 'n7' as NodeId },
];

type Geo = {
  vb: string; grid: [number, number, number, number];
  C: P; R: number; POS: Record<NodeId, P>; EDGES: Record<string, string>;
  boundary: [string, string]; boundaryLabel: [number, number, Anchor]; planeLabel: [number, number];
  handLabel: { x: number; y: number; rotate?: number; anchor: Anchor };
  core: { id: string; en: string; zh: string; from: NodeId; x: number; y: number; w: number }[];
  coreRule: [number, number, number, number]; coreLabel: [number, number];
  beam: (from: P, c: { x: number; y: number }) => string;
  labels: Record<string, [number, number, Anchor]>;
  human: { label: [number, number, Anchor] }; out: { label: [number, number, Anchor] };
};

const arcD = (R: number, a: P, b: P) => `M${a[0]},${a[1]} A${R},${R} 0 0 1 ${b[0]},${b[1]}`;

function wideGeo(): Geo {
  const C: P = [372, 178], R = 80;
  const POS: Record<NodeId, P> = {
    h: [38, 178], n1: [132, 178], n2: [214, 178],
    n3: [C[0], C[1] - R], n4: [C[0] + R, C[1]], n5: [C[0], C[1] + R], n6: [C[0] - R, C[1]],
    n7: [548, 178], out: [668, 178],
  };
  const CORE_Y = 382;
  const xs = [214, 330, 446, 562];
  return {
    vb: '14 0 698 428', grid: [14, 0, 698, 428], C, R, POS,
    EDGES: {
      'h-n1': `M${POS.h[0] + 9},178 L${POS.n1[0]},178`,
      'n1-n2': `M${POS.n1[0]},178 L${POS.n2[0]},178`,
      'n2-n3': `M${POS.n2[0]},178 C${POS.n2[0] + 40},178 ${POS.n3[0] - 70},${POS.n3[1]} ${POS.n3[0]},${POS.n3[1]}`,
      'n3-n4': arcD(R, POS.n3, POS.n4), 'n4-n5': arcD(R, POS.n4, POS.n5),
      'n5-n6': arcD(R, POS.n5, POS.n6), 'n6-n3': arcD(R, POS.n6, POS.n3),
      'n5-n7': `M${POS.n5[0]},${POS.n5[1]} C${POS.n5[0] + 110},${POS.n5[1]} ${POS.n7[0]},${POS.n5[1] - 4} ${POS.n7[0]},178`,
      'n7-out': `M${POS.n7[0]},178 L${POS.out[0]},178`,
      'n7-h': `M${POS.n7[0]},178 L${POS.n7[0]},24 L${POS.h[0]},24 L${POS.h[0]},${178 - 9}`,
    },
    boundary: ['M104,44 L86,44 L74,56 L74,300 L86,312 L104,312', 'M590,44 L608,44 L620,56 L620,300 L608,312 L590,312'],
    boundaryLabel: [347, 38, 'middle'], planeLabel: [96, 70],
    handLabel: { x: 294, y: 16, anchor: 'middle' },
    core: CORE_META.map((c, i) => ({ ...c, x: xs[i], y: CORE_Y, w: 104 })),
    coreRule: [74, CORE_Y - 40, 690, CORE_Y - 40], coreLabel: [74, CORE_Y - 48],
    beam: (f, c) => `M${f[0]},${f[1] + 10} L${f[0]},${c.y - 26} L${c.x},${c.y - 26} L${c.x},${c.y - 14}`,
    labels: { n1: [0, 30, 'middle'], n2: [0, -20, 'middle'], n3: [0, -20, 'middle'], n4: [16, 4, 'start'], n5: [0, 30, 'middle'], n6: [-12, 26, 'end'], n7: [0, 30, 'middle'] },
    human: { label: [0, 30, 'middle'] }, out: { label: [0, 30, 'middle'] },
  };
}

function tallGeo(): Geo {
  const C: P = [180, 300], R = 72;
  const POS: Record<NodeId, P> = {
    h: [180, 24], n1: [180, 98], n2: [180, 160],
    n3: [C[0], C[1] - R], n4: [C[0] + R, C[1]], n5: [C[0], C[1] + R], n6: [C[0] - R, C[1]],
    n7: [180, 448], out: [180, 532],
  };
  const CORE_Y = 606;
  const xs = [48, 136, 224, 312];
  return {
    vb: '0 0 360 660', grid: [0, 0, 360, 660], C, R, POS,
    EDGES: {
      'h-n1': `M180,${24 + 9} L180,${POS.n1[1]}`,
      'n1-n2': `M180,${POS.n1[1]} L180,${POS.n2[1]}`,
      'n2-n3': `M180,${POS.n2[1]} L180,${POS.n3[1]}`,
      'n3-n4': arcD(R, POS.n3, POS.n4), 'n4-n5': arcD(R, POS.n4, POS.n5),
      'n5-n6': arcD(R, POS.n5, POS.n6), 'n6-n3': arcD(R, POS.n6, POS.n3),
      'n5-n7': `M180,${POS.n5[1]} L180,${POS.n7[1]}`,
      'n7-out': `M180,${POS.n7[1]} L180,${POS.out[1]}`,
      'n7-h': `M180,${POS.n7[1]} L20,${POS.n7[1]} L20,24 L${180 - 9},24`,
    },
    boundary: ['M44,82 L44,70 L56,58 L304,58 L316,70 L316,82', 'M44,474 L44,486 L56,498 L304,498 L316,486 L316,474'],
    boundaryLabel: [180, 52, 'middle'], planeLabel: [56, 78],
    handLabel: { x: 12, y: 260, rotate: -90, anchor: 'middle' },
    core: CORE_META.map((c, i) => ({ ...c, x: xs[i], y: CORE_Y, w: 80 })),
    coreRule: [8, CORE_Y - 30, 352, CORE_Y - 30], coreLabel: [8, CORE_Y - 38],
    beam: (f, c) => `M${f[0]},${f[1]} L${c.x},${c.y - 14}`,
    labels: { n1: [16, 4, 'start'], n2: [16, 4, 'start'], n3: [-14, -6, 'end'], n4: [14, 4, 'start'], n5: [-14, 20, 'end'], n6: [-14, 4, 'end'], n7: [16, 4, 'start'] },
    human: { label: [16, 4, 'start'] }, out: { label: [18, 4, 'start'] },
  };
}
const WIDE = wideGeo();
const TALL = tallGeo();

type Kind = 'deliver' | 'handback';
type Seg =
  | { type: 'move'; edge: string; dur: number }
  | { type: 'dwell'; node: NodeId; dur: number; log: string; level?: 'info' | 'ok' | 'warn'; beam?: string; iter?: number };

const MOVE = 380, DWELL = 560;
function build(kind: Kind): Seg[] {
  const LG = ui.loop.logs;
  const s: Seg[] = [
    { type: 'move', edge: 'h-n1', dur: MOVE },
    { type: 'dwell', node: 'n1', dur: DWELL, log: LG.intent },
    { type: 'move', edge: 'n1-n2', dur: MOVE },
    { type: 'dwell', node: 'n2', dur: DWELL, log: LG.context, beam: 'mem' },
    { type: 'move', edge: 'n2-n3', dur: MOVE + 120 },
    { type: 'dwell', node: 'n3', dur: DWELL, log: LG.plan1, iter: 1 },
    { type: 'move', edge: 'n3-n4', dur: MOVE },
    { type: 'dwell', node: 'n4', dur: DWELL, log: LG.act1, beam: 'db' },
    { type: 'move', edge: 'n4-n5', dur: MOVE },
    { type: 'dwell', node: 'n5', dur: DWELL, log: LG.observe1, level: 'warn' },
    { type: 'move', edge: 'n5-n6', dur: MOVE },
    { type: 'dwell', node: 'n6', dur: DWELL, log: LG.adapt },
    { type: 'move', edge: 'n6-n3', dur: MOVE },
    { type: 'dwell', node: 'n3', dur: DWELL - 160, log: LG.plan2, iter: 2 },
    { type: 'move', edge: 'n3-n4', dur: MOVE },
  ];
  if (kind === 'deliver') {
    s.push(
      { type: 'dwell', node: 'n4', dur: DWELL, log: LG.act2ok, beam: 'api' },
      { type: 'move', edge: 'n4-n5', dur: MOVE },
      { type: 'dwell', node: 'n5', dur: DWELL, log: LG.observe2ok, level: 'ok' },
      { type: 'move', edge: 'n5-n7', dur: MOVE + 160 },
      { type: 'dwell', node: 'n7', dur: DWELL + 120, log: LG.verifyOk, level: 'ok', beam: 'rules' },
      { type: 'move', edge: 'n7-out', dur: MOVE },
      { type: 'dwell', node: 'out', dur: 400, log: LG.deliver, level: 'ok' }
    );
  } else {
    s.push(
      { type: 'dwell', node: 'n4', dur: DWELL + 120, log: LG.act2warn, level: 'warn', beam: 'rules' },
      { type: 'move', edge: 'n4-n5', dur: MOVE },
      { type: 'dwell', node: 'n5', dur: DWELL, log: LG.observe2warn, level: 'warn' },
      { type: 'move', edge: 'n5-n7', dur: MOVE + 160 },
      { type: 'dwell', node: 'n7', dur: DWELL + 120, log: LG.verifyFail, level: 'warn' },
      { type: 'move', edge: 'n7-h', dur: MOVE + 520 },
      { type: 'dwell', node: 'h', dur: 400, log: LG.handback, level: 'warn' }
    );
  }
  return s;
}

type RunState = 'idle' | 'running' | 'delivered' | 'handback';

export function ExecutionLoop() {
  const reduce = useReducedMotion();
  const narrow = useMedia('(max-width: 640px)');
  const G = narrow ? TALL : WIDE;
  const { POS, EDGES, C, R } = G;
  const [kind, setKind] = useState<Kind>('deliver');
  const [run, setRun] = useState<RunState>('idle');
  const [t, setT] = useState(0);
  const [inspect, setInspect] = useState<number | null>(null);
  const host = useRef<HTMLDivElement>(null);
  const paths = useRef<Record<string, SVGPathElement | null>>({});
  // User-unit lengths survive font loading and CSS scaling. A changed d or a new
  // path element (the wide/tall SVG is keyed) must be measured again.
  const lengths = useMemo(() => new WeakMap<SVGPathElement, { d: string | null; length: number }>(), []);
  const pathLength = (el: SVGPathElement) => {
    const d = el.getAttribute('d');
    const cached = lengths.get(el);
    if (cached?.d === d) return cached.length;
    const length = el.getTotalLength();
    lengths.set(el, { d, length });
    return length;
  };
  const started = useRef(false);
  const raf = useRef(0);

  const segs = useMemo(() => build(kind), [kind]);
  const total = useMemo(() => segs.reduce((a, s) => a + s.dur, 0), [segs]);

  const start = (k: Kind) => {
    cancelAnimationFrame(raf.current);
    setInspect(null);
    setKind(k);
    setRun('running');
    if (reduce) {
      // reduced motion: jump straight to the final state, trace fully written
      setT(1e9);
      setRun(k === 'deliver' ? 'delivered' : 'handback');
      return;
    }
    const segsK = build(k);
    const totalK = segsK.reduce((a, s) => a + s.dur, 0);
    const t0 = performance.now();
    const tick = (now: number) => {
      const e = now - t0;
      setT(e);
      if (e < totalK + 200) raf.current = requestAnimationFrame(tick);
      else setRun(k === 'deliver' ? 'delivered' : 'handback');
    };
    setT(0);
    raf.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  // Auto-run once, the first time the console is properly on screen.
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          start('deliver');
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- derive the frame ----
  const tt = Math.min(t, total);
  let acc = 0;
  let cur: Seg | null = null, curK = 0, curIdx = 0;
  const visited = new Set<string>();
  const litEdges: Record<string, number> = {};
  const logs: { at: number; text: string; level: string; step: string; k: number }[] = [];
  let iter = 0;
  let toolCalls = 0;
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (tt >= acc) {
      const k = seg(tt, acc, acc + s.dur);
      if (s.type === 'move') litEdges[s.edge] = Math.max(litEdges[s.edge] ?? 0, k);
      else {
        visited.add(s.node);
        if (s.iter) iter = s.iter;
        if (s.node === 'n4') toolCalls++;
        const stepIdx = STEP_OF[s.node];
        logs.push({
          at: acc,
          text: s.log,
          level: s.level ?? 'info',
          step: s.node === 'h' ? 'HANDBACK' : stepIdx !== undefined ? loop.steps[stepIdx].en.toUpperCase() : '',
          k: seg(tt, acc, acc + Math.min(s.dur, 520)),
        });
      }
      if (tt < acc + s.dur || i === segs.length - 1) { cur = s; curK = k; curIdx = i; }
    }
    acc += s.dur;
  }
  const running = run === 'running';
  const finished = run === 'delivered' || run === 'handback';
  const idle = run === 'idle';

  // packet position
  let packet: P | null = null;
  const trail: P[] = [];
  if (running && cur) {
    if (cur.type === 'move') {
      const el = paths.current[cur.edge];
      if (el) {
        const L = pathLength(el);
        const k = easeInOut(curK);
        const p = el.getPointAtLength(L * k);
        packet = [p.x, p.y];
        for (let j = 1; j <= 6; j++) {
          const q = el.getPointAtLength(Math.max(0, L * k - j * 7));
          trail.push([q.x, q.y]);
        }
      }
    } else packet = POS[cur.node];
  }
  const activeNode: NodeId | null = running && cur && cur.type === 'dwell' ? cur.node : running && cur && cur.type === 'move' ? null : null;
  const activeLevel = running && cur && cur.type === 'dwell' ? cur.level ?? 'info' : 'info';
  const beam = running && cur && cur.type === 'dwell' ? cur.beam : undefined;

  // which step does the right panel show?
  let stepIdx: number | 'handback' = 0;
  if (inspect !== null) stepIdx = inspect;
  else if (run === 'handback') stepIdx = 'handback';
  else if (run === 'delivered') stepIdx = 7;
  else if (running) {
    for (let i = curIdx; i >= 0; i--) {
      const s = segs[i];
      if (s.type === 'dwell') { stepIdx = s.node === 'h' ? 'handback' : STEP_OF[s.node] ?? 0; break; }
    }
  }
  const step = stepIdx === 'handback' ? loop.handback : loop.steps[stepIdx];
  const stepNo = stepIdx === 'handback' ? '— / 08' : `${String(stepIdx + 1).padStart(2, '0')} / 08`;

  const U = ui.loop;
  const status =
    run === 'running' ? { cls: 'is-running', en: 'RUNNING', zh: U.running } :
    run === 'delivered' ? { cls: 'is-ok', en: 'DELIVERED · VERIFIED', zh: U.delivered } :
    run === 'handback' ? { cls: 'is-warn', en: 'HANDED BACK', zh: U.handback } :
    { cls: 'is-idle', en: 'READY', zh: U.idle };

  const delivered = run === 'delivered' || (running && kind === 'deliver' && visited.has('out'));
  const handedBack = run === 'handback' || (running && kind === 'handback' && visited.has('h'));
  const touchedEdge = kind === 'handback' && (run === 'handback' || (running && toolCalls >= 2));
  const elapsed = (Math.min(t, total) / 1000).toFixed(2);
  const shownLogs = logs.slice(isZh ? -4 : -3);

  const nodeCls = (id: NodeId) => {
    const c = ['ln-node'];
    if (visited.has(id)) c.push('is-visited');
    if (activeNode === id) c.push('is-active', `lvl-${activeLevel}`);
    if (inspect !== null && STEP_OF[id] === inspect) c.push('is-inspected');
    if (id === 'n7' && run === 'handback') c.push('lvl-warn', 'is-visited');
    return c.join(' ');
  };

  return (
    <div className={`console run-${run} kind-${kind}`} ref={host}>
      <div className="console__top">
        <span className="console__title"><span lang="en">THE EXECUTION LOOP</span>{U.local && <span className="console__title-zh">{U.local}</span>}</span>
        <span className={`status ${status.cls}`} role="status" aria-live="polite">
          <i className="status__dot" aria-hidden="true" />
          <span lang="en">{status.en}</span>
          {status.zh && <span className="status__zh">{status.zh}</span>}
        </span>
      </div>

      <div className="console__body">
        {/* ---------- diagram ---------- */}
        <div className="console__diagram">
          <svg viewBox={G.vb} className={`loop-svg ${narrow ? 'is-tall' : ''}`} key={narrow ? 'tall' : 'wide'} role="img" aria-label={U.aria}>
            <defs>
              <radialGradient id="lg-w" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#F4F3EF" stopOpacity=".5" />
                <stop offset="1" stopColor="#F4F3EF" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="lg-o" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#FF4F00" stopOpacity=".5" />
                <stop offset="1" stopColor="#FF4F00" stopOpacity="0" />
              </radialGradient>
              <pattern id="lg-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path d="M24,0 L0,0 L0,24" fill="none" stroke="rgba(155,163,184,.06)" />
              </pattern>
            </defs>
            <rect x={G.grid[0]} y={G.grid[1]} width={G.grid[2]} height={G.grid[3]} fill="url(#lg-grid)" />

            {/* authorization boundary: chamfered brackets */}
            <g className={`ln-boundary ${handedBack ? 'is-warn' : ''}`}>
              <path d={G.boundary[0]} />
              <path d={G.boundary[1]} />
              <text x={G.boundaryLabel[0]} y={G.boundaryLabel[1]} textAnchor={G.boundaryLabel[2]} className="ln-lbl ln-lbl--tiny">{`AUTHORIZED BOUNDARY${U.boundary ? ` · ${U.boundary}` : ''}`}</text>
            </g>
            {!narrow && <text x={G.planeLabel[0]} y={G.planeLabel[1]} className="ln-lbl ln-lbl--tiny ln-lbl--dim">AGENTIC CONTROL PLANE</text>}

            {/* ring guide */}
            <circle cx={C[0]} cy={C[1]} r={R} className="ln-ring" style={{ transformOrigin: `${C[0]}px ${C[1]}px` }} />
            <text x={C[0]} y={C[1] - 4} textAnchor="middle" className="ln-lbl ln-lbl--tiny ln-lbl--dim">LOOP</text>
            <text x={C[0]} y={C[1] + 12} textAnchor="middle" className="ln-lbl ln-lbl--iter">{iter ? `ITER ${iter}` : '—'}</text>

            {/* edges (base + lit overlay) */}
            {Object.entries(EDGES).map(([id, d]) => {
              const k = litEdges[id] ?? 0;
              const el = paths.current[id];
              const L = el ? pathLength(el) : 1000;
              const warn = id === 'n7-h';
              return (
                <g key={id} className={`ln-edge ${warn ? 'is-handback' : ''} ${id === 'n7-out' ? 'is-deliver' : ''}`}>
                  <path d={d} className="ln-edge__base" ref={(r) => { paths.current[id] = r; }} />
                  {k > 0 && (
                    <path d={d} className="ln-edge__lit" style={{ strokeDasharray: L, strokeDashoffset: L * (1 - easeInOut(k)) }} />
                  )}
                </g>
              );
            })}
            <text
              x={G.handLabel.x}
              y={G.handLabel.y}
              transform={G.handLabel.rotate ? `rotate(${G.handLabel.rotate} ${G.handLabel.x} ${G.handLabel.y})` : undefined}
              className={`ln-lbl ln-lbl--tiny ${handedBack ? 'ln-lbl--warn' : 'ln-lbl--dim'}`}
              textAnchor={G.handLabel.anchor}
            >
              {`HAND BACK${U.handbackLabel ? ` · ${U.handbackLabel}` : ''}`}
            </text>

            {/* beams down into the deterministic core */}
            {G.core.map((c) =>
              beam === c.id ? (
                <g key={c.id} className={`ln-beam lvl-${activeLevel}`}>
                  <path d={G.beam(POS[c.from], c)} />
                </g>
              ) : null
            )}

            {/* deterministic core */}
            <g className="ln-core">
              <line x1={G.coreRule[0]} y1={G.coreRule[1]} x2={G.coreRule[2]} y2={G.coreRule[3]} className="ln-core__rule" />
              <text x={G.coreLabel[0]} y={G.coreLabel[1]} className="ln-lbl ln-lbl--tiny ln-lbl--dim">{`DETERMINISTIC CORE${U.core ? ` · ${U.core}` : ''}`}</text>
              {G.core.map((c, ci) => (
                <g key={c.id} transform={`translate(${c.x} ${c.y})`} className={`ln-core__blk ${beam === c.id ? `is-on lvl-${activeLevel}` : ''}`}>
                  <rect x={-c.w / 2} y="-14" width={c.w} height="44" />
                  <text y="4" textAnchor="middle" className="ln-lbl ln-lbl--core">{narrow && c.id === 'rules' ? 'RULES' : c.en}</text>
                  {U.blocks[ci] && <text y="20" textAnchor="middle" className="ln-lbl ln-lbl--zh">{U.blocks[ci]}</text>}
                </g>
              ))}
            </g>

            {/* nodes */}
            {(['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7'] as NodeId[]).map((id) => {
              const i = STEP_OF[id]!;
              const p = POS[id];
              const s = loop.steps[i];
              const [lx, ly, anchor] = G.labels[id];
              return (
                <g
                  key={id}
                  className={nodeCls(id)}
                  transform={`translate(${p[0]} ${p[1]})`}
                  tabIndex={0}
                  role="button"
                  aria-label={fmt(U.inspect, { n: i + 1, name: s.zh })}
                  onClick={() => !running && setInspect(i)}
                  onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !running) { e.preventDefault(); setInspect(i); } }}
                >
                  <circle r="16" className="ln-node__hit" />
                  <circle r="12" className="ln-node__halo" />
                  <circle r="7" className="ln-node__dot" />
                  <text x={lx} y={ly} textAnchor={anchor} className="ln-lbl ln-lbl--node">
                    <tspan className="ln-lbl__no">{String(i + 1).padStart(2, '0')}</tspan> {s.en.toUpperCase()}
                  </text>
                </g>
              );
            })}

            {/* human + outcome */}
            <g className={`ln-human ${handedBack ? 'is-warn' : ''}`} transform={`translate(${POS.h[0]} ${POS.h[1]})`}>
              <circle r="8" className="ln-human__dot" />
              <text x={G.human.label[0]} y={G.human.label[1]} textAnchor={G.human.label[2]} className="ln-lbl ln-lbl--node">HUMAN</text>
              <text x={G.human.label[0]} y={G.human.label[1] + 15} textAnchor={G.human.label[2]} className="ln-lbl ln-lbl--zh">{U.human}</text>
            </g>
            <g className={`ln-out ${delivered ? 'is-delivered' : ''}`} transform={`translate(${POS.out[0]} ${POS.out[1]})`}>
              {delivered && <circle r="30" fill="url(#lg-o)" className="ln-out__glow" />}
              {delivered && <circle r="10" className="ln-out__ring" />}
              <circle r={delivered ? 9 : 7} className="ln-out__dot" />
              <text x={G.out.label[0]} y={G.out.label[1]} textAnchor={G.out.label[2]} className="ln-lbl ln-lbl--node">08 DELIVER</text>
              <text x={G.out.label[0]} y={G.out.label[1] + 15} textAnchor={G.out.label[2]} className="ln-lbl ln-lbl--zh">{delivered ? U.outcomeDone : U.outcome}</text>
            </g>

            {/* packet */}
            {trail.map((q, i) => (
              <circle key={i} cx={q[0]} cy={q[1]} r={3 - i * 0.4} className="ln-trail" style={{ opacity: 0.5 - i * 0.07 }} />
            ))}
            {packet && <circle cx={packet[0]} cy={packet[1]} r="16" fill="url(#lg-w)" />}
            {packet && <circle cx={packet[0]} cy={packet[1]} r="4" className={`ln-packet lvl-${activeLevel}`} />}
          </svg>
        </div>

        {/* ---------- readout ---------- */}
        <div className="console__readout">
          <div className="readout__step" key={`${stepIdx}-${run}`}>
            <div className="readout__meta">
              <span className="readout__no">{stepNo}</span>
              <span className="readout__en" lang="en">{step.en}</span>
            </div>
            <h4 className="readout__title">{step.zh}</h4>
            <p className="readout__text">{step.text}</p>
            <code className="readout__code"><span aria-hidden="true">›</span> {step.code}</code>
          </div>

          <div className="trace" aria-label={U.traceAria}>
            <div className="trace__head"><span>EXECUTION TRACE</span><span>{idle ? '—' : `T+${elapsed}s`}</span></div>
            <ol className="trace__list">
              {shownLogs.length === 0 && <li className="trace__empty">{U.traceEmpty}</li>}
              {shownLogs.map((l, i) => {
                const chars = Math.ceil(l.text.length * (reduce ? 1 : l.k));
                return (
                  <li key={`${l.at}-${i}`} className={`trace__line lvl-${l.level} ${i === shownLogs.length - 1 ? 'is-last' : ''}`}>
                    <span className="trace__t">{(l.at / 1000).toFixed(2)}</span>
                    <span className="trace__s">{l.step}</span>
                    <span className="trace__m">{l.text.slice(0, chars)}{running && i === shownLogs.length - 1 && chars < l.text.length && <i className="caret" />}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <dl className="metrics">
            <div><dt>ITERATION</dt><dd>{iter || 0}</dd></div>
            <div><dt>TOOL CALLS</dt><dd>{toolCalls}</dd></div>
            <div><dt>BOUNDARY</dt><dd className={touchedEdge ? 'is-warn' : idle ? '' : 'is-ok'}>{handedBack ? U.out : touchedEdge ? U.touched : idle ? '—' : U.inside}</dd></div>
          </dl>

          <div className="console__actions">
            <button type="button" className="btn btn--solid btn--sm" onClick={() => start('deliver')} disabled={running && kind === 'deliver'}>
              <span aria-hidden="true" className="btn__icon">▶</span>{finished || running ? U.rerun : U.run}
            </button>
            <button type="button" className="btn btn--line btn--sm" onClick={() => start('handback')} disabled={running && kind === 'handback'}>
              {U.simulate}
            </button>
          </div>
          <p className="console__hint">{U.hint}</p>
        </div>
      </div>
    </div>
  );
}

export function LoopHeading() {
  return <Phrase>{loop.title}</Phrase>;
}
