// Confirmation links carry the address and locale sealed with AES-GCM (key derived from NEWSLETTER_SECRET), so the
// Worker keeps no state between the request and the confirmation, and the address never appears in the URL.
import type { Locale } from '../i18n';

export interface Pending { email: string; locale: Locale; exp: number }

const enc = new TextEncoder();
const b64url = (b: Uint8Array) => btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = (s: string) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));

async function key(secret: string) {
  // A missing secret must not become a guessable key ("undefined"): fail, and no token is made or accepted.
  if (typeof secret !== 'string' || secret.length < 32) throw new Error('NEWSLETTER_SECRET is missing or shorter than 32 characters');
  const raw = await crypto.subtle.digest('SHA-256', enc.encode(`agentware-newsletter-confirm:${secret}`));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function seal(p: Pending, secret: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await key(secret), enc.encode(JSON.stringify(p))));
  const out = new Uint8Array(iv.length + data.length);
  out.set(iv);
  out.set(data, iv.length);
  return b64url(out);
}

/** The sealed request, 'expired', or null when the token is not one of ours. */
export async function open(token: string, secret: string): Promise<Pending | 'expired' | null> {
  try {
    const raw = unb64url(token);
    if (raw.length < 13) return null;
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: raw.slice(0, 12) }, await key(secret), raw.slice(12));
    const p = JSON.parse(new TextDecoder().decode(plain)) as Pending;
    return Date.now() > p.exp ? 'expired' : p;
  } catch {
    return null;
  }
}

/** A stable, non-reversible id for an address (idempotency keys, logs). */
export async function addressId(email: string) {
  const h = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(email)));
  return b64url(h).slice(0, 22);
}
