import { useEffect, useState } from 'react';
import { architecture, hero, loop, manifesto, notAgentware, pillars, studio, ui } from '../content';
import { href } from '../i18n';
import { LiveMark } from '../components/Mark';
import { ExecutionLoop } from '../components/ExecutionLoop';
import { Footer } from '../components/Chrome';
import { T } from '../lib';
import { initPager } from '../pager';
import { Shift } from './Shift';

/*
  Every block below is one screen ([data-screen]). On desktop the page moves screen by screen
  along an eased curve (see pager.ts). The Manifesto is one tall screen that scrolls inside itself.
  Below the Shift, every screen uses the same head: eyebrow, main title, subtitle.
*/

function Head({ eyebrow, id, title, children, en = false }: { eyebrow: string; id: string; title: React.ReactNode; children?: React.ReactNode; en?: boolean }) {
  return (
    <header className="head reveal">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={`h-section ${en ? 'h-section--en' : ''}`} id={id} lang={en ? 'en' : undefined}>{title}</h2>
      {children && <div className="head__sub">{children}</div>}
    </header>
  );
}

/** Screen 0 — gemini's hero: mark, tag line, title. No number, no body copy. */
function Hero() {
  return (
    <section className="hero screen" id="top" data-screen aria-labelledby="hero-title">
      <div className="wrap">
        <div className="hero__mark">
          <LiveMark size={112} reveal />
          <p className="hero__tag mono" lang="en">[ A↗• ] AGENTWARE — SOFTWARE THAT ACTS ON INTENT</p>
        </div>
        <h1 className="hero__title" id="hero-title">
          <span className="hero__en" lang="en">From Interface to Intent</span>
          {hero.zh && <span className="hero__zh"><T>{hero.zh}</T></span>}
        </h1>
        <p className="hero__intro">{hero.intro}</p>
      </div>
    </section>
  );
}

