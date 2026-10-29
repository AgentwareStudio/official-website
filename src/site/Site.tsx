// The page shell shared by every page island: header, language hint, main and footer.
// Each page type has its own island module (HomeSite, LearnSite, NotFoundSite), so a page only loads its sections.
import React, { useEffect, useState } from 'react';
import { Footer, Header, LangHint, type Alternates } from '../components/Chrome';
import { useRevealOnScroll } from '../lib';
import { ui } from '../content';
import { loadLocale, setLocale, type Locale, type Messages } from '../i18n';
import type { Page } from '../meta';

function App({ page, alternates, children }: { page: Page; alternates?: Alternates; children: React.ReactNode }) {
  useRevealOnScroll();
  return (
    <>
      <a className="skip-link" href="#main">{ui.skip}</a>
      <Header page={page} alternates={alternates} />
      <LangHint page={page} alternates={alternates} />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      {page !== 'home' && <Footer />}
    </>
  );
}

export interface PageProps {
  code: Locale;
  messages: Messages | null;
}

// The build renders pages one after another (astro.config.mjs: build.concurrency 1), so the shared copy
// only needs switching when the locale changes; re-renders in the browser skip the work.
let applied: PageProps | null = null;

/** A page rendered at build time and hydrated with the same locale and messages. */
export function Site({ page, code, messages, alternates, children }: PageProps & { page: Page; alternates?: Alternates; children: React.ReactNode }) {
  if (applied?.code !== code || applied.messages !== messages) {
    setLocale(code, messages);
    applied = { code, messages };
  }
  return (
    <React.StrictMode>
      <App page={page} alternates={alternates}>{children}</App>
    </React.StrictMode>
  );
}

/** A page rendered in the browser only: it takes its locale from the path, then loads and applies it. */
export function BrowserSite({ page, children }: { page: Page; children: () => React.ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    loadLocale().finally(() => setReady(true));
  }, []);
  return ready ? (
    <React.StrictMode>
      <App page={page}>{children()}</App>
    </React.StrictMode>
  ) : null;
}
