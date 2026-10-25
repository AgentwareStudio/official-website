import assert from 'node:assert/strict';
import { build } from 'vite';

const { output } = await build({ build: { write: false }, logLevel: 'silent' });
const files = new Map(output.map((file) => [file.fileName, file]));
let homes = 0;
let otherPages = 0;
for (const file of output.filter((file) => file.fileName.endsWith('.html'))) {
  const html = String(file.source);
  const styles = [...html.matchAll(/<style data-home-styles="([^"]+)">([\s\S]*?)<\/style>/g)];
  const brandPreloads = [...html.matchAll(/<link\b[^>]*rel="preload"[^>]*href="(\/assets\/agentware_lockup_on-dark-[^"]+)"[^>]*>/g)];
  if (html.includes('data-page="home"')) {
    homes++;
    assert.equal(styles.length, 1, `${file.fileName}: missing inline cascade`);
    assert.ok(!html.includes('rel="stylesheet"'), `${file.fileName}: render-blocking stylesheet remains`);
    assert.equal(styles[0][2], String(files.get(styles[0][1]).source), 'Inline and shared CSS must stay identical');
    for (const [, url] of styles[0][2].matchAll(/url\(\s*["']?(\/assets\/[^)'"\s]+)/g)) {
      assert.ok(files.has(url.slice(1)), `Broken inline CSS asset URL: ${url}`);
    }
    assert.equal(brandPreloads.length, 1);
    assert.ok(files.has(brandPreloads[0][1].slice(1)));
    assert.ok(brandPreloads[0][0].includes('fetchpriority="low"'), 'Brand must not compete with LCP fonts at high priority');
    assert.ok(html.indexOf(brandPreloads[0][0]) < html.indexOf('<script type="module"'));
    const redirect = html.indexOf('if(navigator.webdriver');
    if (redirect !== -1) assert.ok(redirect < html.indexOf(brandPreloads[0][0]), 'Keep the locale redirect ahead of added preloads');
  } else {
    otherPages++;
    assert.equal(styles.length, 0);
    assert.equal(brandPreloads.length, 0);
    assert.ok(html.includes('rel="stylesheet"'), 'Learn and 404 keep the cacheable stylesheet');
  }
}
assert.equal(homes, 8);
assert.equal(otherPages, 9);
console.log(JSON.stringify({ homes, otherPages, fullCascadeIdentical: true, inlineAssetURLsValid: true }));