/** Screen 01 — the two questions and the definition. No title. */
function Intent() {
  return (
    <section className="screen screen--intent" id="intent" data-screen aria-label={ui.questionsAria}>
      <div className="wrap">
        <p className="eyebrow reveal">{hero.eyebrow}</p>
        <dl className="questions questions--xl reveal">
          {hero.questions.map((q, i) => {
            const k = q.q.indexOf(hero.btnWord);
            const pre = k < 0 ? q.q : q.q.slice(0, k);
            const post = k < 0 ? undefined : q.q.slice(k + hero.btnWord.length);
            return (
              <div className={`questions__row ${i === 1 ? 'is-now' : ''}`} key={i}>
                <dt>{q.when}{q.who}</dt>
                <dd className="questions__q">
                  {post === undefined ? q.q : (
                    <>
                      {pre}
                      <span className="q-btn">
                        <i className="q-btn__l q-btn__l0" aria-hidden="true" />
                        <i className="q-btn__l q-btn__l1" aria-hidden="true" />
                        <i className="q-btn__l q-btn__l2" aria-hidden="true" />
                        <i className="q-btn__l q-btn__l3" aria-hidden="true" />
                        <i className="q-btn__l q-btn__l4" aria-hidden="true" />
                        <i className="q-btn__l q-btn__l5" aria-hidden="true" />
                        <span className="q-btn__label">{hero.btnWord}</span>
                      </span>
                      {post}
                    </>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
        <div className="intent__foot reveal">
          <div className="hero__actions">
            <a className="btn btn--solid" href="#shift">{ui.heroCta}<span className="btn__arrow" aria-hidden="true">↓</span></a>
            <a className="link-arrow" href="#manifesto">{ui.heroCta2}<span aria-hidden="true">→</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotAgentware() {
  return (
    <section className="screen" id="not" data-screen aria-labelledby="not-title">
      <div className="wrap">
        <Head eyebrow={notAgentware.eyebrow} id="not-title" title={<T>{notAgentware.title}</T>}>
          <p>{notAgentware.lead}</p>
        </Head>
        <ul className="neq">
          {notAgentware.items.map((it) => (
            <li className="neq__row reveal" key={it.name}>
              <p className="neq__name mono" lang="en">
                {it.name} <span className="neq__op">≠</span> <span className="neq__aw">Agentware</span>
              </p>
              <p className="neq__body">{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Architecture() {
  const t = architecture.table;
  return (
    <section className="screen" id="architecture" data-screen aria-labelledby="arch-title">
      <div className="wrap">
        <Head
          eyebrow={architecture.eyebrow}
          id="arch-title"
          en
          title={<>{architecture.titleEn[0]} <span className="h-dim">{architecture.titleEn[1]}</span></>}
        >
          <p>{architecture.titleZh && <strong className="lead-line"><T>{architecture.titleZh}</T></strong>}{architecture.body}</p>
        </Head>

        <div className="compare reveal" role="region" aria-label={ui.compareAria} tabIndex={0}>
          <table>
            <thead>
              <tr>
                <th scope="col"><span className="visually-hidden">{ui.dimension}</span></th>
                <th scope="col">{t.head[1]}{t.headEn[1] && <span lang="en">{t.headEn[1]}</span>}</th>
                <th scope="col" className="is-aw">{t.head[2]}{t.headEn[2] && <span lang="en">{t.headEn[2]}</span>}</th>
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r) => (
                <tr key={r[0]}>
                  <th scope="row">{r[0]}</th>
                  {[r[1], r[2]].map((c, j) => {
                    const [a, b] = c.split('|');
                    return (
                      <td key={j} className={j === 1 ? 'is-aw' : ''}>
                        {a}
                        {b && <code>{b}</code>}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Runtime() {
  return (
    <section className="screen screen--runtime" id="runtime" data-screen aria-labelledby="runtime-title">
      <div className="wrap">
        <Head eyebrow={loop.eyebrow} id="runtime-title" title={<T>{loop.title}</T>}>
          <p>{loop.principle[0]}<span className="hl">{loop.principle[1]}</span></p>
        </Head>
        <div className="reveal"><ExecutionLoop /></div>
      </div>
    </section>
  );
}

function Pillars() {
  const [sel, setSel] = useState(0);
  return (
    <section className="screen" id="pillars" data-screen aria-labelledby="pillars-title">
      <div className="wrap">
        <Head eyebrow={pillars.eyebrow} id="pillars-title" en title={<>{pillars.titleEn[0]} {pillars.titleEn[1]}</>}>
          <p>{pillars.titleZh && <strong className="lead-line">{pillars.titleZh}</strong>}{pillars.lead}</p>
        </Head>
        <div className="pillars-x">
          <ol className="pillars-x__tabs reveal" role="tablist" aria-label={ui.pillarsAria}>
            {pillars.items.map((it, i) => (
              <li key={it.code} role="presentation">
                <button
                  type="button"
                  role="tab"
                  id={`pillar-tab-${i}`}
                  aria-selected={sel === i}
                  aria-controls="pillar-panel"
                  tabIndex={sel === i ? 0 : -1}
                  className={sel === i ? 'is-on' : ''}
                  onClick={() => setSel(i)}
                  onMouseEnter={() => setSel(i)}
                  onKeyDown={(e) => {
                    const n = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? (i + 1) % 4 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? (i + 3) % 4 : -1;
                    if (n >= 0) {
                      e.preventDefault();
                      setSel(n);
                      document.getElementById(`pillar-tab-${n}`)?.focus();
                    }
                  }}
                >
                  <span className="pillars-x__no mono">0{i + 1}</span>
                  <span className="pillars-x__zh">{it.zh}</span>
                  {it.en && <span className="pillars-x__en" lang="en">{it.en}</span>}
                </button>
              </li>
            ))}
          </ol>
          <div className="pillars-x__panel reveal" role="tabpanel" id="pillar-panel" aria-labelledby={`pillar-tab-${sel}`}>
            <div className="pillar-stack">
              {pillars.items.map((it, i) => (
                <div className={`pillar-detail ${sel === i ? 'is-on' : ''}`} key={it.code} aria-hidden={sel !== i}>
                  <p className="pillar__code mono">{it.code}</p>
                  <h3 className="pillar-detail__lead">{it.lead}</h3>
                  <p className="pillar__body">{it.body}</p>
                  {it.points.length > 0 && (
                    <ul className="pillar__points">
                      {it.points.map(([k, v]) => (
                        <li key={k}><strong>{k}</strong>{v}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** gemini's manifesto: one archive-paper screen; it scrolls inside itself when taller than the window. */
function Manifesto() {
  return (
    <section className="screen screen--paper screen--tall" id="manifesto" data-screen aria-labelledby="manifesto-title">
      <div className="wrap">
        <div className="mf-head reveal">
          <div>
            <p className="eyebrow">{manifesto.eyebrow}</p>
            <h2 className="mf-title" id="manifesto-title" lang="en">
              The Agentware <em className="serif-i">Manifesto</em>
            </h2>
          </div>
          <img src="/brand/agentware_lockup_on-light.svg" alt="AGENTWARE" width="162" height="28" />
        </div>
        <p className="mf-intro reveal">{manifesto.intro}</p>
        <ol className="mf-list">
          {manifesto.items.map(([n, en, zh, body]) => (
            <li className="mf-item dock" key={n}>
              <span className="mf-item__no serif-i" aria-hidden="true">{n}.</span>
              <div className="mf-item__text">
                <h3 lang="en">{en.map((l) => <span className="ln" key={l}>{l}</span>)}</h3>
                {zh && <p className="mf-item__zh">{zh}</p>}
                <p className="mf-item__body">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mf-sign reveal">
          <span className="mono" lang="en">FROM INTERFACE TO INTENT</span>
          <span className="mono" lang="en">— AGENTWARE STUDIO</span>
        </div>
      </div>
    </section>
  );
}

/** gemini's studio: title, subtitle, three editorial columns; the footer closes the same screen. */
function Studio() {
  return (
    <div className="screen screen--last" data-screen>
      <section className="studio-screen" id="studio" aria-labelledby="studio-title">
        <div className="wrap">
          <Head eyebrow={studio.eyebrow} id="studio-title" title={<T>{studio.title}</T>}>
            <p>{studio.sub}</p>
          </Head>
          <div className="initiatives">
            {studio.items.map((it) => {
              // an initiative without a live site yet (e.g. AIKit) is shown without a link
              const ext = !!it.href?.startsWith('http');
              return (
                <article className="initiative reveal" key={it.tag}>
                  <p className="initiative__tag mono">{it.tag}</p>
                  <h3 className="initiative__title">{it.title}</h3>
                  <p className="initiative__body">{it.body}</p>
                  {it.href && it.action && (
                    <a className="text-action mono" href={ext ? it.href : href(it.href)} {...(ext ? { target: '_blank', rel: 'noopener' } : {})}>
                      {it.action}
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function useDock() {
  // Manifesto: each principle docks into place as the space for it is revealed.
  useEffect(() => {
    const els = document.querySelectorAll('.dock');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach((e) => e.classList.add('is-docked')); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-docked'); io.unobserve(e.target); } }),
      { threshold: 0, rootMargin: '0px 0px -8% 0px' }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

export function HomePage() {
  useEffect(() => { initPager(); }, []);
  useDock();
  return (
    <>
      <Hero />
      <Intent />
      <Shift />
      <NotAgentware />
      <Architecture />
      <Runtime />
      <Pillars />
      <Manifesto />
      <Studio />
    </>
  );
}
