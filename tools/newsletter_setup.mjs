#!/usr/bin/env node
// One-time Resend setup for the newsletter (README "Newsletter"): the contacts' `locale` property and one segment per
// edition. Safe to run again: existing ones are reused. Prints the NEWSLETTER_SEGMENTS value for wrangler.jsonc.
//
//   set -a; . ~/.config/agentware/resend.env; set +a     # RESEND_API_KEY=… (mode 600, never committed)
//   node tools/newsletter_setup.mjs              # segments newsletter-zh, -en, -ja (Workers Previews use none)
const key = process.env.RESEND_API_KEY;
if (!key) {
  console.error('RESEND_API_KEY is not set (see the comment at the top of this file).');
  process.exit(1);
}

async function call(method, path, body) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', 'User-Agent': 'agentware-newsletter-setup' },
    body: body && JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${text}`);
  return text ? JSON.parse(text) : {};
}
// Resend pauses between list pages; one page holds far more than we have.
const list = async (path) => (await call('GET', `${path}?limit=100`)).data ?? [];

const props = await list('/contact-properties');
if (props.some((p) => p.key === 'locale')) console.log('property locale: exists');
else {
  await call('POST', '/contact-properties', { key: 'locale', type: 'string', fallback_value: 'en' });
  console.log('property locale: created');
}

const existing = await list('/segments');
const ids = {};
for (const edition of ['zh', 'en', 'ja']) {
  const name = `newsletter-${edition}`;
  const found = existing.find((s) => s.name === name);
  ids[edition] = found ? found.id : (await call('POST', '/segments', { name })).id;
  console.log(`segment ${name}: ${found ? 'exists' : 'created'} (${ids[edition]})`);
}
console.log(`\nNEWSLETTER_SEGMENTS for vars in wrangler.jsonc:\n${JSON.stringify(JSON.stringify(ids))}`);
