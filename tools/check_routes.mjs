import { readFileSync } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';

// Exercise the deployed server, rather than treating a local 404 file as proof
// that the hosting configuration uses it. No Cloudflare credentials are needed.
const target = process.argv[2];
if (!target || process.argv.length !== 3) {
  console.error('Usage: node tools/check_routes.mjs https://agentware.studio');
  process.exit(2);
}
const base = new URL(target);
if (!['https:', 'http:'].includes(base.protocol) || base.pathname !== '/' || base.search || base.hash || base.username || base.password) {
  throw new Error('Provide an HTTP(S) origin without a path, credentials, query or fragment');
}
const entries = JSON.parse(readFileSync(new URL('./entries.json', import.meta.url), 'utf8'));
const checks = [];
const assets = new Set();
const nonce = `__aw_missing_${randomUUID()}__`;
const fingerprint = (body) => createHash('sha256').update(body).digest('hex');

async function check(path, kind, visit = 'first') {
  const row = { path, kind, visit, pass: false };
  checks.push(row);
  try {
    const response = await fetch(new URL(path, base), {
      redirect: 'manual', signal: AbortSignal.timeout(15000),
      headers: { 'User-Agent': 'Agentware-Route-Check/1.0' },
    });
    const body = Buffer.from(await response.arrayBuffer());
    const text = body.toString('utf8');
    const type = response.headers.get('content-type') ?? '';
    Object.assign(row, {
      status: response.status, contentType: type, bytes: body.length, sha256: fingerprint(body),
      cacheControl: response.headers.get('cache-control'),
      cfCacheStatus: response.headers.get('cf-cache-status'), age: response.headers.get('age'),
    });
    const problems = [];
    const expect = (condition, message) => { if (!condition) problems.push(message); };
    if (kind === 'missing') {
      expect(response.status === 404, 'Missing path must return HTTP 404 without a redirect');
      expect(/data-page="notfound"/.test(text), 'Missing path must serve the existing 404 entry');
      expect(!/immutable|max-age\s*=\s*[1-9]\d*/i.test(row.cacheControl ?? ''), 'Missing response must not use long-lived browser caching');
    } else if (kind === 'llms') {
      expect(response.status === 200, 'llms.txt must return HTTP 200');
      expect(/^text\/plain\s*;\s*charset=utf-8$/i.test(type), 'llms.txt must declare UTF-8 for browser navigation');
      expect(text.startsWith('# Agentware Studio'), 'Wrong llms.txt content');
      expect(text.includes('https://agentware.studio/agentware.md'), 'llms.txt must link to agentware.md');
      expect(!text.includes('\uFFFD'), 'llms.txt contains invalid UTF-8 or replacement characters');
    } else if (kind === 'agentware') {
      expect(response.status === 200, 'agentware.md must return HTTP 200');
      expect(/^text\/markdown\s*;\s*charset=utf-8$/i.test(type), 'agentware.md must declare UTF-8 Markdown for browser navigation');
      expect(text.startsWith('# Agentware'), 'Wrong agentware.md content');
      expect(text.includes('## 05 // The Execution Loop') && text.includes('## 06 // The Four Pillars') && text.includes('## 07 // The Agentware Manifesto'), 'Missing expected agentware.md guide sections');
      expect(!text.includes('\uFFFD'), 'agentware.md contains invalid UTF-8 or replacement characters');
    } else if (kind === 'page') {
      expect(response.status === 200, 'Existing page must return HTTP 200');
      const page = path.includes('/learn/') ? 'learn' : 'home';
      expect(text.includes(`data-page="${page}"`), 'Wrong HTML entry');
      expect(type.includes('text/html'), 'Page must be HTML');
      // Check the URLs actually shipped by this deployment, including older builds.
      for (const [, href] of text.matchAll(/(?:src|href)="(\/(?:assets|fonts|brand)\/[^"?#]+)"/g)) assets.add(href);
    } else {
      expect(response.status === 200, 'Referenced asset must return HTTP 200');
      expect(body.length > 0 && !type.includes('text/html') && !/^\s*<!doctype html/i.test(text), 'Referenced asset returned HTML or an empty body');
    }
    row.problems = problems;
    row.pass = problems.length === 0;
  } catch (error) {
    row.problems = [error.message];
  }
}

async function batch(items, run) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
    while (next < items.length) await run(items[next++]);
  }));
}

const pages = entries.filter((file) => file !== '404.html').map((file) => `/${file.replace(/index\.html$/, '')}`);
await check('/llms.txt', 'llms');
await check('/agentware.md', 'agentware');
await batch(pages, (path) => check(path, 'page'));
await batch([...assets].sort(), (path) => check(path, 'asset'));
const missing = [
  '/.bashrc', `/${nonce}`, ...pages.filter((path) => !path.endsWith('/learn/')).map((path) => `${path}${nonce}/nested`),
  ...['js', 'css', 'woff2'].map((extension) => `/assets/${nonce}.${extension}`), `/fonts/${nonce}.woff2`,
];
// A unique path is not proof of a cold cache: retain actual cache headers for
// both requests and leave origin/cache diagnosis to the deployment comparison.
for (const visit of ['first', 'repeat']) await batch(missing, (path) => check(path, 'missing', visit));
const failed = checks.filter((row) => !row.pass).length;
console.log(JSON.stringify({ base: base.origin, checked: checks.length, failed, checks }, null, 2));
if (failed) process.exitCode = 1;
