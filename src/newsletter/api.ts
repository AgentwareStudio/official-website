// Shared pieces of the newsletter endpoints (src/pages/api/newsletter/*).
import { env } from 'cloudflare:workers';
import { LOCALES, type Locale } from '../i18n';

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export const isLocale = (v: unknown): v is Locale => LOCALES.some((l) => l.code === v);

/** A plausible address, normalized (trimmed, lower case); null otherwise. Deliverability is proven by confirming. */
export function normalizeEmail(v: unknown): string | null {
  if (typeof v !== 'string') return null;
  const e = v.trim().toLowerCase();
  return e.length <= 254 && /^[^\s@"<>()[\]\\,;:]+@[^\s@"<>()[\]\\,;:]+\.[a-z]{2,}$/i.test(e) ? e : null;
}

/** Requests from a page of this site only (the browser sends Origin with every POST from a page). */
export const sameOrigin = (request: Request) => request.headers.get('Origin') === new URL(request.url).origin;

export async function readJson(request: Request): Promise<Record<string, unknown> | null> {
  if (!(request.headers.get('Content-Type') ?? '').includes('application/json')) return null;
  try {
    const v = await request.json();
    return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/** Cloudflare Turnstile: the token from the page's widget, checked once. */
export async function turnstileOk(token: unknown, request: Request) {
  if (typeof token !== 'string' || !token || token.length > 2048) return false;
  const form = new FormData();
  form.set('secret', env.TURNSTILE_SECRET);
  form.set('response', token);
  const ip = request.headers.get('CF-Connecting-IP');
  if (ip) form.set('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    return ((await res.json()) as { success?: boolean }).success === true;
  } catch {
    return false;
  }
}

/** Constant-time comparison of the publishing system's bearer token. */
export async function bearerOk(request: Request) {
  const expected = env.NEWSLETTER_API_TOKEN;
  const got = (request.headers.get('Authorization') ?? '').replace(/^Bearer\s+/i, '');
  if (!expected || !got) return false;
  const enc = new TextEncoder();
  const [a, b] = await Promise.all([got, expected].map((s) => crypto.subtle.digest('SHA-256', enc.encode(s))));
  const x = new Uint8Array(a), y = new Uint8Array(b);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}
