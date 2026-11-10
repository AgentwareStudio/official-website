// The newsletter pages. The form posts to the Worker (src/pages/api/newsletter/subscribe.ts) with a Cloudflare
// Turnstile token; the confirmation page sends the sealed token from its URL fragment only when the visitor presses
// the button, so mail scanners that open links do not subscribe anyone.
import { useEffect, useRef, useState } from 'react';
import { href, locale } from '../i18n';
import { TURNSTILE_SITE_KEY, WECHAT } from '../newsletter/config';
import type { NewsletterStrings } from '../newsletter/strings';

declare global {
  interface Window {
    turnstile?: {
      render(el: HTMLElement, o: Record<string, unknown>): string;
      reset(id?: string): void;
    };
  }
}

const TURNSTILE_JS = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let turnstileLoading: Promise<void> | null = null;
/** Loads Turnstile once, after the page has rendered (it is not needed for the first paint). */
function loadTurnstile() {
  turnstileLoading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = TURNSTILE_JS;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { turnstileLoading = null; reject(new Error('turnstile')); };
    document.head.appendChild(s);
  });
  return turnstileLoading;
}

const TURNSTILE_LANG: Record<string, string> = { 'zh-CN': 'zh-cn', 'pt-BR': 'pt-br' };

function Hero({ title, lead, crumb }: { title: string; lead: string; crumb: string }) {
  return (
    <section className="page-hero nl-hero">
      <div className="wrap">
        <p className="eyebrow"><a href={href('/')}>AGENTWARE STUDIO</a> <span aria-hidden="true">//</span> {crumb}</p>
        <h1 className="page-hero__title">{title}{!title.includes('Newsletter') && <em lang="en">Newsletter</em>}</h1>
        <p className="page-hero__lead nl-hero__lead">{lead}</p>
      </div>
    </section>
  );
}

type Status = 'idle' | 'sending' | 'sent' | 'invalid' | 'verify' | 'server';

function SignupForm({ nl }: { nl: NewsletterStrings }) {
  const p = nl.page;
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [sentTo, setSentTo] = useState('');
  const box = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const token = useRef('');

  useEffect(() => {
    let gone = false;
    loadTurnstile().then(() => {
      if (gone || !box.current || !window.turnstile || widget.current) return;
      widget.current = window.turnstile.render(box.current, {
        sitekey: TURNSTILE_SITE_KEY, theme: 'dark', size: 'flexible', language: TURNSTILE_LANG[locale] ?? locale,
        appearance: 'interaction-only',
        callback: (t: string) => { token.current = t; },
        'expired-callback': () => { token.current = ''; },
        'error-callback': () => { token.current = ''; },
      });
    }).catch(() => { /* the submit reports it */ });
    return () => { gone = true; };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) { setStatus('invalid'); return; }
    setStatus('sending');
    // Turnstile usually finishes in the background before the visitor is done typing; give it a few seconds if not.
    for (let i = 0; !token.current && i < 40; i++) await new Promise((r) => setTimeout(r, 200));
    if (!token.current) { setStatus('verify'); return; }
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, locale, turnstile: token.current }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && body.ok) { setSentTo(value); setStatus('sent'); return; }
      setStatus(body.error === 'invalid' ? 'invalid' : body.error === 'verify' ? 'verify' : 'server');
    } catch {
      setStatus('server');
    } finally {
      // A Turnstile token is good for one check.
      token.current = '';
      if (widget.current) window.turnstile?.reset(widget.current);
    }
  }

  if (status === 'sent') {
    return (
      <div className="nl-form nl-form--sent" role="status">
        <p className="nl-form__title">{p.sent}</p>
        <p className="nl-form__note">{p.sentBody.replace('{email}', sentTo)}</p>
      </div>
    );
  }
  const error = status === 'invalid' ? p.errInvalid : status === 'verify' ? p.errVerify : status === 'server' ? p.errServer : '';
  return (
    <form className="nl-form" onSubmit={submit} noValidate>
      <label className="nl-form__label" htmlFor="nl-email">{p.email}</label>
      <div className="nl-form__row">
        <input id="nl-email" className="nl-form__input" type="email" name="email" autoComplete="email" inputMode="email" required
          placeholder={p.placeholder} value={email} onChange={(e) => { setEmail(e.target.value); if (status !== 'sending') setStatus('idle'); }}
          aria-invalid={status === 'invalid' || undefined} aria-describedby={error ? 'nl-error' : 'nl-privacy'} />
        <button className="nl-form__submit" type="submit" disabled={status === 'sending'}>{status === 'sending' ? p.sending : p.submit}</button>
      </div>
      <div className="nl-form__check" ref={box} />
      <p id="nl-error" className="nl-form__error" role="alert">{error}</p>
      <p id="nl-privacy" className="nl-form__note">{p.privacy}</p>
      {p.contentNote && <p className="nl-form__note">{p.contentNote}</p>}
    </form>
  );
}

