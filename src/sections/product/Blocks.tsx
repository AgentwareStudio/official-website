// The product pages' shared blocks. Each reads only its props (a product's copy), so the next product reuses them
// as they are; what is particular to one product lives in its own scenes (src/products/<slug>/scenes/).
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { href } from '../../i18n';
import { T } from '../../lib';
import { productsPath } from '../../products';
import { setSound, useSound } from '../../products/sound';
import type { Film, ProductCopy } from '../../products/types';
import type { Locale } from '../../i18n';

/** Jumps to the film block and starts it. */
function playFilm() {
  const video = document.querySelector<HTMLVideoElement>('#film video');
  if (!video) return;
  video.scrollIntoView({ block: 'center' });
  void video.play();
}

/** `visual` sits behind the copy (a product's own backdrop); `actions` follow the film button. */
export function ProductHero({ copy, film, visual, actions }: { copy: ProductCopy; film: boolean; visual?: ReactNode; actions?: ReactNode }) {
  const h = copy.hero;
  return (
    <section className="pd-hero" aria-labelledby="pd-title">
      {visual}
      <div className="wrap pd-hero__in">
        <p className="eyebrow"><a href={href('/')}>AGENTWARE STUDIO</a> <span aria-hidden="true">//</span> {h.eyebrow.replace(/^.*\/\/\s*/, '')}</p>
        <h1 className="pd-hero__title" id="pd-title"><T>{h.title}</T></h1>
        <p className="pd-hero__lead">{h.lead}</p>
        <div className="pd-hero__actions">
          {film && <button type="button" className="pd-btn is-primary" onClick={playFilm}><span aria-hidden="true">▶ </span>{h.film}</button>}
          {actions}
        </div>
      </div>
    </section>
  );
}

/** Two aligned lines: the old way in grey, the new way in white. */
export function ShiftStatement({ copy }: { copy: ProductCopy }) {
  return (
    <section className="pd-block pd-shift">
      <div className="wrap">
        <p className="pd-shift__old reveal">{copy.shift.old}</p>
        <p className="pd-shift__now reveal">{copy.shift.now}</p>
      </div>
    </section>
  );
}

/** Tabs of use cases. Every panel is rendered and they share one grid cell, so switching never moves the page. */
export function UseCases({ copy }: { copy: ProductCopy }) {
  const u = copy.useCases;
  const [tab, setTab] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    const next = (tab + d + u.tabs.length) % u.tabs.length;
    setTab(next);
    tabs.current[next]?.focus();
  };
  return (
    <section className="pd-block pd-cases" aria-labelledby="pd-cases-t">
      <div className="wrap">
        <div className="pd-head">
          <h2 className="pd-h2" id="pd-cases-t">{u.title}</h2>
          <div className="pd-tabs" role="tablist" aria-labelledby="pd-cases-t" onKeyDown={onKey}>
            {u.tabs.map((t, i) => (
              <button key={t.label} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`pd-tab-${i}`} aria-controls={`pd-panel-${i}`}
                aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} className={tab === i ? 'is-on' : ''} onClick={() => setTab(i)}>{t.label}</button>
            ))}
          </div>
        </div>
        <div className="pd-cases__panels">
          {u.tabs.map((t, i) => (
            <div key={t.label} role="tabpanel" id={`pd-panel-${i}`} aria-labelledby={`pd-tab-${i}`} className={`pd-cases__panel ${tab === i ? 'is-on' : ''}`} aria-hidden={tab !== i}>
              <ul>
                {t.items.map((it, j) => (
                  <li key={it.title} className="pd-case">
                    <span className="pd-case__no" aria-hidden="true">{String(j + 1).padStart(2, '0')}</span>
                    <h3>{it.title}</h3>
                    <p>{it.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustList({ copy }: { copy: ProductCopy }) {
  return (
    <section className="pd-block pd-trust" aria-labelledby="pd-trust-t">
      <div className="wrap">
        <h2 className="pd-h2" id="pd-trust-t"><T>{copy.trust.title}</T></h2>
        <ul className="pd-trust__list">{copy.trust.items.map((t) => <li key={t} className="reveal">{t}</li>)}</ul>
      </div>
    </section>
  );
}

/** The film downloads only when played. */
export function ProductFilm({ copy, film, code }: { copy: ProductCopy; film: Film; code: Locale }) {
  return (
    <section className="pd-block pd-film" id="film" aria-labelledby="pd-film-t">
      <div className="wrap">
        <h2 className="pd-h2" id="pd-film-t">{copy.film.title}</h2>
        <video className="pd-film__video" controls preload="none" playsInline poster={film.poster} width={1920} height={1080}>
          {film.mp4Mobile && <source src={film.mp4Mobile} type="video/mp4" media="(max-width: 720px)" />}
          <source src={film.mp4} type="video/mp4" />
          {Object.entries(film.captions).map(([lang, src]) => <track key={lang} kind="captions" srcLang={lang} src={src} default={lang === code} />)}
        </video>
      </div>
    </section>
  );
}

export function Faq({ copy }: { copy: ProductCopy }) {
  return (
    <section className="pd-block pd-faq" aria-labelledby="pd-faq-t">
      <div className="wrap pd-faq__grid">
        <h2 className="pd-h2" id="pd-faq-t">{copy.faq.title}</h2>
        <div>
          {copy.faq.items.map((it) => (
            <details key={it.q} className="pd-faq__item">
              <summary>{it.q}<span aria-hidden="true" /></summary>
              <p>{it.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

/** The page's last screen. `visual` is the product's own backdrop; the result point is the screen's one signal mark. */
export function ProductEnding({ copy, code, visual }: { copy: ProductCopy; code: Locale; visual?: ReactNode }) {
  return (
    <section className="pd-ending">
      {visual}
      <div className="wrap pd-ending__in">
        <h2 className="pd-ending__title reveal"><i className="pd-result" aria-hidden="true" />{copy.ending.title}</h2>
        <p className="pd-ending__links">
          <a href="#main">{copy.ending.again}<span aria-hidden="true"> ↑</span></a>
          <a href={productsPath(code)}>{copy.ending.all}<span aria-hidden="true"> →</span></a>
        </p>
        <p className="pd-note">{copy.ui.demoData}</p>
      </div>
    </section>
  );
}

/** Sound is off until the visitor turns it on; shown once the page has scrolled past the first screen. */
export function SoundToggle({ copy }: { copy: ProductCopy }) {
  const on = useSound();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  return (
    <button type="button" className={`pd-sound ${on ? 'is-on' : ''}`} aria-pressed={on} aria-label={copy.ui.sound} title={copy.ui.sound} onClick={() => setSound(!on)}>
      <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 6h2.6L8 3v10L4.6 10H2z" />{on ? <path d="M10.5 5.5a3.5 3.5 0 0 1 0 5M12.4 3.6a6.2 6.2 0 0 1 0 8.8" /> : <path d="M10.5 6l4 4M14.5 6l-4 4" />}</svg>
      <span>{on ? copy.ui.soundOn : copy.ui.soundOff}</span>
    </button>
  );
}
