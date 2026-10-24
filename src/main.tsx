import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { Footer, Header, LangHint } from './components/Chrome';
import { useRevealOnScroll } from './lib';
import { ui } from './content';
import { loadLocale } from './i18n';

type Page = 'home' | 'learn' | 'notfound';
export function mountPage(page: Page, PageContent: React.ComponentType) {
  if (page === 'home') document.documentElement.classList.add('snap');
  function App() {
    useRevealOnScroll();
    return (
      <>
        <a className="skip-link" href="#main">{ui.skip}</a>
        <Header page={page} />
        <LangHint page={page} />
        <main id="main" tabIndex={-1}>
          <PageContent />
        </main>
        {page !== 'home' && <Footer />}
      </>
    );
  }

  loadLocale().finally(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
}
