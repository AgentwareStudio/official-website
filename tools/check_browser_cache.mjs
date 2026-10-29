import assert from 'node:assert/strict';
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { output, root, withFixture } from './astro_fixture.mjs';

// Inspect the built site (run `npm run build` first), then build a disposable copy twice to check that
// a changed font or image gets a new URL and so do the files that reference it.
// Inspect the built site (run `npm run build` first), then build a disposable copy twice to check that
// a changed font or image gets a new URL and so do the files that reference it.
function rulesOf(files) {
  const source = files.get('_headers');
  assert.ok(source, 'Missing Cloudflare Static Assets _headers');
  const rules = new Map();
  let path;
  for (const line of String(source).split('\n')) {
    assert.ok(line.length <= 2000, 'Static Assets header line length limit');
    if (!line || line.startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      assert.ok(!/[*?:]/.test(line), 'Cache rules must use exact local paths');
      assert.ok(!rules.has(line), 'Duplicate header path');
      path = line;
      rules.set(path, {});
    } else {
      const [, name, value] = line.match(/^\s+([^:]+): (.+)$/);
      assert.ok(!(name in rules.get(path)), `Duplicate ${name} header`);
      rules.get(path)[name] = value;
    }
  }
  assert.ok(rules.size <= 100);
  const contentTypes = new Map([
    ['/llms.txt', 'text/plain; charset=utf-8'],
    ['/agentware.md', 'text/markdown; charset=utf-8'],
  ]);
  for (const [path, type] of contentTypes) {
    assert.deepEqual(rules.get(path), { 'Content-Type': type });
  }
  for (const [path, headers] of rules) {
    if (contentTypes.has(path)) continue;
    const value = headers['Cache-Control'];
    assert.ok(value, `Expected Cache-Control header for ${path}`);
    if (value.includes('immutable')) {
      assert.match(path, /^\/assets\/.+[.-][A-Za-z0-9_-]{8,}\.(js|css|woff2|svg|png)$/);
      assert.ok(files.has(path.slice(1)), 'Immutable rule must name an existing build file');
    } else assert.equal(value, 'public, max-age=0, must-revalidate');
  }
  for (const file of [...files.keys()].filter((f) => f.startsWith('assets/'))) {
    assert.ok(rules.get(`/${file}`)?.['Cache-Control']?.includes('immutable'), `${file} must be cached as immutable`);
  }
  for (const file of [...files.keys()].filter((f) => f.endsWith('.html'))) {
    for (const path of [`/${file}`, `/${file.replace(/index\.html$|\.html$/, '')}`]) {
      assert.equal(rules.get(path)['Cache-Control'], 'public, max-age=0, must-revalidate');
    }
  }
  for (const path of ['/missing', '/zh/missing', '/assets/missing.js', '/assets/missing.css', '/assets/missing.woff2', '/fonts/inter.woff2', '/brand/agentware_lockup_on-dark.svg']) {
    assert.ok(!rules.has(path), `${path} must not inherit immutable`);
  }
  return rules;
}

const current = output(join(root, 'dist/client'));
const rules = rulesOf(current);
for (const kind of ['fonts', 'brand']) {
  for (const name of readdirSync(join(root, 'src/assets', kind))) {
    assert.ok(current.get(`${kind}/${name}`)?.equals(readFileSync(join(root, 'src/assets', kind, name))), `Legacy URL /${kind}/${name} missing or changed`);
  }
}

// A second deployment must change both asset URLs and their parent references.
// Build a disposable copy so the real build and source files remain untouched.
await withFixture(async (fixture) => {
  const oldOutput = await fixture.build();
  const font = readFileSync(join(fixture.dir, 'src/assets/fonts/inter.woff2'));
  const brandPath = join(fixture.dir, 'src/assets/brand/agentware_lockup_on-dark.svg');
  const brand = readFileSync(brandPath);
  const assetWith = (files, bytes) => [...files].find(([name, body]) => name.startsWith('assets/') && body.equals(bytes))[0];
  const oldFont = assetWith(oldOutput, font);
  const oldBrand = assetWith(oldOutput, brand);
  // Files that referenced the font and the image, to check that their own names change too.
  const parents = (name) => [...oldOutput].filter(([file, body]) => file.startsWith('assets/') && /\.(css|js)$/.test(file) && body.includes(Buffer.from(name))).map(([file]) => file);
  const oldParents = { font: parents(oldFont), brand: parents(oldBrand) };
  assert.ok(oldParents.font.some((f) => f.endsWith('.css')), 'The stylesheet must reference the font');
  assert.ok(oldParents.brand.some((f) => f.endsWith('.js')), 'A script must reference the header brand image');
  writeFileSync(join(fixture.dir, 'src/assets/fonts/inter.woff2'), readFileSync(join(fixture.dir, 'src/assets/fonts/aw-sans-sc.woff2')));
  writeFileSync(brandPath, String(brand).replace('</svg>', '<!-- cache version fixture --></svg>'));
  const next = await fixture.build();
  const nextRules = rulesOf(next);
  for (const name of [oldFont, oldBrand]) {
    assert.ok(!next.has(name), 'Old fingerprint retained unexpectedly');
    assert.ok(!nextRules.has(`/${name}`), 'An old/missing fingerprint must not get an immutable rule');
    for (const [file, body] of [...next].filter(([file]) => /\.(html|css|js)$/.test(file))) {
      assert.ok(!body.includes(Buffer.from(name)), `${file} still references old asset`);
    }
  }
  for (const file of [...oldParents.font, ...oldParents.brand]) assert.ok(!next.has(file), `Parent ${file} kept its name after its asset changed`);
  console.log(JSON.stringify({ rules: rules.size, immutableFiles: [...rules.values()].filter((headers) => headers['Cache-Control']?.includes('immutable')).length, llmsUtf8: true, agentwareUtf8: true, fontVersionChanged: true, brandVersionChanged: true, parentReferencesUpdated: true, legacyAliasesPreserved: true }));
});
