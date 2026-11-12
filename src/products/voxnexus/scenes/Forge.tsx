// "AI that builds AI." One sentence to the Admin Agent: the line winds itself into a new agent — name, languages,
// what it may and may not do — which is confirmed, published, and says its first words. Below, a question about a
// failure: the line runs back along last night's calls and stops at the cause.
import { useEffect, useRef, useState } from 'react';
import { seg } from '../../../lib';
import { resultTone, tick } from '../../sound';
import type { VoxCopy } from '../product';
import { Typed, useFirstView, useTimeline } from './shared';

const SAY = 1300;
const WIND = 900;
const FIELD = 420;
const BUILD = SAY + WIND + FIELD * 4;   // the four fields are in
const DONE = BUILD + 700;               // confirmed and published
const TOTAL = DONE + 1400;

const CALLS = 14;
const FAILED = [3, 4, 5];
const PROBE = 2600;

function Probe({ copy }: { copy: VoxCopy }) {
  const p = copy.scenes.forge.probe;
  const { t, play, playing } = useTimeline(PROBE, [{ at: 1500, run: () => tick(-5) }]);
  // The line runs from the newest call back to the first failed one.
  const k = seg(t, 200, 1500);
  const found = t >= 1500;
  return (
    <div className="vx-probe" style={{ '--k': k.toFixed(3) } as React.CSSProperties}>
      <h3 className="vx-probe__title">{p.title}</h3>
      <p className="vx-probe__say">「{p.say}」</p>
      <button type="button" className="pd-btn" onClick={play} disabled={playing}><span aria-hidden="true">▶ </span>{p.action}</button>
      <div className="vx-probe__calls" aria-hidden="true">
        <i className="vx-probe__line" />
        {Array.from({ length: CALLS }, (_, i) => <i key={i} className={`vx-probe__call ${FAILED.includes(i) ? 'is-failed' : ''} ${found && FAILED.includes(i) ? 'is-found' : ''}`} />)}
      </div>
      <div className={`vx-probe__answer ${found ? 'is-on' : ''}`} aria-live="polite">
        <p>{p.cause}</p>
        <p className="vx-label">{p.count}</p>
      </div>
      <p className="vx-probe__help">{p.help}</p>
    </div>
  );
}

export function Forge({ copy }: { copy: VoxCopy }) {
  const s = copy.scenes.forge;
  const [pick, setPick] = useState(0);
  const ex = s.examples[pick];
  const cues = [
    ...[0, 1, 2, 3].map((i) => ({ at: SAY + WIND + FIELD * (i + 1), run: () => tick(i * 2) })),
    { at: DONE, run: resultTone },
  ];
  const { t, play } = useTimeline(TOTAL, cues);
  const ref = useFirstView<HTMLDivElement>(play);
  // Another sentence plays once it has rendered (the effect); the same one again replays at once.
  const shown = useRef(pick);
  useEffect(() => {
    if (shown.current === pick) return;
    shown.current = pick;
    play();
  }, [pick, play]);
  const choose = (i: number) => (i === pick ? play() : setPick(i));
  const field = (i: number) => (t >= SAY + WIND + FIELD * (i + 1) ? 'is-on' : '');
  return (
    <section className="pd-block vx-forge" aria-labelledby="vx-forge-t">
      <div className="wrap">
        <div className="pd-head">
          <h2 className="pd-h2" id="vx-forge-t">{s.title}</h2>
          <p className="pd-lead">{s.lead}</p>
        </div>
        <p className="vx-pick" id="vx-forge-pick">{s.pick}</p>
        <div className="vx-chips" role="group" aria-labelledby="vx-forge-pick">
          {s.examples.map((e, i) => (
            <button key={e.say} type="button" className={`vx-chip ${pick === i ? 'is-on' : ''}`} aria-pressed={pick === i} onClick={() => choose(i)}>「{e.say}」</button>
          ))}
        </div>
        <div className="vx-forge__stage" ref={ref} aria-live="polite">
          <p className="vx-forge__say"><span className="vx-label">Admin Agent ←</span>「<Typed text={ex.say} k={seg(t, 0, SAY)} />」</p>
          {/* The line winding into the new agent. */}
          <svg className="vx-forge__coil" viewBox="0 0 120 120" aria-hidden="true" style={{ '--k': seg(t, SAY, SAY + WIND + FIELD * 4).toFixed(3) } as React.CSSProperties}>
            <path pathLength={1} d="M4 60 C 30 60 34 22 60 22 C 86 22 98 40 98 60 C 98 82 82 96 60 96 C 42 96 30 84 30 66 C 30 52 42 42 56 42 C 68 42 76 50 76 60 C 76 70 68 76 60 76 C 54 76 50 72 50 66" />
            <circle cx="56" cy="62" r="5" className={t >= DONE ? 'is-on' : ''} />
          </svg>
          <dl className={`vx-agent ${t >= DONE ? 'is-live' : ''}`}>
            <div className={field(0)}><dt>{s.labels.name}</dt><dd className="vx-agent__name">{ex.name}</dd></div>
            <div className={field(1)}><dt>{s.labels.langs}</dt><dd>{ex.langs}</dd></div>
            <div className={field(2)}><dt>{s.labels.can}</dt><dd><ul>{ex.can.map((c) => <li key={c}>{c}</li>)}</ul></dd></div>
            <div className={field(3)}><dt>{s.labels.cannot}</dt><dd><ul className="vx-agent__no">{ex.cannot.map((c) => <li key={c}>{c}</li>)}</ul></dd></div>
            <div className={`vx-agent__foot ${t >= BUILD + 250 ? 'is-on' : ''}`}>
              <dt className="visually-hidden">{s.labels.confirm}</dt>
              <dd><span className="vx-agent__stamp">{s.labels.confirm}</span><span className={`vx-agent__live ${t >= DONE ? 'is-on' : ''}`}><i className="pd-result" aria-hidden="true" />{s.labels.published}</span></dd>
            </div>
          </dl>
          <p className={`vx-forge__first ${t >= DONE ? 'is-on' : ''}`}><span className="vx-label">{s.labels.first}</span>「<Typed text={ex.first} k={seg(t, DONE + 100, TOTAL - 100)} />」</p>
        </div>
        <Probe copy={copy} />
      </div>
    </section>
  );
}