export function StartPage({ nl }: { nl: NewsletterStrings }) {
  const p = nl.page;
  return (
    <>
      <Hero title={p.title} lead={p.lead} crumb={p.crumb} />
      <section className="nl-body">
        <div className="wrap nl-body__grid">
          <div className="nl-body__what">
            <p className="eyebrow">{p.what}</p>
            <ul className="nl-points">
              {p.points.map((t, i) => <li key={i}><span className="mono" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>{t}</li>)}
            </ul>
            <p className="status-tag"><i aria-hidden="true" />{p.cadence}</p>
          </div>
          <div className="nl-body__form">
            <SignupForm nl={nl} />
            {locale === 'zh-CN' && WECHAT && p.wechatTitle && (
              <div className="nl-wechat">
                <img src={WECHAT.qr} width="112" height="112" alt={`${p.wechatTitle}：${WECHAT.name}`} loading="lazy" />
                <div>
                  <p className="nl-form__title">{p.wechatTitle}</p>
                  <p className="nl-form__note">{p.wechatBody}</p>
                  <p className="nl-wechat__name">{WECHAT.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

type ConfirmStatus = 'ready' | 'working' | 'done' | 'expired' | 'invalid' | 'error';

export function ConfirmPage({ nl }: { nl: NewsletterStrings }) {
  const c = nl.confirm;
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<ConfirmStatus>('ready');
  useEffect(() => {
    const t = new URLSearchParams(location.hash.slice(1)).get('t');
    if (t) setToken(t); else setStatus('invalid');
  }, []);

  async function confirm() {
    if (!token) return;
    setStatus('working');
    try {
      const res = await fetch('/api/newsletter/confirm', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }),
      });
      const body = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && body.ok) {
        setStatus('done');
        // The link has done its job; keep it out of the history.
        history.replaceState(null, '', location.pathname);
      } else setStatus(body.error === 'expired' ? 'expired' : body.error === 'invalid' ? 'invalid' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const failed = status === 'expired' || status === 'invalid' || status === 'error';
  return (
    <section className="page-hero nl-hero nl-confirm">
      <div className="wrap">
        <p className="eyebrow"><a href={href('/')}>AGENTWARE STUDIO</a> <span aria-hidden="true">//</span> {nl.page.crumb}</p>
        <h1 className="page-hero__title">{status === 'done' ? c.doneTitle : c.title}</h1>
        <div className="nl-confirm__body" role="status">
          {status === 'done' ? <p className="page-hero__lead">{c.doneBody}</p>
            : failed ? (
              <>
                <p className="page-hero__lead">{status === 'expired' ? c.expired : status === 'invalid' ? c.invalid : c.error}</p>
                {status !== 'error' && <a className="text-action mono" href={href('/start/')}>{c.back} →</a>}
                {status === 'error' && <button type="button" className="nl-form__submit" onClick={confirm}>{c.button}</button>}
              </>
            ) : (
              <>
                <p className="page-hero__lead">{c.lead}</p>
                <button type="button" className="nl-form__submit" onClick={confirm} disabled={!token || status === 'working'}>
                  {status === 'working' ? c.working : c.button}
                </button>
              </>
            )}
        </div>
      </div>
    </section>
  );
}
