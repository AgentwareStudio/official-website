import { useEffect, useRef, useState } from 'react';
import { LINKS, footer, ui } from '../content';
import { HINT, LOCALES, browserLocale, chosenLocale, href, locale, localeHref, markSeen, rememberLocale } from '../i18n';
import lockupDark from '../assets/brand/agentware_lockup_on-dark.svg';
import wordmarkDark from '../assets/brand/agentware_wordmark_on-dark.svg';

type Page = 'home' | 'learn' | 'notfound';

const NAV = [
  { href: '/#shift', key: 'paradigm', en: 'Paradigm' },
  { href: '/#architecture', key: 'architecture', en: 'Architecture' },
  { href: '/#manifesto', key: 'manifesto', en: 'Manifesto' },
  { href: '/#studio', key: 'studio', en: 'Studio' },
] as const;
const PAGES = [
  { href: '/learn/', key: 'learn', en: 'Learn' },
] as const;
const showEn = locale !== 'en';
const SHORT: Record<string, string> = { 'zh-CN': 'ZH', en: 'EN', ja: 'JA', ko: 'KO', es: 'ES', fr: 'FR', de: 'DE', 'pt-BR': 'PT' };
const pagePath = (page: Page) => (page === 'learn' ? '/learn/' : '/');

/** Language switch: links to the same page in each locale. */
function LangMenu({ page }: { page: Page }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); root.current?.querySelector('button')?.focus(); } };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('pointerdown', onDown); window.removeEventListener('keydown', onKey); };
  }, [open]);
  return (
    <div className={`lang ${open ? 'is-open' : ''}`} ref={root}>
      <button type="button" className="lang__btn" aria-expanded={open} aria-controls="lang-list" onClick={() => setOpen((v) => !v)}>
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="6.25" /><path d="M1.75 8h12.5M8 1.75c-2.2 2.3-2.2 10.2 0 12.5M8 1.75c2.2 2.3 2.2 10.2 0 12.5" /></svg>
        <span className="visually-hidden">{ui.language}: </span>
        <span>{SHORT[locale]}</span>
      </button>
      <ul className="lang__list" id="lang-list" hidden={!open}>
        {LOCALES.map((l) => (
          <li key={l.code}>
            <a
              href={localeHref(l.code, pagePath(page))}
              hrefLang={l.code}
              lang={l.code}
              aria-current={l.code === locale ? 'true' : undefined}
              onClick={(e) => { rememberLocale(l.code); if (location.hash && page === 'home') { e.preventDefault(); location.href = localeHref(l.code, '/') + location.hash; } }}
            >
              <span>{l.label}</span>
              <span className="lang__code" aria-hidden="true">{SHORT[l.code]}</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Header({ page }: { page: Page }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);
  const home = page === 'home';
  const h = (p: string) => (home && p.startsWith('/#') ? p.slice(1) : href(p));

  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 8);
    f();
    window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const main = document.getElementById('main');
    const foot = document.querySelector('footer');
    if (open) { main?.setAttribute('inert', ''); foot?.setAttribute('inert', ''); }
    else { main?.removeAttribute('inert'); foot?.removeAttribute('inert'); }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) { setOpen(false); btn.current?.focus(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="wrap site-header__bar">
        <a className="brand" href={home ? '#top' : href('/')} aria-label={ui.home} onClick={close}>
          <img src={lockupDark} alt="" width="139" height="24" />
          <span className="brand__studio" aria-hidden="true">STUDIO</span>
        </a>
        <nav className="site-nav" aria-label={ui.mainNav}>
          <ul className="site-nav__anchors">
            {NAV.map((n) => (
              <li key={n.href}><a href={h(n.href)}>{ui.nav[n.key]}</a></li>
            ))}
          </ul>
          <span className="site-nav__sep" aria-hidden="true" />
          <ul className="site-nav__pages">
            {PAGES.map((p) => (
              <li key={p.href}><a href={href(p.href)} aria-current={page === p.key ? 'page' : undefined}>{ui.nav[p.key]}</a></li>
            ))}
          </ul>
        </nav>
        <LangMenu page={page} />
        <button
          ref={btn}
          className="menu-btn"
          type="button"
          aria-expanded={open}
          aria-controls="menu-sheet"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="visually-hidden">{open ? ui.menuClose : ui.menuOpen}</span>
          <span className="menu-btn__bars" aria-hidden="true"><i /><i /></span>
        </button>
      </div>
    </header>
      <div className="menu-sheet" id="menu-sheet" hidden={!open}>
        <div className="wrap">
          <ol className="menu-sheet__list">
            {NAV.map((n, i) => (
              <li key={n.href}>
                <a href={h(n.href)} onClick={close}>
                  <span className="menu-sheet__no">0{i + 1}</span>
                  <span>{ui.nav[n.key]}</span>
                  {showEn && <span className="menu-sheet__en" lang="en">{n.en}</span>}
                </a>
              </li>
            ))}
          </ol>
          <ul className="menu-sheet__pages">
            {PAGES.map((p) => (
              <li key={p.href}><a href={href(p.href)} onClick={close} aria-current={page === p.key ? 'page' : undefined}>{ui.nav[p.key]}{showEn && <span lang="en">{p.en}</span>}</a></li>
            ))}
          </ul>
          <ul className="menu-sheet__langs" aria-label={ui.language}>
            {LOCALES.map((l) => (
              <li key={l.code}>
                <a href={localeHref(l.code, pagePath(page))} hrefLang={l.code} lang={l.code} aria-current={l.code === locale ? 'true' : undefined} onClick={() => rememberLocale(l.code)}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

/**
 * When the page is not in the visitor's browser language and they have not picked a language yet,
 * offer theirs in a small notice. Switching or dismissing both count as a choice and are remembered.
 */
export function LangHint({ page }: { page: Page }) {
  const [want, setWant] = useState<(typeof LOCALES)[number] | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    markSeen();
    if (chosenLocale()) return;
    const pref = browserLocale();
    if (pref === locale) return;
    const t = window.setTimeout(() => { setWant(LOCALES.find((l) => l.code === pref) ?? null); requestAnimationFrame(() => setShown(true)); }, 900);
    return () => window.clearTimeout(t);
  }, []);
  if (!want) return null;
  const h = HINT[want.code];
  const dismiss = () => { rememberLocale(locale); setShown(false); window.setTimeout(() => setWant(null), 300); };
  return (
    <div className={`lang-hint ${shown ? 'is-on' : ''}`} role="region" aria-label={h.text} lang={want.code}>
      <p className="lang-hint__text">{h.text}</p>
      <a className="lang-hint__go" href={localeHref(want.code, pagePath(page)) + (page === 'home' ? location.hash : '')} hrefLang={want.code} onClick={() => rememberLocale(want.code)}>
        {h.go}<span aria-hidden="true"> →</span>
      </a>
      <button type="button" className="lang-hint__x" onClick={dismiss} aria-label={h.close}>
        <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d="M1 1l10 10M11 1L1 11" /></svg>
      </button>
    </div>
  );
}

export function Footer() {
  // gemini's footer: one quiet line — wordmark and entity on the left, outbound links on the right
  return (
    <footer className="site-footer">
      <div className="wrap site-footer__row">
        <div className="site-footer__brand">
          <img src={wordmarkDark} alt="AGENTWARE" width="131" height="14" />
          <span lang="en">Agentware Studio · {footer.entity}</span>
        </div>
        <nav className="site-footer__links" aria-label={ui.follow}>
          <a href={LINKS.github} target="_blank" rel="noopener">GitHub</a>
          <a href={LINKS.x} target="_blank" rel="noopener">X</a>
          <a href={LINKS.youtube} target="_blank" rel="noopener">YouTube</a>
        </nav>
      </div>
    </footer>
  );
}
