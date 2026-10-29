import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Inspect the built pages (run `npm run build` first): home pages carry the full cascade inline,
// the other pages link the shared, cacheable stylesheet, and only blog pages add the blog stylesheet.
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const exists = (path) => readdirSync(join(dist, 'assets')).includes(path.replace(/^\/?assets\//, ''));
let homes = 0;
let otherPages = 0;
let blogPages = 0;
const shared = new Set();
for (const file of readdirSync(dist, { recursive: true }).filter((f) => f.endsWith('.html'))) {
  const html = readFileSync(join(dist, file), 'utf8');
  const head = html.slice(0, html.indexOf('</head>'));
  const styles = [...html.matchAll(/<style data-home-styles="([^"]+)">([\s\S]*?)<\/style>/g)];
  const brandPreloads = [...html.matchAll(/<link\b[^>]*rel="preload"[^>]*href="(\/assets\/agentware_lockup_on-dark[.-][^"]+)"[^>]*>/g)];
  if (html.includes('data-page="home"')) {
    homes++;
    assert.equal(styles.length, 1, `${file}: missing inline cascade`);
    assert.ok(!html.includes('rel="stylesheet"'), `${file}: render-blocking stylesheet remains`);
    assert.equal(styles[0][2], readFileSync(join(dist, styles[0][1]), 'utf8'), 'Inline and shared CSS must stay identical');
    for (const [, url] of styles[0][2].matchAll(/url\(\s*["']?(\/assets\/[^)'"\s]+)/g)) {
      assert.ok(exists(url), `Broken inline CSS asset URL: ${url}`);
    }
    assert.equal(brandPreloads.length, 1);
    assert.ok(exists(brandPreloads[0][1]));
    assert.ok(brandPreloads[0][0].includes('fetchpriority="low"'), 'Brand must not compete with LCP fonts at high priority');
    assert.ok(head.includes(brandPreloads[0][0]), 'Brand preload belongs in <head>');
    const redirect = head.indexOf('if(navigator.webdriver');
    if (redirect !== -1) assert.ok(redirect < head.indexOf(brandPreloads[0][0]), 'Keep the locale redirect ahead of added preloads');
  } else {
    const blog = /data-page="(?:blog|post)"/.test(html);
    if (blog) blogPages++; else otherPages++;
    assert.equal(styles.length, 0);
    assert.equal(brandPreloads.length, 0);
    const sheets = [...head.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(sheets.length, blog ? 2 : 1, `${file}: learn and 404 link the shared stylesheet; blog pages add their own`);
    shared.add(sheets[0]);
  }
}
assert.equal(homes, 8);
assert.equal(otherPages, 9);
assert.ok(blogPages >= 3, 'Every blog language has an index page');
assert.equal(shared.size, 1, 'All pages share one site stylesheet');
console.log(JSON.stringify({ homes, otherPages, blogPages, fullCascadeIdentical: true, inlineAssetURLsValid: true }));
