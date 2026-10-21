import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import { Footer, Header, LangHint } from './components/Chrome';
import { HomePage } from './sections/Home';
import { BlogPage, LearnPage, NotFoundPage } from './sections/Pages';
import { useRevealOnScroll } from './lib';
import { ui } from './content';
import { loadLocale } from './i18n';

type Page = 'home' | 'learn' | 'blog' | 'notfound';
const page = (document.body.dataset.page as Page) || 'home';
if (page === 'home') document.documentElement.classList.add('snap');

function App() {
  useRevealOnScroll();
  return (
    <>
      <a className="skip-link" href="#main">{ui.skip}</a>
      <Header page={page} />
      <LangHint page={page} />
      <main id="main" tabIndex={-1}>
        {page === 'home' && <HomePage />}
        {page === 'learn' && <LearnPage />}
        {page === 'blog' && <BlogPage />}
        {page === 'notfound' && <NotFoundPage />}
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
