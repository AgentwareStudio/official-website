import { useEffect, useMemo } from 'react';
import { clamp, easeInOut, easeOut, lerp, seg, useClock, useReducedMotion } from '../lib';
import { ui } from '../content';

/*
  One stage, three eras. The human node (left) and the outcome node (right) never move;
  only what sits between them changes.
  1.0  the human clicks through four function windows and stitches the result by hand.
  2.0  some windows are accelerated by AI, but every prompt goes out from the human and comes back to the human.
  3.0  the human hands over one intent; inside the authorization boundary the path is planned, blocked,
       re-routed and verified; the outcome lights up (the only Signal Orange on the screen).
*/

type P = [number, number];
const H: P = [58, 210];
const O: P = [584, 210];
const WIN_X = [172, 270, 368, 466];
const WIN_Y = 210;
const WW = 80, WH = 62;
const WIN_LABEL = ['APP', 'MENU', 'FORM', 'EXPORT'];

export const DURATION = [7600, 8200, 9000];

const quad = (a: P, c: P, b: P, t: number): P => [
  (1 - t) * (1 - t) * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0],
  (1 - t) * (1 - t) * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1],
];
const sampleQuad = (a: P, c: P, b: P, t1: number, n = 28): string => {
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const p = quad(a, c, b, (t1 * i) / n);
    pts.push(`${p[0].toFixed(1)},${p[1].toFixed(1)}`);
  }
  return pts.join(' ');
};
const plen = (pts: P[]) => pts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
/** Portion of a polyline up to fraction t, plus the head point. */
function partial(pts: P[], t: number): { d: string; head: P } {
  const total = plen(pts);
  let remain = clamp(t) * total;
  const out: P[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    if (remain >= l) { out.push(b); remain -= l; continue; }
    const k = l === 0 ? 0 : remain / l;
    out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]);
    break;
  }
  return { d: out.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' '), head: out[out.length - 1] };
}

/* ---------- 3.0 lattice ---------- */
const NODES: Record<string, P & { 2?: string }> = {
  a: [214, 142], b: [214, 278], c: [300, 210], d: [300, 120], e: [386, 142], f: [386, 278], g: [462, 210], h: [462, 120], i: [300, 300],
} as never;
const NODE_LABEL: Record<string, string> = { a: 'CONTEXT', b: 'MEMORY', d: 'API', e: 'MCP', f: 'DB', h: 'WEB', i: 'CLI' };
const ENTRY: P = [150, 210];
const EXIT: P = [516, 210];
const PLAN: P[] = [ENTRY, NODES.a, NODES.c, NODES.e, NODES.h, EXIT];
const ROUTE_A: P[] = [ENTRY, NODES.a, NODES.c, NODES.e];
const ROUTE_B: P[] = [NODES.e, NODES.f, NODES.g, EXIT];
// Boundary brackets with 45° chamfers, same geometry language as the mark.
const BR_L = 'M150,78 L130,78 L118,90 L118,330 L130,342 L150,342';
const BR_R = 'M496,78 L516,78 L528,90 L528,330 L516,342 L496,342';

