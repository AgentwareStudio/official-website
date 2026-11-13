// "AI that builds AI." One sentence to the Admin Agent: the line winds itself into a new agent — name, languages,
// what it may and may not do — which is confirmed, published, and says its first words. Below, a question about a
// failure: the line runs back along last night's calls and stops at the cause.
import { useEffect, useRef, useState } from 'react';
import { seg } from '../../../lib';
import { hush, preload, resultTone, speak, tick, useSound } from '../../sound';
import type { VoxCopy } from '../product';
import { voiceOf } from '../voice';
import { Typed, useFirstView, useTimeline } from './shared';

const WIND = 900;
const FIELD = 420;
/** The script of one example; the sentence takes as long as its recorded voice, where the page has one. */
function script(say: number) {
  const build = say + WIND + FIELD * 4;   // the four fields are in
  const done = build + 700;               // confirmed and published
  return { build, done, total: done + 1400 };
}

const CALLS = 14;
const FAILED = [3, 4, 5];
const PROBE = 2600;

function Probe({ copy }: { copy: VoxCopy }) {
  const [qo, qc] = copy.ui.quote;
  const p = copy.scenes.forge.probe;
  // With a recorded question, the line starts once it has been asked.
  const voice = voiceOf(p.say);
  const lead = voice?.ms ?? 0;
  const cues = [...(voice ? [{ at: 0, run: () => speak(voice.src) }] : []), { at: lead + 1500, run: () => tick(-5) }];
  const { t, play, playing } = useTimeline(lead + PROBE, cues, voice ? [voice.src] : []);
  // The line runs from the newest call back to the first failed one.
  const k = seg(t, lead + 200, lead + 1500);
  const found = t >= lead + 1500;
  return (
    <div className="vx-probe" style={{ '--k': k.toFixed(3) } as React.CSSProperties}>
      <h3 className="vx-probe__title">{p.title}</h3>
      <p className="vx-probe__say">{qo}{p.say}{qc}</p>
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
  const [qo, qc] = copy.ui.quote;
  const s = copy.scenes.forge;
  const [pick, setPick] = useState(0);
  const ex = s.examples[pick];
  const voice = voiceOf(ex.say);
  const said = voice?.ms ?? 1300;
  const { build: built, done, total } = script(said);
  const cues = [
    { at: 0, run: () => (voice ? speak(voice.src) : hush()) }, // a sentence without a voice silences the last one
    ...[0, 1, 2, 3].map((i) => ({ at: said + WIND + FIELD * (i + 1), run: () => tick(i * 2) })),
    { at: done, run: resultTone },
  ];
  const sound = useSound();
  useEffect(() => {
    if (sound) preload([...s.examples.map((e) => e.say), s.probe.say].map((x) => voiceOf(x)?.src).filter((x): x is string => !!x));
  }, [sound, s]);
  const { t, play } = useTimeline(total, cues, voice ? [voice.src] : []);
  const ref = useFirstView<HTMLDivElement>(play);
  // Another sentence plays once it has rendered (the effect); the same one again replays at once.
  const shown = useRef(pick);
  useEffect(() => {
    if (shown.current === pick) return;
    shown.current = pick;
    play();
  }, [pick, play]);
  const choose = (i: number) => (i === pick ? play() : setPick(i));
  const field = (i: number) => (t >= said + WIND + FIELD * (i + 1) ? 'is-on' : '');
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
            <button key={e.say} type="button" className={`vx-chip ${pick === i ? 'is-on' : ''}`} aria-pressed={pick === i} onClick={() => choose(i)}>{qo}{e.say}{qc}</button>
          ))}
        </div>
        <div className="vx-forge__stage" ref={ref} aria-live="polite">
          <p className="vx-forge__say"><span className="vx-label">Admin Agent ←</span>{qo}<Typed text={ex.say} k={seg(t, 0, said)} />{qc}</p>
          {/* The voice line flows in, settles and closes into the new agent's ring; a node lights for each of the
              four fields as it fills in, and the core lights (and speaks: one pulse) when the agent is published. */}
          <svg className="vx-forge__coil" viewBox="0 0 140 120" aria-hidden="true" style={{ '--k': seg(t, said, said + WIND + FIELD * 4).toFixed(3) } as React.CSSProperties}>
            <circle className="vx-forge__inner" cx="72" cy="60" r="18" />
            <path pathLength={1} d="M2 60 Q5 42 8 60 Q11 78 14 60 Q17 47 20 60 Q23 73 26 60 Q29 53 32 60 Q35 65 38 60 A34 34 0 1 1 106 60 A34 34 0 1 1 38 60" />
            {[[48, 36], [96, 36], [96, 84], [48, 84]].map(([x, y], i) => <circle key={i} className={`vx-forge__node ${field(i)}`} cx={x} cy={y} r="3.4" />)}
            <circle className={`vx-forge__pulse ${t >= done ? 'is-on' : ''}`} cx="72" cy="60" r="7" />
            <circle className={`vx-forge__core ${t >= done ? 'is-on' : ''}`} cx="72" cy="60" r="7" />
          </svg>
          <dl className={`vx-agent ${t >= done ? 'is-live' : ''}`}>
            <div className={field(0)}><dt>{s.labels.name}</dt><dd className="vx-agent__name">{ex.name}</dd></div>
            <div className={field(1)}><dt>{s.labels.langs}</dt><dd>{ex.langs}</dd></div>
            <div className={field(2)}><dt>{s.labels.can}</dt><dd><ul>{ex.can.map((c) => <li key={c}>{c}</li>)}</ul></dd></div>
            <div className={field(3)}><dt>{s.labels.cannot}</dt><dd><ul className="vx-agent__no">{ex.cannot.map((c) => <li key={c}>{c}</li>)}</ul></dd></div>
            <div className={`vx-agent__foot ${t >= built + 250 ? 'is-on' : ''}`}>
              <dt className="visually-hidden">{s.labels.confirm}</dt>
              <dd><span className="vx-agent__stamp">{s.labels.confirm}</span><span className={`vx-agent__live ${t >= done ? 'is-on' : ''}`}><i className="pd-result" aria-hidden="true" />{s.labels.published}</span></dd>
            </div>
          </dl>
          <p className={`vx-forge__first ${t >= done ? 'is-on' : ''}`}><span className="vx-label">{s.labels.first}</span>{qo}<Typed text={ex.first} k={seg(t, done + 100, total - 100)} />{qc}</p>
        </div>
        <Probe copy={copy} />
      </div>
    </section>
  );
}
