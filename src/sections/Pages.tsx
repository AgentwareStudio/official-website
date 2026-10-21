import { LINKS, blog, learn, ui } from '../content';
import { T } from '../lib';
import { fmt, href, locale } from '../i18n';

const showEn = locale !== 'en';
function JoinLink({ to, label, en, primary = false }: { to: string; label: string; en: string; primary?: boolean }) {
  const ext = to.startsWith('http');
  return (
    <li>
      <a className={`join-link ${primary ? 'is-primary' : ''}`} href={ext ? to : href(to)} {...(ext ? { target: '_blank', rel: 'noopener' } : {})}>
        <span className="join-link__zh">{label}</span>
        {showEn && <span className="join-link__en" lang="en">{en}</span>}
        <span className="join-link__arrow" aria-hidden="true">{ext ? '↗' : '→'}</span>
      </a>
    </li>
  );
}

function PageHero({ crumb, title, en, lead, status, motto }: { crumb: string; title: string; en: string; lead: string; status: string; motto?: string[] }) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <p className="eyebrow"><a href={href('/')}>AGENTWARE STUDIO</a> <span aria-hidden="true">//</span> {crumb}</p>
        <h1 className="page-hero__title">
          {title}
          {showEn && <em lang="en">{en}</em>}
        </h1>
        <div className="page-hero__foot">
          {motto ? (
            <p className="page-hero__motto"><span lang="en">{motto[0]}</span>{motto[1]}</p>
          ) : <span />}
          <div>
            <p className="page-hero__lead">{lead}</p>
            <p className="status-tag"><i aria-hidden="true" />{status}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LearnPage() {
  return (
    <>
      <PageHero crumb="OPEN CURRICULUM" title={learn.title} en={learn.en} lead={learn.lead} status={learn.status} motto={learn.motto} />
      <nav className="wrap season-nav" aria-label={ui.learn.seasonsAria}>
        {learn.seasons.map((s, i) => (
          <a key={s.id} href={`#${s.id}`}>
            <span className="mono">0{i + 1}</span>{s.no} · {s.zh}{s.en && <span lang="en">{s.en}</span>}
          </a>
        ))}
      </nav>
      {learn.seasons.map((s) => {
        const count = s.units.reduce((a, [, l]) => a + l.length, 0);
        return (
          <section className="course" id={s.id} key={s.id} aria-labelledby={`${s.id}-t`}>
            <div className="wrap course__grid">
              <div className="course__side">
                <div className="course__sticky">
                  <p className="eyebrow">{s.no} // {(s.en || s.zh).toUpperCase()}</p>
                  <h2 className="course__title" id={`${s.id}-t`}>{s.zh}{s.en && <em lang="en">{s.en}</em>}</h2>
                  <p className="course__desc">{s.body}</p>
                  <dl className="facts">
                    {s.facts.map(([k, v]) => (
                      <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                    ))}
                  </dl>
                </div>
              </div>
              <div className="lessons">
                <p className="lessons__count mono">{fmt(ui.learn.count, { n: count })}</p>
                {s.units.map(([unit, lessons]) => (
                  <div className="lessons__unit" key={unit || 'all'}>
                    {unit && <h3>{unit}</h3>}
                    <ol>
                      {lessons.map(([no, title]) => (
                        <li className="lesson" key={no}>
                          <span className="lesson__no mono">{no}</span>
                          <span className="lesson__title">{title}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      })}
      <section className="page-cta">
        <div className="wrap page-cta__inner">
          <h2 className="h-section"><T>{learn.cta}</T></h2>
          <ul className="join__actions">
            <JoinLink primary to={LINKS.youtube} label={ui.learn.actions[0]} en="YouTube" />
            <JoinLink to="/blog/" label={ui.learn.actions[1]} en="Read the Blog" />
            <JoinLink to="/#manifesto" label={ui.learn.actions[2]} en="The Manifesto" />
          </ul>
        </div>
      </section>
    </>
  );
}

export function BlogPage() {
  return (
    <>
      <PageHero crumb="RESEARCH & ESSAYS" title={blog.title} en={blog.en} lead={blog.lead} status={blog.status} />
      <section className="section section--tight">
        <div className="wrap split">
          <div>
            <p className="eyebrow">01 // FIRST ESSAYS</p>
            <h2 className="h-sub">{ui.blog.queueTitle}</h2>
            <p className="split__note">{blog.queueNote}</p>
          </div>
          <ol className="queue">
            {blog.queue.map((q, i) => (
              <li className="queue__item" key={q}>
                <span className="queue__no mono">0{i + 1}</span>
                <span className="queue__title" lang="en">{q}</span>
                <span className="queue__state mono">{ui.blog.planned}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="section section--tight">
        <div className="wrap split">
          <div>
            <p className="eyebrow">02 // CATEGORIES</p>
            <h2 className="h-sub">{ui.blog.catsTitle}</h2>
            <p className="split__note">{blog.catsNote}</p>
          </div>
          <dl className="cats">
            {blog.cats.map(([zh, code, body]) => (
              <div key={code}>
                <dt>{zh}<code>{code}</code></dt>
                <dd>{body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className="page-cta">
        <div className="wrap page-cta__inner">
          <h2 className="h-section"><T>{blog.cta}</T></h2>
          <ul className="join__actions">
            <JoinLink primary to="/#manifesto" label={ui.blog.actions[0]} en="The Manifesto" />
            <JoinLink to="/learn/" label={ui.blog.actions[1]} en="Start Learning" />
            <JoinLink to={LINKS.x} label={ui.blog.actions[2]} en="@AgentwareStudio" />
          </ul>
        </div>
      </section>
    </>
  );
}

export function NotFoundPage() {
  return (
    <section className="page-hero page-hero--404">
      <div className="wrap">
        <p className="eyebrow">404 // PATH NOT FOUND</p>
        <h1 className="page-hero__title">{ui.nf.title}{showEn && <em lang="en">Path not found</em>}</h1>
        <div className="page-hero__foot">
          <span />
          <div>
            <p className="page-hero__lead">{ui.nf.lead}</p>
            <ul className="join__actions">
              <JoinLink primary to="/" label={ui.nf.actions[0]} en="Home" />
              <JoinLink to="/learn/" label={ui.nf.actions[1]} en="Learn" />
              <JoinLink to="/blog/" label={ui.nf.actions[2]} en="Blog" />
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
