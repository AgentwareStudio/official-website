import { useEffect, useRef, useState } from 'react';
import { shift, ui } from '../content';
import { fmt } from '../i18n';
import { Lines, useInView, useMedia } from '../lib';
import { ShiftStage } from '../components/ShiftStage';
import { scrollToY } from '../pager';

type Era = (typeof shift.eras)[number];

function EraCard({ era, i }: { era: Era; i: number }) {
  const [verb] = era.motto.replace('Humans ', '').split(' ');
  return (
    <div className="era-card">
      <div className="era-card__meta">
        <span className="era-card__ver">{era.ver}</span>
        <span className="era-card__era">{era.era}</span>
      </div>
      <h3 className="era-card__motto" lang="en">
        Humans <em>{verb}</em>
      </h3>
      <p className="era-card__name">
        <span lang="en">{era.en}</span>
        {era.zh && <span className="era-card__zh">{era.zh}</span>}
      </p>
      <p className="era-card__body">{era.body}</p>
      <span className="visually-hidden">{fmt(ui.eraOf, { n: i + 1 })}</span>
    </div>
  );
}

function Heading() {
  return (
    <div className="opening opening--shift">
      <div className="opening__head">
        <p className="eyebrow">{shift.eyebrow}</p>
        <h2 className="h-section h-pair" id="shift-title">
          <Lines lines={[shift.title[0]]} />
          <Lines lines={[shift.title[1]]} className="is-strong" />
        </h2>
      </div>
      <div className="opening__copy">
        {shift.intro.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}

/** Desktop: the heading stays; the stage (left) and the era card (right) switch 01 → 02 → 03 as you scroll. */
function Pinned() {
  const pin = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [progress, setProgress] = useState(0);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = pin.current!;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const span = r.height - vh;
      const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      setProgress(p);
      setPhase(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
      setInView(r.top < vh && r.bottom > 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const go = (i: number) => {
    const el = pin.current!;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    scrollToY(top + span * [0, 0.5, 1][i]);
  };

  return (
    <div className="shift-pin" ref={pin}>
      {/* snap points: one screen per era */}
      {[0, 1, 2].map((i) => (
        <span key={i} className="shift-snap" data-screen aria-hidden="true" style={{ top: `calc((360vh - 100vh) * ${i / 2})` }} />
      ))}
      <div className="shift-sticky">
        <div className="wrap shift-sticky__inner">
          <Heading />
          <div className="shift-grid">
            <div className="shift-grid__stage">
              <div className="stage-frame">
                <div className="stage-frame__corner">FIG. 02 — THE DIVISION OF LABOUR</div>
                <ShiftStage phase={phase} active={inView} />
              </div>
            </div>
            <div className="shift-grid__card" aria-live="polite">
              <div className="era-stack">
                {shift.eras.map((e, i) => (
                  <div key={e.no} className={`era-stack__item ${phase === i ? 'is-on' : ''} ${i < phase ? 'is-past' : ''}`} aria-hidden={phase !== i}>
                    <EraCard era={e} i={i} />
                  </div>
                ))}
              </div>
              <ol className="era-tabs" aria-label={ui.erasAria}>
                {shift.eras.map((e, i) => {
                  const local = Math.min(1, Math.max(0, (progress - i / 3) * 3));
                  return (
                    <li key={e.no}>
                      <button type="button" className={phase === i ? 'is-on' : ''} aria-current={phase === i ? 'step' : undefined} onClick={() => go(i)}>
                        <span className="era-tabs__bar"><i style={{ transform: `scaleX(${local})` }} /></span>
                        <span className="era-tabs__no">{e.no}</span>
                        <span className="era-tabs__en" lang="en">{e.en}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              <p className={`shift-closing shift-closing--pinned ${phase === 2 ? 'is-on' : ''}`} aria-hidden={phase !== 2}>
                <span className="ln">{shift.closing[0]}</span>
                <strong className="ln">{shift.closing[1]}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Narrow or short screens: no pinning; each era gets its own stage. */
function Stacked() {
  return (
    <div className="wrap">
      <Heading />
      <ol className="shift-list">
        {shift.eras.map((e, i) => (
          <StackedEra key={e.no} era={e} i={i} />
        ))}
      </ol>
    </div>
  );
}
function StackedEra({ era, i }: { era: Era; i: number }) {
  const [ref, inView] = useInView<HTMLLIElement>({ threshold: 0.3 });
  return (
    <li className="shift-list__item" ref={ref}>
      <div className="stage-frame stage-frame--compact">
        <ShiftStage phase={i as 0 | 1 | 2} active={inView} compact />
      </div>
      <EraCard era={era} i={i} />
    </li>
  );
}

export function Shift() {
  const pinned = useMedia('(min-width: 1024px) and (min-height: 700px)');
  return (
    <section className="section section--shift" id="shift" aria-labelledby="shift-title">
      {pinned ? <Pinned /> : <Stacked />}
      {!pinned && (
        <div className="wrap">
          <p className="shift-closing reveal">
            <span className="ln">{shift.closing[0]}</span>
            <strong className="ln">{shift.closing[1]}</strong>
          </p>
        </div>
      )}
    </section>
  );
}