export function ShiftStage({ phase, active, compact = false }: { phase: 0 | 1 | 2; active: boolean; compact?: boolean }) {
  const reduce = useReducedMotion();
  const [clock, reset] = useClock(active && !reduce);
  useEffect(() => { reset(); /* restart when the era changes */ }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps
  const dur = DURATION[phase];
  const t = reduce || !active ? (reduce ? dur * 0.82 : clock % dur) : clock % dur;
  const time = reduce ? dur * 0.82 : t;

  const v = useMemo(() => frame(phase, time), [phase, time]);

  return (
    <svg className={`shift-stage phase-${phase} ${compact ? 'is-compact' : ''}`} viewBox="12 46 612 340" role="img" aria-label={ui.stage.aria[phase]}>
      <defs>
        <radialGradient id="glow-o" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#FF4F00" stopOpacity=".45" />
          <stop offset="1" stopColor="#FF4F00" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glow-w" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#F4F3EF" stopOpacity=".35" />
          <stop offset="1" stopColor="#F4F3EF" stopOpacity="0" />
        </radialGradient>
        <pattern id="dotgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".8" fill="rgba(155,163,184,.16)" />
        </pattern>
      </defs>

      <rect x="12" y="46" width="612" height="340" fill="url(#dotgrid)" />

      {/* baseline axis */}
      <line x1={H[0]} y1={H[1]} x2={O[0]} y2={O[1]} className="axis" />

      {/* ---------------- 1.0 / 2.0 : function windows ---------------- */}
      <g className="layer layer-windows" data-on={phase !== 2}>
        {WIN_X.map((x, i) => {
          const s = v.win[i];
          const ai = phase === 1 && (i === 1 || i === 2);
          return (
            <g key={i} transform={`translate(${x - WW / 2} ${WIN_Y - WH / 2})`} className={`win ${s.on ? 'is-on' : ''} ${ai ? 'is-ai' : ''}`}>
              <rect width={WW} height={WH} className="win__frame" />
              <line x1="0" y1="11" x2={WW} y2="11" className="win__bar" />
              <circle cx="6" cy="5.5" r="1.6" className="win__btn" />
              <circle cx="11.5" cy="5.5" r="1.6" className="win__btn" />
              <line x1="8" y1="24" x2={8 + (WW - 22) * s.fill} y2="24" className="win__ln" />
              <line x1="8" y1="33" x2={8 + (WW - 30) * clamp(s.fill * 1.3 - 0.3)} y2="33" className="win__ln" />
              <line x1="8" y1="42" x2={8 + (WW - 40) * clamp(s.fill * 1.6 - 0.6)} y2="42" className="win__ln" />
              {ai && s.shimmer > 0 && s.shimmer < 1 && (
                <rect x={-6 + (WW + 12) * s.shimmer - 10} y="12" width="10" height={WH - 12} className="win__shimmer" />
              )}
              <text x={WW / 2} y={-12} className="lbl lbl--tiny" textAnchor="middle">
                {phase === 1 ? (ai ? 'AI · PROMPT' : 'MANUAL') : WIN_LABEL[i]}
              </text>
              {ai && (
                <path
                  className="spark"
                  transform={`translate(${WW - 2} -2) rotate(${s.spin}) scale(${0.9 + s.pop * 0.5})`}
                  d="M0,-7 C0.6,-2 2,-0.6 7,0 C2,0.6 0.6,2 0,7 C-0.6,2 -2,0.6 -7,0 C-2,-0.6 -0.6,-2 0,-7 Z"
                />
              )}
            </g>
          );
        })}
      </g>

      {/* 1.0 manual route + cursor */}
      <g className="layer" data-on={phase === 0}>
        {phase === 0 && (
          <>
            <polyline points={v.route} className="route-manual" />
            {v.attention && <line x1={H[0]} y1={H[1]} x2={v.cursor[0]} y2={v.cursor[1]} className="attention" />}
            {v.click > 0 && <circle cx={v.cursor[0]} cy={v.cursor[1]} r={4 + v.click * 16} className="ripple" style={{ opacity: 1 - v.click }} />}
            <g transform={`translate(${v.cursor[0]} ${v.cursor[1]})`} className="cursor">
              <path d="M0,0 L0,15 L4,11 L7,18 L9.6,17 L6.6,10 L12,10 Z" />
            </g>
            <text x="320" y="330" className="lbl lbl--note" textAnchor="middle">{v.note}</text>
          </>
        )}
      </g>

      {/* 2.0 prompt arcs: everything goes out from, and comes back to, the human */}
      <g className="layer" data-on={phase === 1}>
        {phase === 1 && (
          <>
            {v.arcs.map((a, i) => (
              <g key={i}>
                <polyline points={a.out} className={`arc ${a.done ? 'is-done' : ''}`} />
                <polyline points={a.back} className={`arc arc--back ${a.done ? 'is-done' : ''}`} />
              </g>
            ))}
            {v.pulse && <circle cx={v.pulse[0]} cy={v.pulse[1]} r="3.4" className="pulse" />}
            {v.pulse && <circle cx={v.pulse[0]} cy={v.pulse[1]} r="12" fill="url(#glow-w)" />}
            {v.handoff && <polyline points={v.handoff} className="route-manual route-manual--solid" />}
            <text x="320" y="330" className="lbl lbl--note" textAnchor="middle">{v.note}</text>
          </>
        )}
      </g>

      {/* ---------------- 3.0 : delegation inside the boundary ---------------- */}
      <g className="layer layer-delegation" data-on={phase === 2}>
        <path d={BR_L} className="bracket" />
        <path d={BR_R} className="bracket" />
        <text x="323" y="66" className="lbl lbl--tiny" textAnchor="middle">{`AUTHORIZED BOUNDARY${ui.stage.boundary ? ` · ${ui.stage.boundary}` : ''}`}</text>
        {Object.entries(NODES).map(([k, p]) => {
          const st = v.nodes[k] ?? 0;
          return (
            <g key={k} className={`cap ${st === 1 ? 'is-hit' : ''} ${st === -1 ? 'is-blocked' : ''}`} transform={`translate(${p[0]} ${p[1]})`}>
              <rect x="-5" y="-5" width="10" height="10" transform="rotate(45)" className="cap__shape" />
              {st === -1 && <path d="M-9,-9 L9,9 M9,-9 L-9,9" className="cap__x" />}
              {NODE_LABEL[k] && (
                <text y={k === 'b' || k === 'f' || k === 'i' ? 22 : -14} className="lbl lbl--tiny" textAnchor="middle">{NODE_LABEL[k]}</text>
              )}
            </g>
          );
        })}
        {phase === 2 && (
          <>
            <polyline points={v.intent} className="route-intent" />
            <polyline points={v.plan} className="route-plan" />
            <polyline points={v.pathA} className="route-live" />
            <polyline points={v.pathB} className="route-live" />
            <polyline points={v.exit} className="route-live" />
            {v.verify > 0 && (
              <g transform={`translate(${EXIT[0]} ${EXIT[1]})`} className="verify" style={{ opacity: v.verify }}>
                <circle r="13" className="verify__ring" />
                <path d="M-5,0 L-1.5,3.5 L5.5,-4" className="verify__check" />
              </g>
            )}
            {v.packet && <circle cx={v.packet[0]} cy={v.packet[1]} r="14" fill="url(#glow-w)" />}
            {v.packet && <circle cx={v.packet[0]} cy={v.packet[1]} r="3.6" className="packet" />}
            {v.tag && (
              <g transform={`translate(${v.tag.x} ${v.tag.y})`} className="tag" style={{ opacity: v.tag.o }}>
                <text className="lbl lbl--tag" textAnchor={v.tag.a ?? 'middle'}>{v.tag.s}</text>
                {v.tag.s2 && <text y="14" className="lbl lbl--tagzh" textAnchor={v.tag.a ?? 'middle'}>{v.tag.s2}</text>}
              </g>
            )}
          </>
        )}
      </g>

      {/* ---------------- constant ends ---------------- */}
      <g className={`human ${v.humanDim ? 'is-dim' : ''}`}>
        <circle cx={H[0]} cy={H[1]} r="7" className="human__dot" />
        <text x={H[0]} y={H[1] + 30} className="lbl" textAnchor="middle">{ROLE[phase]}</text>
        <text x={H[0]} y={H[1] + 45} className="lbl lbl--zh" textAnchor="middle">{ui.stage.human}</text>
      </g>
      <g className={`outcome ${v.outcome}`}>
        {v.outcome === 'is-delivered' && <circle cx={O[0]} cy={O[1]} r={22 + v.glow * 10} fill="url(#glow-o)" />}
        {v.outcome === 'is-delivered' && <circle cx={O[0]} cy={O[1]} r={10 + v.ring * 26} className="outcome__ring" style={{ opacity: 1 - v.ring }} />}
        <circle cx={O[0]} cy={O[1]} r={v.outcome === 'is-delivered' ? 9 : 7} className="outcome__dot" />
        <text x={O[0]} y={O[1] + 30} className="lbl" textAnchor="middle">OUTCOME</text>
        <text x={O[0]} y={O[1] + 45} className="lbl lbl--zh" textAnchor="middle">{v.outcomeZh}</text>
      </g>
    </svg>
  );
}

const ROLE = ['OPERATOR', 'PROMPTER', 'DELEGATOR'];

type WinState = { on: boolean; fill: number; shimmer: number; spin: number; pop: number };

function frame(phase: 0 | 1 | 2, t: number) {
  const S = ui.stage;
  const win: WinState[] = WIN_X.map(() => ({ on: false, fill: 0, shimmer: 0, spin: 0, pop: 0 }));
  const base = {
    win,
    route: '',
    cursor: H as P,
    attention: false,
    click: 0,
    note: '',
    arcs: [] as { out: string; back: string; done: boolean }[],
    pulse: null as P | null,
    handoff: '' as string | null,
    nodes: {} as Record<string, number>,
    intent: '',
    plan: '',
    pathA: '',
    pathB: '',
    exit: '',
    packet: null as P | null,
    verify: 0,
    tag: null as null | { x: number; y: number; s: string; o: number; s2?: string; a?: 'start' | 'middle' | 'end' },
    humanDim: false,
    outcome: 'is-idle',
    outcomeZh: S.outcome,
    glow: 0,
    ring: 0,
  };

  if (phase === 0) {
    // cursor: H -> w0 -> w1 -> w2 -> w3 -> O, clicking at each window
    const stops: P[] = [H, ...WIN_X.map((x) => [x, WIN_Y + 4] as P), O];
    const legT = 1250; // per leg
    const moveT = 720;
    const total = legT * (stops.length - 1);
    const tt = Math.min(t, total);
    const leg = Math.min(stops.length - 2, Math.floor(tt / legT));
    const lt = tt - leg * legT;
    const m = easeInOut(seg(lt, 0, moveT));
    const a = stops[leg], b = stops[leg + 1];
    // slight arc so the hand-made route feels human
    const ctrl: P = [(a[0] + b[0]) / 2, Math.min(a[1], b[1]) - 30];
    const cur = quad(a, ctrl, b, m);
    base.cursor = t < total ? cur : O;
    base.attention = t < total;
    // route drawn so far
    const pts: P[] = [H];
    for (let i = 1; i <= leg; i++) pts.push(stops[i]);
    pts.push(t < total ? cur : O);
    base.route = pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    // clicks + window states
    WIN_X.forEach((_, i) => {
      const clickAt = (i + 1) * legT - legT + moveT + legT * 0; // arrival of leg i (into window i)
      const arrive = i * legT + moveT;
      const k = seg(t, arrive, arrive + 420);
      win[i].on = t >= arrive;
      win[i].fill = easeOut(k);
      if (t >= arrive && t < arrive + 360) base.click = (t - arrive) / 360;
      void clickAt;
    });
    const done = t >= total - legT + moveT;
    base.note = done ? `RESULT · ${S.n1done}` : `CLICK ${String(Math.min(4, leg + (lt > moveT ? 1 : 0)) || 1).padStart(2, '0')} · ${S.n1}`;
    base.outcome = done ? 'is-manual' : 'is-idle';
    base.outcomeZh = done ? S.manual : S.outcome;
    return base;
  }

  if (phase === 1) {
    const legT = 1500;
    const total = legT * 4;
    WIN_X.forEach((x, i) => {
      const ai = i === 1 || i === 2;
      const t0 = i * legT;
      const goT = 520, workT = ai ? 260 : 620, backT = 520;
      const lt = t - t0;
      const top: P = [(H[0] + x) / 2, 92 - i * 6];
      const bot: P = [(H[0] + x) / 2, 330 + i * 6];
      const winTop: P = [x - 8, WIN_Y - WH / 2];
      const winBot: P = [x - 8, WIN_Y + WH / 2];
      const outK = easeInOut(seg(lt, 0, goT));
      const backK = easeInOut(seg(lt, goT + workT, goT + workT + backT));
      base.arcs.push({
        out: lt > 0 ? sampleQuad(H, top, winTop, outK) : '',
        back: lt > goT + workT ? sampleQuad(winBot, bot, H, backK) : '',
        done: lt > goT + workT + backT,
      });
      if (lt > 0 && lt < goT) base.pulse = quad(H, top, winTop, outK);
      if (lt > goT + workT && lt < goT + workT + backT) base.pulse = quad(winBot, bot, H, backK);
      const wk = seg(lt, goT, goT + workT);
      win[i].on = lt >= goT;
      win[i].fill = ai ? easeOut(wk) : easeInOut(wk);
      win[i].shimmer = ai ? seg(lt, goT - 40, goT + workT + 120) : 0;
      win[i].spin = ai ? easeOut(wk) * 90 : 0;
      win[i].pop = ai ? Math.sin(Math.PI * wk) : 0;
    });
    const after = t - total;
    if (after > 0) {
      const k = easeInOut(seg(after, 0, 900));
      base.handoff = partial([H, [H[0], 372], [O[0], 372], O], k).d;
    }
    const cur = Math.min(3, Math.floor(t / legT));
    const isAi = cur === 1 || cur === 2;
    base.note = after > 600 ? `RESULT · ${S.n2done}` : `PROMPT ${String(cur + 1).padStart(2, '0')} · ${isAi ? S.n2ai : S.n2manual}`;
    base.outcome = after > 900 ? 'is-manual' : 'is-idle';
    base.outcomeZh = after > 900 ? S.manual : S.outcome;
    return base;
  }

  // phase 2 — delegation
  const T = {
    intent: [0, 900],
    plan: [900, 1700],
    runA: [1700, 3700],
    block: [3700, 4300],
    runB: [4300, 6000],
    verify: [6000, 6700],
    deliver: [6700, 7400],
  };
  base.humanDim = t > T.intent[1];
  // intent: one straight line from the human into the boundary
  const ik = easeInOut(seg(t, T.intent[0], T.intent[1]));
  base.intent = partial([H, ENTRY], ik).d;
  if (t < T.intent[1]) base.packet = partial([H, ENTRY], ik).head;
  if (t < T.plan[1] + 300) {
    base.tag = { x: 22, y: 150, a: 'start', s: 'INTENT', s2: S.intent, o: seg(t, 100, 400) * (1 - seg(t, T.plan[1], T.plan[1] + 300)) };
  }
  // plan preview: dashed planned route
  const pk = easeOut(seg(t, T.plan[0], T.plan[1]));
  base.plan = partial(PLAN, pk).d;
  // run A
  const ak = easeInOut(seg(t, T.runA[0], T.runA[1]));
  if (t >= T.runA[0]) {
    const pa = partial(ROUTE_A, ak);
    base.pathA = pa.d;
    if (t < T.runA[1]) base.packet = pa.head;
  }
  const hit = (k: string, at: number) => { if (t >= at) base.nodes[k] = 1; };
  hit('a', T.runA[0] + 520);
  hit('c', T.runA[0] + 1200);
  hit('e', T.runA[1] - 40);
  // block: the planned next node (h · WEB) is unavailable
  if (t >= T.block[0]) {
    base.nodes.h = -1;
    base.tag = { x: NODES.h[0] - 4, y: 96, s: 'BLOCKED → ADAPT', s2: S.blocked, o: seg(t, T.block[0], T.block[0] + 200) * (1 - seg(t, T.runB[1] - 400, T.runB[1])) };
    base.packet = ROUTE_A[ROUTE_A.length - 1];
  }
  // run B: re-routed path
  const bk = easeInOut(seg(t, T.runB[0], T.runB[1]));
  if (t >= T.runB[0]) {
    const pb = partial(ROUTE_B, bk);
    base.pathB = pb.d;
    if (t < T.runB[1]) base.packet = pb.head;
    hit('f', T.runB[0] + 560);
    hit('g', T.runB[0] + 1150);
  }
  // verify at the boundary exit
  if (t >= T.verify[0]) {
    base.verify = easeOut(seg(t, T.verify[0], T.verify[0] + 400));
    base.packet = EXIT;
    base.tag = { x: EXIT[0], y: 172, s: 'VERIFY', s2: S.verify, o: seg(t, T.verify[0], T.verify[0] + 200) * (1 - seg(t, T.deliver[1], T.deliver[1] + 300)) };
  }
  // deliver
  if (t >= T.deliver[0]) {
    const dk = easeInOut(seg(t, T.deliver[0], T.deliver[1]));
    const pd = partial([EXIT, O], dk);
    base.exit = pd.d;
    base.packet = t < T.deliver[1] ? pd.head : null;
  }
  if (t >= T.deliver[1]) {
    base.outcome = 'is-delivered';
    base.outcomeZh = S.verified;
    const after = t - T.deliver[1];
    base.ring = (after % 1400) / 1400;
    base.glow = 0.5 + 0.5 * Math.sin(after / 500);
  }
  // fade the lattice paths out right before looping
  void lerp;
  return base;
}
