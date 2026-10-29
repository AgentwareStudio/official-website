import { useEffect, useRef, useState } from 'react';
import { LINKS, footer, ui } from '../content';
import { HINT, LOCALES, browserLocale, chosenLocale, href, locale, localeHref, markSeen, rememberLocale, type Locale } from '../i18n';
import lockupDark from '../assets/brand/agentware_lockup_on-dark.svg?url';
import lockupLight from '../assets/brand/agentware_lockup_on-light.svg?url';
import wordmarkDark from '../assets/brand/agentware_wordmark_on-dark.svg?url';
import type { Page } from '../meta';

/** The same page in other locales, when it differs from the per-page default (blog posts exist in some languages only). */
export type Alternates = Partial<Record<Locale, string>>;

const NAV = [
  { href: '/#shift', key: 'paradigm', en: 'Paradigm' },
  { href: '/#architecture', key: 'architecture', en: 'Architecture' },
  { href: '/#manifesto', key: 'manifesto', en: 'Manifesto' },
  { href: '/#studio', key: 'studio', en: 'Studio' },
] as const;
const PAGES = [
  { href: '/learn/', key: 'learn', en: 'Learn' },
  { href: '/blog/', key: 'blog', en: 'Blog' },
] as const;
// The blog is written in Chinese, English and Japanese; the other locales link to the English blog.
const BLOG_LOCALES: Locale[] = ['zh-CN', 'en', 'ja'];
export const blogHref = (code: Locale) => (BLOG_LOCALES.includes(code) ? localeHref(code, '/blog/') : '/blog/');
const pageHref = (p: string) => (p === '/blog/' ? blogHref(locale) : href(p));
const isCurrent = (page: Page, key: string) => page === key || (key === 'blog' && page === 'post');
// Read at render time: one build renders every locale in turn.
const showEn = () => locale !== 'en';
const SHORT: Record<string, string> = { 'zh-CN': 'ZH', en: 'EN', ja: 'JA', ko: 'KO', es: 'ES', fr: 'FR', de: 'DE', 'pt-BR': 'PT' };
const isBlog = (page: Page) => page === 'blog' || page === 'post';
const pagePath = (page: Page) => (page === 'learn' ? '/learn/' : '/');
/** Where a language link leads: the page's own version in that locale, else the locale's version of the page type. */
const langHref = (code: Locale, page: Page, alternates?: Alternates) =>
  alternates?.[code] ?? (isBlog(page) ? blogHref(code) : localeHref(code, pagePath(page)));

const THEME_LABEL: Partial<Record<Locale, string>> = { 'zh-CN': '切换浅色/深色', ja: 'ライト/ダーク切り替え' };

/**
 * Blog pages only: light (paper) or dark. The head script in Page.astro applies the stored choice, else the system
 * setting, before the first paint; the icons follow <html data-blog-mode> through CSS (src/blog/blog.css).
 */
function ThemeButton() {
  const toggle = () => {
    const root = document.documentElement;
    const next = root.dataset.blogMode === 'paper' ? 'dark' : 'paper';
    root.dataset.blogMode = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next === 'paper' ? '#F4F3EF' : '#07080C');
    try { localStorage.setItem('aw-blog-theme', next); } catch { /* storage unavailable: the choice lasts for this page */ }
  };
  return (
    <button type="button" className="theme-btn" onClick={toggle} aria-label={THEME_LABEL[locale] ?? 'Switch light/dark'} title={THEME_LABEL[locale] ?? 'Switch light/dark'}>
      <svg className="theme-btn__sun" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><circle cx="8" cy="8" r="3" /><path d="M8 1.5v1.8M8 12.7v1.8M1.5 8h1.8M12.7 8h1.8M3.4 3.4l1.3 1.3M11.3 11.3l1.3 1.3M3.4 12.6l1.3-1.3M11.3 4.7l1.3-1.3" /></svg>
      <svg className="theme-btn__moon" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M13.2 10.1A5.6 5.6 0 0 1 5.9 2.8a5.6 5.6 0 1 0 7.3 7.3Z" /></svg>
    </button>
  );
}

/** Language switch: links to the same page in each locale. */
function LangMenu({ page, alternates }: { page: Page; alternates?: Alternates }) {
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
              href={langHref(l.code, page, alternates)}
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

export function Header({ page, alternates }: { page: Page; alternates?: Alternates }) {
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
          {isBlog(page) ? (
            // Blog pages can switch to paper: the matching lockup is shown by src/blog/blog.css.
            <>
              <img className="brand__on-dark" src={lockupDark} alt="" width="139" height="24" />
              <img className="brand__on-light" src={lockupLight} alt="" width="139" height="24" />
            </>
          ) : (
            <img src={lockupDark} alt="" width="139" height="24" />
          )}
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
              <li key={p.href}><a href={pageHref(p.href)} aria-current={isCurrent(page, p.key) ? 'page' : undefined}>{ui.nav[p.key]}</a></li>
            ))}
          </ul>
        </nav>
        <LangMenu page={page} alternates={alternates} />
        {isBlog(page) && <ThemeButton />}
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
                  {showEn() && <span className="menu-sheet__en" lang="en">{n.en}</span>}
                </a>
              </li>
            ))}
          </ol>
          <ul className="menu-sheet__pages">
            {PAGES.map((p) => (
              <li key={p.href}><a href={pageHref(p.href)} onClick={close} aria-current={isCurrent(page, p.key) ? 'page' : undefined}>{ui.nav[p.key]}{showEn() && <span lang="en">{p.en}</span>}</a></li>
            ))}
          </ul>
          <ul className="menu-sheet__langs" aria-label={ui.language}>
            {LOCALES.map((l) => (
              <li key={l.code}>
                <a href={langHref(l.code, page, alternates)} hrefLang={l.code} lang={l.code} aria-current={l.code === locale ? 'true' : undefined} onClick={() => rememberLocale(l.code)}>{l.label}</a>
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
export function LangHint({ page, alternates }: { page: Page; alternates?: Alternates }) {
  const [want, setWant] = useState<(typeof LOCALES)[number] | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    markSeen();
    if (chosenLocale()) return;
    const pref = browserLocale();
    if (pref === locale) return;
    // Only offer a version that exists (blog pages list theirs in `alternates`).
    if (isBlog(page) && !alternates?.[pref]) return;
    const t = window.setTimeout(() => { setWant(LOCALES.find((l) => l.code === pref) ?? null); requestAnimationFrame(() => setShown(true)); }, 900);
    return () => window.clearTimeout(t);
  }, []);
  if (!want) return null;
  const h = HINT[want.code];
  const dismiss = () => { rememberLocale(locale); setShown(false); window.setTimeout(() => setWant(null), 300); };
  return (
    <div className={`lang-hint ${shown ? 'is-on' : ''}`} role="region" aria-label={h.text} lang={want.code}>
      <p className="lang-hint__text">{h.text}</p>
      <a className="lang-hint__go" href={langHref(want.code, page, alternates) + (page === 'home' ? location.hash : '')} hrefLang={want.code} onClick={() => rememberLocale(want.code)}>
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
