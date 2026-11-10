// POST {email, locale, turnstile} from a /start page: send the confirmation email in the page's language.
// The answer is the same whether or not the address is already subscribed (no address lookup through this form).
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { CONFIRM_DAYS } from '../../../newsletter/config';
import { confirmEmail, localeUrl } from '../../../newsletter/email';
import { isLocale, json, normalizeEmail, readJson, sameOrigin, turnstileOk } from '../../../newsletter/api';
import { ResendError, sendEmail } from '../../../newsletter/resend';
import { addressId, seal } from '../../../newsletter/token';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return json({ error: 'origin' }, 403);
  const body = await readJson(request);
  const email = normalizeEmail(body?.email);
  if (!body || !email || !isLocale(body.locale)) return json({ error: 'invalid' }, 400);
  // Missing secrets are the site's fault, not the visitor's: answer "server", not "verification failed".
  if (!env.TURNSTILE_SECRET || !env.RESEND_API_KEY) {
    console.error('newsletter subscribe: TURNSTILE_SECRET or RESEND_API_KEY is not set');
    return json({ error: 'server' }, 503);
  }
  if (!(await turnstileOk(body.turnstile, request))) return json({ error: 'verify' }, 403);
  const locale = body.locale;

  let token: string;
  try {
    token = await seal({ email, locale, exp: Date.now() + CONFIRM_DAYS * 86400_000 }, env.NEWSLETTER_SECRET);
  } catch (e) {
    console.error('newsletter subscribe', e);
    return json({ error: 'server' }, 502);
  }
  const origin = new URL(request.url).origin;
  const url = `${localeUrl(origin, locale, '/start/confirm/')}#t=${token}`;
  // One confirmation per site (production, each preview: they share the Resend team), address, locale and hour:
  // repeated submissions do not flood the inbox (Resend answers 409 for a reused key with a different body; the
  // earlier email stands).
  const key = `confirm/${new URL(origin).host}/${await addressId(email)}/${locale}/${Math.floor(Date.now() / 3600_000)}`;
  try {
    await sendEmail({ to: email, ...confirmEmail(locale, url) }, key);
  } catch (e) {
    if (!(e instanceof ResendError && e.status === 409)) {
      console.error('newsletter subscribe', e);
      return json({ error: 'server' }, 502);
    }
  }
  return json({ ok: true });
};
