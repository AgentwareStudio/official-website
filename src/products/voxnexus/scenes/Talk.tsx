// "Say it. It gets done." Pick a sentence and watch it travel: the line leaves the caller, lights each step on the
// way and ends in a result — or stops at something the agent may not do. The calls are scripted from the copy; nothing
// here talks to a server.
import { useEffect, useRef, useState } from 'react';
import { clamp, seg } from '../../../lib';
import { hush, preload, resultTone, speak, thud, tick, useSound } from '../../sound';
import type { Call, VoxCopy } from '../product';
import { voiceOf } from '../voice';
import { Typed, useFirstView, useTimeline } from './shared';

const STEP = 750;     // each step on the way
// The caller's sentence and the agent's answer take as long as their recorded voices, where the page has them.
const sayMs = (c: Call) => voiceOf(c.say)?.ms ?? 900;
const replyMs = (c: Call) => voiceOf(c.reply)?.ms ?? 1500;
const total = (c: Call) => sayMs(c) + c.steps.length * STEP + STEP + replyMs(c);

export function Talk({ copy }: { copy: VoxCopy }) {
  const [qo, qc] = copy.ui.quote;
  const s = copy.scenes.talk;
  const [pick, setPick] = useState(0);
  const call = s.calls[pick];
  const said = sayMs(call);
  const end = said + call.steps.length * STEP + STEP;
  const asked = voiceOf(call.say);
  const answer = voiceOf(call.reply);
  const cues = [
    { at: 0, run: () => (asked ? speak(asked.src) : hush()) }, // a sentence without a voice silences the last one
    ...call.steps.map((_, i) => ({ at: said + (i + 1) * STEP, run: () => tick(i * 3) })),
    { at: end, run: call.stop ? thud : resultTone },
    ...(answer ? [{ at: end + 150, run: () => speak(answer.src) }] : []),
  ];
  const sound = useSound();
  useEffect(() => {
    if (sound) preload(s.calls.flatMap((c) => [voiceOf(c.say)?.src, voiceOf(c.reply)?.src]).filter((x): x is string => !!x));
  }, [sound, s.calls]);
  const { t, play } = useTimeline(total(call), cues, [asked?.src, answer?.src].filter((x): x is string => !!x));
  const ref = useFirstView<HTMLDivElement>(play);
  // How far the line has travelled (0–1). A refused request stops short of the end.
  const reach = call.stop ? 0.72 : 1;
  const k = clamp(seg(t, said, end)) * reach;
  // Another sentence plays once it has rendered (the effect); the same one again replays at once.
  const shown = useRef(pick);
  useEffect(() => {
    if (shown.current === pick) return;
    shown.current = pick;
    play();
  }, [pick, play]);
  const choose = (i: number) => (i === pick ? play() : setPick(i));
  return (
    <section className="pd-block vx-talk" aria-labelledby="vx-talk-t">
      <div className="wrap">
        <div className="pd-head">
          <h2 className="pd-h2" id="vx-talk-t">{s.title}</h2>
          <p className="pd-lead">{s.note}</p>
        </div>
        <p className="vx-pick" id="vx-talk-pick">{s.pick}</p>
        <div className="vx-chips" role="group" aria-labelledby="vx-talk-pick">
          {s.calls.map((c, i) => (
            <button key={c.say} type="button" className={`vx-chip ${pick === i ? 'is-on' : ''}`} aria-pressed={pick === i} onClick={() => choose(i)}>{qo}{c.say}{qc}</button>
          ))}
        </div>
        <div className={`vx-stage ${call.stop ? 'is-stop' : ''}`} ref={ref} style={{ '--k': k.toFixed(3) } as React.CSSProperties} aria-live="polite">
          <div className="vx-stage__who">
            <span className="vx-label">{s.you}</span>
            <p className="vx-stage__say">{qo}<Typed text={call.say} k={seg(t, 0, said)} />{qc}</p>
          </div>
          <div className="vx-track">
            <i className="vx-track__rail" aria-hidden="true" />
            <i className="vx-track__line" aria-hidden="true" />
            <ol className="vx-track__steps">
              {call.steps.map((label, i) => (
                <li key={label} className={t >= said + (i + 1) * STEP ? 'is-on' : ''} style={{ '--pos': `${(((i + 1) / (call.steps.length + 1)) * reach * 100).toFixed(1)}%` } as React.CSSProperties}><i aria-hidden="true" /><span>{label}</span></li>
              ))}
              {call.stop && <li className={`vx-track__wall ${t >= end ? 'is-on' : ''}`} style={{ '--pos': `${reach * 100}%` } as React.CSSProperties}><i aria-hidden="true" /><span>{call.stop}</span></li>}
            </ol>
          </div>
          <div className="vx-stage__out">
            <span className="vx-label">{s.agent}</span>
            {call.result && <p className={`vx-stage__result ${t >= end ? 'is-on' : ''}`}><i className="pd-result" aria-hidden="true" />{call.result}</p>}
            <p className="vx-stage__reply"><Typed text={call.reply} k={seg(t, end, end + replyMs(call))} /></p>
          </div>
        </div>
        <p className="pd-note">{copy.ui.demoData}</p>
      </div>
    </section>
  );
}
