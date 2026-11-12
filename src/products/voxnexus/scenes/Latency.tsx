// "1.2 s" — the target response time, made something you can feel: the question ends, a point runs for exactly that
// long, the answer begins.
import { seg } from '../../../lib';
import { resultTone, tick } from '../../sound';
import type { VoxCopy } from '../product';
import { useTimeline } from './shared';

const LEAD = 500;
const WAIT = 1200;
const TOTAL = LEAD + WAIT + 1200;

export function Latency({ copy }: { copy: VoxCopy }) {
  const s = copy.scenes.latency;
  const { t, play, playing } = useTimeline(TOTAL, [{ at: LEAD, run: () => tick(0) }, { at: LEAD + WAIT, run: resultTone }]);
  const k = seg(t, LEAD, LEAD + WAIT);
  return (
    <section className="pd-block vx-latency" aria-labelledby="vx-latency-t">
      <div className="wrap vx-latency__grid">
        <div>
          <h2 className="vx-latency__value" id="vx-latency-t">{s.value}<span>{s.unit}</span></h2>
          <p className="pd-lead">{s.note}</p>
          <button type="button" className="pd-btn" onClick={play} disabled={playing}><span aria-hidden="true">▶ </span>{s.action}</button>
        </div>
        <div className="vx-latency__run" style={{ '--k': k.toFixed(3) } as React.CSSProperties} aria-hidden="true">
          <p className={`vx-latency__ask ${t >= LEAD ? 'is-done' : ''}`}><span className="vx-label">{s.askLabel}</span>{s.ask}</p>
          <div className="vx-latency__bar"><i /></div>
          <p className={`vx-latency__answer ${t >= LEAD + WAIT ? 'is-on' : ''}`}><span className="vx-label">{s.answerLabel}</span><i className="pd-result" />{s.answer}</p>
        </div>
      </div>
    </section>
  );
}
