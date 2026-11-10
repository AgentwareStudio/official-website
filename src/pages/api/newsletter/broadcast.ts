// The publishing system's endpoint (Authorization: Bearer NEWSLETTER_API_TOKEN). One call per issue:
//
//   POST /api/newsletter/broadcast
//   { "name": "2026-11",                     // internal name in Resend (optional)
//     "editions": { "zh": {...}, "en": {...}, "ja": {...} },   // any of the three; each:
//        { "subject": "…", "html": "<h1>…</h1><p>…</p>", "text": "…", "preheader": "…" }
//     "send": false,                         // default: create drafts in Resend only
//     "scheduled_at": "2026-12-01T01:00:00Z", // with send: true, schedule instead of sending now
//     "test_to": ["me@example.com"] }        // instead: email each edition to these addresses, create nothing
//
// `html` is the issue's body: it is placed in the newsletter layout with the edition's footer and unsubscribe link.
// Set "layout": false to send a complete HTML document instead; it must contain {{{RESEND_UNSUBSCRIBE_URL}}}.
// Subscribers in ko, es, fr, de and pt-BR are in the English edition's segment.
import type { APIRoute } from 'astro';
import { bearerOk, json, normalizeEmail, readJson } from '../../../newsletter/api';
import { EDITIONS, type Edition } from '../../../newsletter/config';
import { UNSUBSCRIBE, broadcastEmail } from '../../../newsletter/email';
import { ResendError, broadcast, sendEmail } from '../../../newsletter/resend';

export const prerender = false;

interface Issue { subject: string; html: string; text?: string; preheader?: string }

const str = (v: unknown, max: number) => typeof v === 'string' && v.trim() !== '' && v.length <= max;

function issue(v: unknown): Issue | string {
  if (!v || typeof v !== 'object') return 'must be an object';
  const o = v as Record<string, unknown>;
  if (!str(o.subject, 300)) return 'subject: a non-empty string (≤ 300 characters)';
  if (!str(o.html, 500_000)) return 'html: a non-empty string';
  if (o.text !== undefined && typeof o.text !== 'string') return 'text: a string';
  if (o.preheader !== undefined && typeof o.preheader !== 'string') return 'preheader: a string';
  return o as unknown as Issue;
}

export const POST: APIRoute = async ({ request }) => {
  if (!(await bearerOk(request))) return json({ error: 'unauthorized' }, 401);
  const body = await readJson(request);
  if (!body) return json({ error: 'invalid', detail: 'a JSON object is required' }, 400);
  const editions = body.editions as Record<string, unknown> | undefined;
  if (!editions || typeof editions !== 'object') return json({ error: 'invalid', detail: 'editions: { zh?, en?, ja? }' }, 400);
  const unknown = Object.keys(editions).filter((k) => !EDITIONS.includes(k as Edition));
  if (unknown.length || !Object.keys(editions).length) return json({ error: 'invalid', detail: `editions: zh, en and/or ja (got ${Object.keys(editions).join(', ') || 'none'})` }, 400);
  const layout = body.layout !== false;
  const send = body.send === true;
  const scheduledAt = body.scheduled_at;
  if (scheduledAt !== undefined && (typeof scheduledAt !== 'string' || !send)) return json({ error: 'invalid', detail: 'scheduled_at: a string, with send: true' }, 400);
  if (body.name !== undefined && !str(body.name, 200)) return json({ error: 'invalid', detail: 'name: a string' }, 400);
  const testTo = body.test_to;
  if (testTo !== undefined && (!Array.isArray(testTo) || !testTo.length || testTo.length > 10 || testTo.some((a) => !normalizeEmail(a)))) {
    return json({ error: 'invalid', detail: 'test_to: 1–10 email addresses' }, 400);
  }

  const prepared: [Edition, { subject: string; html: string; text?: string }][] = [];
  for (const [e, v] of Object.entries(editions) as [Edition, unknown][]) {
    const i = issue(v);
    if (typeof i === 'string') return json({ error: 'invalid', detail: `editions.${e}.${i}` }, 400);
    if (!layout && !i.html.includes(UNSUBSCRIBE)) return json({ error: 'invalid', detail: `editions.${e}.html must contain ${UNSUBSCRIBE}` }, 400);
    const wrapped = layout ? broadcastEmail(e, i) : { html: i.html, text: i.text };
    prepared.push([e, { subject: i.subject, html: wrapped.html, text: wrapped.text }]);
  }

  // Editions done before a failure are reported with the error, so the caller does not create them twice.
  const done: Record<string, string> = {};
  try {
    if (testTo) {
      const sent = done;
      for (const [e, m] of prepared) {
        // Test emails have no subscriber behind them: the unsubscribe link points nowhere.
        const r = await sendEmail({ to: (testTo as string[]).map((a) => normalizeEmail(a)!), subject: `[TEST ${e}] ${m.subject}`,
          html: m.html.split(UNSUBSCRIBE).join('#'), text: m.text?.split(UNSUBSCRIBE).join('#') }, `test/${crypto.randomUUID()}`);
        sent[e] = r?.id ?? '';
      }
      return json({ ok: true, test: sent });
    }
    const created = done;
    for (const [e, m] of prepared) {
      const r = await broadcast(e, { name: body.name ? `${body.name} (${e})` : undefined, ...m, send, scheduledAt: scheduledAt as string | undefined });
      created[e] = r?.id ?? '';
    }
    return json({ ok: true, send, broadcasts: created });
  } catch (e) {
    console.error('newsletter broadcast', e);
    return json({ error: 'resend', detail: e instanceof ResendError ? `${e.status}: ${e.body.slice(0, 500)}` : String(e), [testTo ? 'test' : 'broadcasts']: done }, 502);
  }
};
