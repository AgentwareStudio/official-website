// The few Resend API calls the newsletter needs (https://resend.com/docs/api-reference). Contacts carry a `locale`
// property (created once by tools/newsletter_setup.mjs) and belong to the segment of their edition.
import { env } from 'cloudflare:workers';
import type { Locale } from '../i18n';
import { EDITIONS, editionOf, type Edition } from './config';


export class ResendError extends Error {
  constructor(public status: number, public body: string) { super(`Resend ${status}: ${body.slice(0, 300)}`); }
}

/** `missingOk`: a 404 means "does not exist" (looking a contact up) and returns null; anywhere else it is an error. */
async function call<T>(method: string, path: string, body?: unknown, headers: Record<string, string> = {}, missingOk = false): Promise<T | null> {
  // RESEND_API_URL: local tests only (.dev.vars), pointing at a stand-in for the API.
  const res = await fetch((env.RESEND_API_URL || 'https://api.resend.com') + path, {
    method,
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'User-Agent': 'agentware-website', ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (res.status === 404 && missingOk) return null;
  const text = await res.text();
  if (!res.ok) throw new ResendError(res.status, text);
  return text ? (JSON.parse(text) as T) : ({} as T);
}

/** Segment id of each edition (wrangler.jsonc vars; Workers Previews use test segments). */
export function segments(): Record<Edition, string> {
  const s = JSON.parse(env.NEWSLETTER_SEGMENTS) as Record<Edition, string>;
  for (const e of EDITIONS) if (!s[e]) throw new Error(`NEWSLETTER_SEGMENTS has no ${e}`);
  return s;
}

export interface Mail { to: string | string[]; subject: string; html: string; text?: string }

export function sendEmail(mail: Mail, idempotencyKey: string) {
  return call<{ id: string }>('POST', '/emails', { from: env.NEWSLETTER_FROM, ...mail }, { 'Idempotency-Key': idempotencyKey });
}

/**
 * Subscribe a confirmed address: create the contact, or resubscribe an existing one (a contact that unsubscribed
 * earlier and confirmed again), record its locale and keep it in exactly its edition's segment.
 * Returns whether it was already an active subscriber with the same locale.
 */
export async function subscribe(email: string, locale: Locale): Promise<{ already: boolean }> {
  const seg = segments();
  const target = seg[editionOf(locale)];
  const path = `/contacts/${encodeURIComponent(email)}`;
  const contact = await call<{ id: string; unsubscribed: boolean; properties?: Record<string, { value: unknown }> }>('GET', path, undefined, {}, true);
  const properties = { locale };
  if (!contact) {
    await call('POST', '/contacts', { email, unsubscribed: false, properties, segments: [{ id: target }] });
    return { already: false };
  }
  const current = await call<{ data: { id: string }[] }>('GET', `${path}/segments`);
  const ids = new Set((current?.data ?? []).map((s) => s.id));
  // Contacts (and their opt-out) are shared by the whole Resend team. A Workers Preview changes only its own test
  // contacts: in one of its segments and in none of production's (a production subscriber, or one who unsubscribed
  // there, keeps that membership).
  if (env.NEWSLETTER_PREVIEW === 'true') {
    const production = Object.values(JSON.parse(env.NEWSLETTER_PRODUCTION_SEGMENTS ?? '{}') as Record<string, string>).filter(Boolean);
    if (!production.length) throw new Error('NEWSLETTER_PRODUCTION_SEGMENTS is not set for previews');
    if (!EDITIONS.some((e) => ids.has(seg[e])) || production.some((id) => ids.has(id))) return { already: true };
  }
  const same = !contact.unsubscribed && contact.properties?.locale?.value === locale;
  await call('PATCH', path, { unsubscribed: false, properties });
  if (!ids.has(target)) await call('POST', `${path}/segments/${target}`);
  // Another edition's segment (the subscriber switched language): leave it, so each issue arrives once.
  for (const e of EDITIONS) if (seg[e] !== target && ids.has(seg[e])) await call('DELETE', `${path}/segments/${seg[e]}`);
  return { already: same && ids.has(target) };
}

export interface BroadcastInput { name?: string; subject: string; html: string; text?: string; send: boolean; scheduledAt?: string }

/** Create (and optionally send or schedule) a broadcast to one edition's segment. */
export function broadcast(edition: Edition, b: BroadcastInput) {
  return call<{ id: string }>('POST', '/broadcasts', {
    segment_id: segments()[edition],
    from: env.NEWSLETTER_FROM,
    ...(env.NEWSLETTER_REPLY_TO && { reply_to: env.NEWSLETTER_REPLY_TO }),
    name: b.name,
    subject: b.subject,
    html: b.html,
    ...(b.text !== undefined && { text: b.text }),
    send: b.send,
    ...(b.send && b.scheduledAt && { scheduled_at: b.scheduledAt }),
  });
}
