// The line that knows where to stop: a request it may not carry out runs into the boundary, stops cleanly and turns
// to a person. The reasons you can hand work over follow. Plays once when it comes into view.
import { useState } from 'react';
import { T } from '../../../lib';
import { thud } from '../../sound';
import type { VoxCopy } from '../product';
import { useFirstView } from './shared';

export function Boundary({ copy }: { copy: VoxCopy }) {
  const [qo, qc] = copy.ui.quote;
  const s = copy.scenes.boundary;
  const [seen, setSeen] = useState(false);
  const ref = useFirstView<HTMLDivElement>(() => { setSeen(true); window.setTimeout(thud, 1100); });
  return (
    <section className="pd-block vx-boundary" aria-labelledby="vx-boundary-t">
      <div className="wrap">
        <h2 className="pd-h2" id="vx-boundary-t"><T>{copy.trust.title}</T></h2>
        <div className={`vx-boundary__stage ${seen ? 'is-in' : ''}`} ref={ref}>
          <p className="vx-boundary__say">{qo}{s.say}{qc}</p>
          <div className="vx-boundary__run" aria-hidden="true">
            <i className="vx-boundary__line" />
            <i className="vx-boundary__wall" />
            <i className="vx-boundary__turn" />
          </div>
          <p className="vx-boundary__denied">{s.denied}</p>
          <p className="vx-boundary__human"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="8" cy="5" r="2.6" /><path d="M2.8 14c.4-3 2.4-4.6 5.2-4.6s4.8 1.600 5.2 4.6" /></svg>{s.human}</p>
        </div>
        <ul className={`vx-boundary__reasons ${seen ? 'is-in' : ''}`}>
          {copy.trust.items.map((it, i) => <li key={it} style={{ '--i': i } as React.CSSProperties}><span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{it}</li>)}
        </ul>
      </div>
    </section>
  );
}
