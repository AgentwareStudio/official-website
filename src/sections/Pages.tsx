import { LINKS, learn, ui } from '../content';
import { T } from '../lib';
import { href, locale } from '../i18n';

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

// The course is taught in these three languages only, whatever the page locale. Each name keeps its own
// lang so it renders in that language's font (the ja/ko subsets cannot show simplified Chinese).
const COURSE_NAMES = [['zh-CN', 'AI 抽卡毕业课'], ['ja', 'AIガチャ卒業講座'], ['en', 'Graduating from AI Gacha']] as const;
const COURSE_LANGS = [['zh-CN', '中文'], ['ja', '日本語'], ['en', 'English']] as const;
const dotted = (items: readonly (readonly [string, string])[]) =>
  items.map(([l, t], i) => <span key={l} lang={l}>{i > 0 && ' · '}{t}</span>);

export function LearnPage() {
  const c = learn.course;
  return (
    <>
      <PageHero crumb="OPEN CURRICULUM" title={learn.title} en={learn.en} lead={learn.lead} status={learn.status} motto={learn.motto} />
      <section className="course" id="ai-gacha" aria-labelledby="ai-gacha-t">
        <div className="wrap course__grid">
          <div className="course__side">
            <div className="course__sticky">
              <p className="eyebrow">COURSE 01 // AI GACHA</p>
              <h2 className="course__title" id="ai-gacha-t">{c.name}<em>{dotted(COURSE_NAMES.filter(([, n]) => n !== c.name))}</em></h2>
              <p className="course__desc">{c.body}</p>
              <dl className="facts">
                <div><dt>{c.langs}</dt><dd>{dotted(COURSE_LANGS)}</dd></div>
              </dl>
              <ul className="join__actions course__go">
                <JoinLink primary to={LINKS.learn} label={ui.learn.actions[0]} en="learn.agentware.studio" />
              </ul>
            </div>
          </div>
          <div className="lessons" aria-label={ui.learn.seasonsAria}>
            {learn.seasons.map((s) => (
              <div className="lessons__unit season" id={s.id} key={s.id}>
                <p className="eyebrow">{s.no} // {(s.en || s.zh).toUpperCase()}</p>
                <h3>{s.zh}{s.en && <span lang="en"> · {s.en}</span>}</h3>
                <p className="season__body">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="page-cta">
        <div className="wrap page-cta__inner">
          <h2 className="h-section"><T>{learn.cta}</T></h2>
          <ul className="join__actions">
            <JoinLink primary to={LINKS.learn} label={ui.learn.actions[0]} en="Start the Course" />
            <JoinLink to={LINKS.youtube} label={ui.learn.actions[1]} en="YouTube" />
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
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
