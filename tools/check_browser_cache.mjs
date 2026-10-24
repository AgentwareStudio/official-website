import assert from 'node:assert/strict';
import { build } from 'vite';
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
function rulesOf(output) {
  const file = output.find((file) => file.fileName === '_headers');
  assert.ok(file, 'Missing Cloudflare Static Assets _headers');
  const rules = new Map();
  let path;
  for (const line of String(file.source).split('\n')) {
    assert.ok(line.length <= 2000, 'Static Assets header line length limit');
    if (!line || line.startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      assert.ok(!/[*?:]/.test(line), 'Cache rules must use exact local paths');
      assert.ok(!rules.has(line), 'Duplicate header path');
      path = line;
      rules.set(path, '');
    } else {
      assert.equal(rules.get(path), '', 'Duplicate Cache-Control header');
      rules.set(path, line.trim().replace(/^Cache-Control: /, ''));
    }
  }
  assert.ok(rules.size <= 100);
  for (const [path, value] of rules) {
    if (value.includes('immutable')) {
      assert.match(path, /^\/assets\/.+-[A-Za-z0-9_-]{8,}\.(js|css|woff2|svg|png)$/);
      assert.ok(output.some((file) => file.fileName === path.slice(1)), 'Immutable rule must name an existing build file');
    } else assert.equal(value, 'public, max-age=0, must-revalidate');
  }
  for (const file of output.filter((file) => file.fileName.endsWith('.html'))) {
    for (const path of [`/${file.fileName}`, `/${file.fileName.replace(/index\.html$|\.html$/, '')}`]) {
      assert.equal(rules.get(path), 'public, max-age=0, must-revalidate');
    }
  }
  for (const path of ['/missing', '/zh/missing', '/assets/missing.js', '/assets/missing.css', '/assets/missing.woff2', '/fonts/inter.woff2', '/brand/agentware_lockup_on-dark.svg']) {
    assert.ok(!rules.has(path), `${path} must not inherit immutable`);
  }
  return rules;
}
const emit = async (root) => (await build({ root, build: { write: false }, logLevel: 'silent' })).output;
const current = await emit(root);
const rules = rulesOf(current);
const body = (file) => Buffer.from(file.type === 'chunk' ? file.code : file.source);
for (const kind of ['fonts', 'brand']) {
  for (const file of current.filter((file) => file.fileName.startsWith(`${kind}/`))) {
    assert.ok(body(file).equals(readFileSync(join(root, 'src/assets', file.fileName))), 'Legacy URL bytes changed');
  }
}

// A second deployment must change both asset URLs and their parent references.
// Build a disposable copy so the real preview and source files remain untouched.
const fixture = mkdtempSync(join(tmpdir(), 'aw-cache-version-'));
try {
  const entries = JSON.parse(readFileSync(join(root, 'tools/entries.json'), 'utf8'));
  const paths = new Set(['src', 'public', 'tools', 'vite.config.ts', 'tsconfig.json', 'package.json', 'package-lock.json', ...entries.map((file) => file.split('/')[0])]);
  for (const path of paths) cpSync(join(root, path), join(fixture, path), { recursive: true });
  symlinkSync(join(root, 'node_modules'), join(fixture, 'node_modules'), 'junction');
  const oldOutput = await emit(fixture);
  const font = readFileSync(join(fixture, 'src/assets/fonts/inter.woff2'));
  const brandPath = join(fixture, 'src/assets/brand/agentware_lockup_on-dark.svg');
  const brand = readFileSync(brandPath);
  const oldFont = oldOutput.find((file) => file.fileName.startsWith('assets/') && file.type === 'asset' && body(file).equals(font)).fileName;
  const oldBrand = oldOutput.find((file) => file.fileName.startsWith('assets/') && file.type === 'asset' && body(file).equals(brand)).fileName;
  writeFileSync(join(fixture, 'src/assets/fonts/inter.woff2'), readFileSync(join(fixture, 'src/assets/fonts/aw-sans-sc.woff2')));
  writeFileSync(brandPath, String(brand).replace('</svg>', '<!-- cache version fixture --></svg>'));
  const next = await emit(fixture);
  const nextRules = rulesOf(next);
  for (const name of [oldFont, oldBrand]) {
    assert.ok(!next.some((file) => file.fileName === name), 'Old fingerprint retained unexpectedly');
    assert.ok(!nextRules.has(`/${name}`), 'An old/missing fingerprint must not get an immutable rule');
    for (const file of next.filter((file) => /\.(html|css|js)$/.test(file.fileName))) {
      assert.ok(!body(file).includes(Buffer.from(name)), `${file.fileName} still references old asset`);
    }
  }
  const css = (files) => files.find((file) => file.fileName.endsWith('.css')).fileName;
  assert.notEqual(css(oldOutput), css(next), 'Parent CSS hash must change after a font update');
  const main = (files) => files.find((file) => /^assets\/main-.*\.js$/.test(file.fileName)).fileName;
  assert.notEqual(main(oldOutput), main(next), 'Parent JS hash must change after a brand update');
  console.log(JSON.stringify({ rules: rules.size, immutableFiles: [...rules.values()].filter((value) => value.includes('immutable')).length, fontVersionChanged: true, brandVersionChanged: true, parentReferencesUpdated: true, legacyAliasesPreserved: true }));
} finally {
  rmSync(fixture, { recursive: true, force: true });
}
