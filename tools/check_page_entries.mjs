import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { withFixture } from './astro_fixture.mjs';

// Build a disposable copy and inspect the actual module graph: each page loads only its own island, and the
// home-only modules never reach the learn or 404 pages (not even through a shared chunk).
const ISLAND = { home: 'HomeSite', learn: 'LearnSite', notfound: 'NotFoundSite' };
const homeOnly = [
  '/src/sections/Home.tsx', '/src/sections/Shift.tsx', '/src/components/ShiftStage.tsx',
  '/src/components/ExecutionLoop.tsx', '/src/components/Mark.tsx', '/src/pager.ts',
];

// Records which source modules end up in each browser chunk.
const modulesByChunk = new Map();
const collector = {
  name: 'collect-chunk-modules',
  generateBundle(_, bundle) {
    for (const file of Object.values(bundle)) {
      if (file.type === 'chunk' && file.fileName.startsWith('assets/')) modulesByChunk.set(file.fileName, Object.keys(file.modules));
    }
  },
};

await withFixture(async (fixture) => {
  const files = await fixture.build([collector]);
  /** Every chunk a page loads up front: its island and renderer, then their static imports. */
  const reachable = (html) => {
    const seen = new Set();
    const visit = (path) => {
      if (seen.has(path)) return;
      assert.ok(files.has(path), `Missing chunk: ${path}`);
      seen.add(path);
      // Static imports only: dynamic import() chunks (the 404 page's locale files) load on demand.
      for (const [, rel] of String(files.get(path)).matchAll(/(?:\bfrom|\bimport)\s*"\.\/([^"]+\.js)"/g)) visit(`assets/${rel}`);
    };
    for (const [, path] of html.matchAll(/\b(?:component-url|renderer-url|src)="\/(assets\/[^"]+\.js)"/g)) visit(path);
    return [...seen];
  };

  const pages = [];
  for (const [file, body] of [...files].filter(([f]) => f.endsWith('.html')).sort()) {
    const html = String(body);
    const page = html.match(/data-page="([^"]+)"/)?.[1];
    assert.ok(page in ISLAND, `${file}: unknown page`);
    const chunks = reachable(html);
    const islands = chunks.map((c) => c.match(/^assets\/(\w+Site)\./)?.[1]).filter((n) => n && n !== 'Site');
    assert.deepEqual(islands, [ISLAND[page]], `${file}: must load exactly its own island`);
    const modules = chunks.flatMap((c) => {
      assert.ok(modulesByChunk.has(c), `No module list for ${c}`);
      return modulesByChunk.get(c);
    });
    for (const module of homeOnly) {
      assert.equal(modules.some((id) => id.endsWith(module)), page === 'home', `${file}: ${module}`);
    }
    pages.push({
      file, page, chunks,
      bytes: chunks.reduce((sum, c) => sum + files.get(c).length, 0),
      gzipBytes: chunks.reduce((sum, c) => sum + gzipSync(files.get(c)).length, 0),
      sourceModules: [...new Set(modules.filter((id) => id.includes('/src/')).map((id) => id.slice(id.lastIndexOf('/src/') + 1)))],
    });
  }
  assert.equal(pages.length, 17, 'All 16 localized pages and the shared 404 must be checked');
  console.log(JSON.stringify({ pages }, null, 2));
});
