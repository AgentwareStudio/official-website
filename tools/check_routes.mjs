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
const checks = [];
const assets = new Set();
const nonce = `__aw_missing_${randomUUID()}__`;
/** A page's Markdown version (src/markdown.ts). */
const markdownPath = (path) => `${path.replace(/\/?$/, '/')}index.md`;
const fingerprint = (body) => createHash('sha256').update(body).digest('hex');

async function check(path, kind, visit = 'first') {
  const row = { path, kind, visit, pass: false };
  checks.push(row);
  try {
    // Pages and missing paths are requested as a browser opens them: Static Assets treats navigations differently
    // (an unmatched navigation gets the 404 page unless the path goes to the Worker first).
    const navigate = kind === 'page' || kind === 'missing';
    const response = await fetch(new URL(path, base), {
      redirect: 'manual', signal: AbortSignal.timeout(15000),
      headers: {
        'User-Agent': 'Agentware-Route-Check/1.0',
        ...(navigate && { Accept: 'text/html,application/xhtml+xml', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Dest': 'document' }),
      },
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
      // A missing Markdown version is an empty 404 from the Worker (or the static 404 page outside the blog).
      if (!path.endsWith('.md')) expect(/data-page="notfound"/.test(text), 'Missing path must serve the existing 404 entry');
      expect(!/immutable|max-age\s*=\s*[1-9]\d*/i.test(row.cacheControl ?? ''), 'Missing response must not use long-lived browser caching');
    } else if (kind === 'llms') {
      expect(response.status === 200, 'llms.txt must return HTTP 200');
      expect(/^text\/plain\s*;\s*charset=utf-8$/i.test(type), 'llms.txt must declare UTF-8 for browser navigation');
      expect(text.startsWith('# Agentware Studio'), 'Wrong llms.txt content');
      expect(text.includes('https://agentware.studio/agentware.md'), 'llms.txt must link to agentware.md');
      expect(text.includes('https://agentware.studio/index.md') && text.includes('https://agentware.studio/blog/index.md'), 'llms.txt must link the pages\' Markdown versions');
      expect(!text.includes('\uFFFD'), 'llms.txt contains invalid UTF-8 or replacement characters');
    } else if (kind === 'llms-full') {
      expect(response.status === 200, 'llms-full.txt must return HTTP 200');
      expect(/^text\/plain\s*;\s*charset=utf-8$/i.test(type), 'llms-full.txt must declare UTF-8');
      expect(text.startsWith('# Agentware\n') && text.includes('## The Agentware Manifesto'), 'llms-full.txt must start with the Agentware guide');
    } else if (kind === 'markdown') {
      expect(response.status === 200, 'Markdown version must return HTTP 200');
      expect(/^text\/markdown\s*;\s*charset=utf-8$/i.test(type), 'Markdown version must declare UTF-8 Markdown');
      expect(text.startsWith('# ') && !/^\s*<!doctype html/i.test(text), 'Markdown version must be Markdown');
      expect(!text.includes('\uFFFD'), 'Markdown contains invalid UTF-8 or replacement characters');
    } else if (kind === 'agentware') {
      expect(response.status === 200, 'agentware.md must return HTTP 200');
      expect(/^text\/markdown\s*;\s*charset=utf-8$/i.test(type), 'agentware.md must declare UTF-8 Markdown for browser navigation');
      expect(text.startsWith('# Agentware'), 'Wrong agentware.md content');
      expect(text.includes('## Deterministic Core, Agentic Control Plane') && text.includes('## The Four Pillars') && text.includes('## The Agentware Manifesto') && text.includes('## Open AI Engineering Curriculum'), 'Missing expected agentware.md guide sections');
      expect(!text.includes('\uFFFD'), 'agentware.md contains invalid UTF-8 or replacement characters');
    } else if (kind === 'page') {
      expect(response.status === 200, 'Existing page must return HTTP 200');
      const page = path.includes('/learn/') ? 'learn' : /\/blog\/$/.test(path) ? 'blog' : path.includes('/blog/') ? 'post' : 'home';
      expect(text.includes(`data-page="${page}"`), 'Wrong HTML entry');
      expect(type.includes('text/html'), 'Page must be HTML');
      expect(text.includes(`<link rel="alternate" type="text/markdown" href="https://agentware.studio${markdownPath(path)}">`), 'Page must link its Markdown version');
      expect(/<script type="application\/ld\+json">\{"@context":"https:\/\/schema.org"/.test(text) && (page !== 'post' || text.includes('"@type":"BlogPosting"')), 'Page must carry its structured data');
      // Check the URLs actually shipped by this deployment, including older builds.
      // Island scripts are referenced by component-url / renderer-url rather than src.
      for (const [, href] of text.matchAll(/(?:src|href|component-url|renderer-url)="(\/(?:assets|fonts|brand)\/[^"?#]+)"/g)) assets.add(href);
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

// The pages are the ones the deployed sitemap lists: exactly the 16 localized pages, plus the blog
// (an index for each blog language and the posts, which change with publishing).
const LOCALE_PATHS = ['', 'zh/', 'ja/', 'ko/', 'es/', 'fr/', 'de/', 'pt-br/'];
const expected = LOCALE_PATHS.flatMap((l) => [`/${l}`, `/${l}learn/`]).sort();
const sitemapResponse = await fetch(new URL('/sitemap.xml', base), { redirect: 'manual', signal: AbortSignal.timeout(15000) });
if (sitemapResponse.status !== 200 || !/xml/.test(sitemapResponse.headers.get('content-type') ?? '')) {
  throw new Error(`/sitemap.xml must return XML with HTTP 200 (got ${sitemapResponse.status} ${sitemapResponse.headers.get('content-type')})`);
}
const locs = [...(await sitemapResponse.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => new URL(loc));
if (locs.some((u) => u.origin !== 'https://agentware.studio')) throw new Error('Sitemap URLs must use the canonical origin');
const pages = locs.map((u) => u.pathname).sort();
const isBlog = (p) => /^\/(?:zh\/|ja\/)?blog\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)?$/.test(p);
const site = pages.filter((p) => !isBlog(p));
if (JSON.stringify(site) !== JSON.stringify(expected)) throw new Error(`Sitemap pages differ from the 16 localized pages: ${site.join(' ')}`);
for (const index of ['/blog/', '/zh/blog/', '/ja/blog/']) if (!pages.includes(index)) throw new Error(`Sitemap is missing ${index}`);
if (new Set(pages).size !== pages.length) throw new Error('Duplicate sitemap URLs');
await check('/llms.txt', 'llms');
await check('/llms-full.txt', 'llms-full');
await check('/agentware.md', 'agentware');
await batch(pages, (path) => check(path, 'page'));
await batch(pages.map(markdownPath), (path) => check(path, 'markdown'));
await batch([...assets].sort(), (path) => check(path, 'asset'));
const missing = [
  '/.bashrc', `/${nonce}`, ...pages.filter((path) => !path.endsWith('/learn/')).map((path) => `${path}${nonce}/nested`),
  ...['js', 'css', 'woff2'].map((extension) => `/assets/${nonce}.${extension}`), `/fonts/${nonce}.woff2`,
  // Under the blog font slices' immutable wildcard: the 404 must still revalidate.
  `/fonts/cjk/sc-000.${nonce}.woff2`,
  `/${nonce}/index.md`, `/blog/${nonce}/index.md`, `/zh/blog/${nonce}/index.md`, '/es/blog/index.md',
];
// A unique path is not proof of a cold cache: retain actual cache headers for
// both requests and leave origin/cache diagnosis to the deployment comparison.
for (const visit of ['first', 'repeat']) await batch(missing, (path) => check(path, 'missing', visit));
const failed = checks.filter((row) => !row.pass).length;
console.log(JSON.stringify({ base: base.origin, checked: checks.length, failed, checks }, null, 2));
if (failed) process.exitCode = 1;
