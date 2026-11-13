// The first screen: the voice line breathing behind the title, and "hear it" — one sentence travelling down the line
// to a result. The button also turns the page's sound on (the visitor asked to hear something).
import { useRef } from 'react';
import { seg } from '../../../lib';
import { resultTone, setSound, tick } from '../../sound';
import type { VoxCopy } from '../product';
import { Typed, Wave, useTimeline } from './shared';

const TOTAL = 4600;

// One store for the two halves of the first screen (the backdrop and the button live in different slots).
let listener: (() => void) | null = null;

export function HeroVisual({ copy }: { copy: VoxCopy }) {
  const [qo, qc] = copy.ui.quote;
  const s = copy.scenes.hero;
  const cues = [
    { at: 1500, run: () => tick(0) },
    { at: 2300, run: () => tick(4) },
    { at: 3300, run: resultTone },
  ];
  const { t, play, playing } = useTimeline(TOTAL, cues);
  listener = play;
  const tRef = useRef(t);
  tRef.current = t;
  const playingRef = useRef(playing);
  playingRef.current = playing;
  // The line swells while the sentence is spoken, then settles.
  const energy = () => (playingRef.current ? 1 - seg(tRef.current, 1100, 1700) * 0.75 : 0);
  return (
    <div className="vx-hero" data-playing={playing || undefined}>
      <Wave energy={energy} className="vx-hero__wave" />
      <div className="wrap vx-hero__call" aria-live="polite">
        <p className="vx-hero__say">{qo}<Typed text={s.say} k={seg(t, 0, 1100)} />{qc}</p>
        <ol className="vx-hero__steps">
          {s.steps.map((label, i) => <li key={label} className={t >= 1500 + i * 800 ? 'is-on' : ''}><i aria-hidden="true" />{label}</li>)}
          <li className={`vx-hero__result ${t >= 3300 ? 'is-on' : ''}`}><i className="pd-result" aria-hidden="true" />{s.result}</li>
        </ol>
      </div>
    </div>
  );
}

export function HeroActions({ copy }: { copy: VoxCopy }) {
  return (
    <button type="button" className="pd-btn" onClick={() => { setSound(true); listener?.(); }}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 6h2.6L8 3v10L4.6 10H2z" /><path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.4 3.6a6.2 6.2 0 0 1 0 8.8" /></svg>
      {copy.scenes.hero.action}
    </button>
  );
}
