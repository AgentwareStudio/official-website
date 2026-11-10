// POST {token} from the confirmation page (the visitor pressed its button; a mail scanner opening the link does not
// subscribe anyone): create or resubscribe the contact, then send the welcome email.
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { json, readJson, sameOrigin } from '../../../newsletter/api';
import { welcomeEmail } from '../../../newsletter/email';
import { ResendError, sendEmail, subscribe } from '../../../newsletter/resend';
import { addressId, open } from '../../../newsletter/token';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  if (!sameOrigin(request)) return json({ error: 'origin' }, 403);
  const body = await readJson(request);
  const p = typeof body?.token === 'string' && body.token.length < 1024 ? await open(body.token, env.NEWSLETTER_SECRET) : null;
  if (p === 'expired') return json({ error: 'expired' }, 410);
  if (!p) return json({ error: 'invalid' }, 400);
  try {
    const { already } = await subscribe(p.email, p.locale);
    if (!already) {
      try {
        await sendEmail({ to: p.email, ...welcomeEmail(p.locale) }, `welcome/${new URL(request.url).host}/${await addressId(p.email)}/${p.locale}`);
      } catch (e) {
        if (!(e instanceof ResendError && e.status === 409)) console.error('newsletter welcome', e);
      }
    }
  } catch (e) {
    console.error('newsletter confirm', e);
    return json({ error: 'server' }, 502);
  }
  return json({ ok: true, locale: p.locale });
};
