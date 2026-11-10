// Email HTML: one table layout (what mail clients render reliably), inline styles, light background, a plain-text
// part for every message. The confirmation and welcome emails are in the subscriber's locale; broadcasts wrap the
// edition's content with a footer that carries Resend's unsubscribe link.
import type { Locale } from '../i18n';
import { CONFIRM_DAYS, type Edition } from './config';
import { NEWSLETTER } from './strings';

const SITE = 'https://agentware.studio';
const LOGO = `${SITE}/brand/agentware_icon_app_dark_180.png`;
const LANG: Record<Edition, Locale> = { zh: 'zh-CN', en: 'en', ja: 'ja' };
const PREFIX: Partial<Record<Locale, string>> = { 'zh-CN': '/zh', ja: '/ja', ko: '/ko', es: '/es', fr: '/fr', de: '/de', 'pt-BR': '/pt-br' };

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'PingFang SC','Hiragino Sans','Microsoft YaHei','Apple SD Gothic Neo',sans-serif";

function layout(locale: Locale, o: { preheader?: string; body: string; footer: string }) {
  return `<!doctype html>
<html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title></title></head>
<body style="margin:0;padding:0;background:#F4F3EF;">
${o.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(o.preheader)}</div>` : ''}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F3EF;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border:1px solid #E4E2DB;">
<tr><td style="padding:28px 32px 0;"><a href="${SITE}${PREFIX[locale] ?? ''}/"><img src="${LOGO}" width="36" height="36" alt="Agentware Studio" style="display:block;border:0;"></a></td></tr>
<tr><td style="padding:20px 32px 32px;font-family:${FONT};font-size:16px;line-height:1.75;color:#1C1E24;">${o.body}</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;"><tr><td style="padding:20px 32px;font-family:${FONT};font-size:12px;line-height:1.7;color:#7A7D86;">${o.footer}</td></tr></table>
</td></tr></table>
</body></html>`;
}

const h1 = (t: string) => `<h1 style="margin:0 0 16px;font-size:22px;line-height:1.4;font-weight:600;color:#07080C;">${esc(t)}</h1>`;
const p = (t: string, muted = false) => `<p style="margin:0 0 16px;${muted ? 'color:#5B5F6B;font-size:14px;' : ''}">${esc(t)}</p>`;
const button = (label: string, url: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr><td style="background:#07080C;"><a href="${esc(url)}" style="display:inline-block;padding:13px 26px;font-size:15px;font-weight:600;color:#FFFFFF;text-decoration:none;">${esc(label)}</a></td></tr></table>`;

/** The page in the subscriber's locale (`/start/`, `/zh/start/confirm/`, …) on `origin` (production or a preview). */
export const localeUrl = (origin: string, locale: Locale, path: string) => `${origin}${PREFIX[locale] ?? ''}${path}`;

export function confirmEmail(locale: Locale, url: string) {
  const m = NEWSLETTER[locale].mail;
  return {
    subject: m.confirmSubject,
    html: layout(locale, {
      preheader: m.confirmPreheader,
      body: h1(m.confirmHeading) + p(m.confirmBody) + button(m.confirmButton, url) + p(m.confirmIgnore, true),
      footer: esc(m.footer),
    }),
    text: `${m.confirmHeading}\n\n${m.confirmBody}\n\n${m.confirmButton}: ${url}\n\n${m.confirmIgnore}\n\n—\n${m.footer}\n`,
  };
}

export function welcomeEmail(locale: Locale) {
  const m = NEWSLETTER[locale].mail;
  const learn = locale === 'zh-CN' || locale === 'ja' ? `${SITE}${PREFIX[locale]}/learn/` : `${SITE}/learn/`;
  const blog = locale === 'zh-CN' || locale === 'ja' ? `${SITE}${PREFIX[locale]}/blog/` : `${SITE}/blog/`;
  const link = (label: string, url: string) => `<a href="${url}" style="color:#07080C;">${esc(label)}</a>`;
  return {
    subject: m.welcomeSubject,
    html: layout(locale, {
      body: h1(m.welcomeHeading) + p(m.welcomeBody) + (m.contentNote ? p(m.contentNote, true) : '')
        + `<p style="margin:0;">${esc(m.welcomeLinks)}: ${link(m.linkCourse, learn)} · ${link(m.linkBlog, blog)}</p>`,
      footer: esc(m.footer),
    }),
    text: `${m.welcomeHeading}\n\n${m.welcomeBody}\n\n${m.contentNote ? `${m.contentNote}\n\n` : ''}${m.welcomeLinks}:\n- ${m.linkCourse}: ${learn}\n- ${m.linkBlog}: ${blog}\n\n—\n${m.footer}\n`,
  };
}

export const UNSUBSCRIBE = '{{{RESEND_UNSUBSCRIBE_URL}}}';

/** A broadcast's content (an HTML fragment) in the newsletter layout, with the edition's footer and unsubscribe link. */
export function broadcastEmail(edition: Edition, content: { html: string; text?: string; preheader?: string }) {
  const locale = LANG[edition];
  const m = NEWSLETTER[locale].mail;
  const footer = `${esc(m.why)}<br><a href="${UNSUBSCRIBE}" style="color:#7A7D86;">${esc(m.unsubscribe)}</a> · ${esc(m.footer)}`;
  return {
    html: layout(locale, { preheader: content.preheader, body: content.html, footer }),
    text: content.text === undefined ? undefined : `${content.text}\n\n—\n${m.why}\n${m.unsubscribe}: ${UNSUBSCRIBE}\n${m.footer}\n`,
  };
}

export { CONFIRM_DAYS };
