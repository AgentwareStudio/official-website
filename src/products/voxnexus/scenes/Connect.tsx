// "What you connect is what it can do." Switch business systems on and off; each one adds its lines to the list of
// things the agent can do. The systems are named by the job they do, nothing more.
import { useState } from 'react';
import { T } from '../../../lib';
import { tick } from '../../sound';
import type { VoxCopy } from '../product';
import { useFirstView } from './shared';

export function Connect({ copy }: { copy: VoxCopy }) {
  const s = copy.scenes.connect;
  const [on, setOn] = useState<boolean[]>(() => s.systems.map(() => false));
  // A hint that the switches work: the first one turns itself on when the scene comes into view.
  const ref = useFirstView<HTMLDivElement>(() => window.setTimeout(() => setOn((v) => (v.some(Boolean) ? v : v.map((_, i) => i === 0))), 500));
  const toggle = (i: number) => setOn((v) => { const next = v.map((x, j) => (j === i ? !x : x)); if (next[i]) tick(i * 2); return next; });
  const count = on.filter(Boolean).length;
  return (
    <section className="pd-block vx-connect" aria-labelledby="vx-connect-t">
      <div className="wrap">
        <div className="pd-head">
          <h2 className="pd-h2" id="vx-connect-t"><T>{s.title}</T></h2>
          <p className="pd-lead">{s.lead}</p>
        </div>
        <p className="vx-pick" id="vx-connect-pick">{s.pick}</p>
        <div className="vx-connect__board" ref={ref} data-count={count}>
          <ul className="vx-connect__systems" aria-labelledby="vx-connect-pick">
            {s.systems.map((sys, i) => (
              <li key={sys.name}>
                <button type="button" role="switch" aria-checked={on[i]} className={`vx-switch ${on[i] ? 'is-on' : ''}`} onClick={() => toggle(i)}>
                  <span className="vx-switch__knob" aria-hidden="true" />
                  <span>{sys.name}</span>
                </button>
              </li>
            ))}
          </ul>
          <div className="vx-connect__hub" aria-hidden="true"><i /><span>{s.hub}</span></div>
          <div className="vx-connect__can" aria-live="polite">
            <p className="vx-label">{s.listTitle}{count > 0 && <span> · {on.reduce((n, v, i) => n + (v ? s.systems[i].can.length : 0), 0)}</span>}</p>
            {count === 0 && <p className="vx-connect__empty">{s.empty}</p>}
            {/* Every line is in the page (and its Markdown); the ones whose system is off are hidden. */}
            <ul>
              {s.systems.map((sys, i) => sys.can.map((c) => <li key={sys.name + c} className={on[i] ? 'is-on' : ''} hidden={!on[i]}>{c}</li>))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
