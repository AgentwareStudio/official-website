import assert from 'node:assert/strict';
import { gzipSync } from 'node:zlib';
import { build } from 'vite';

// Inspect the actual Rollup module graph without rewriting the production build.
const result = await build({ build: { write: false }, logLevel: 'silent' });
const output = result.output;
const chunks = new Map(output.filter((file) => file.type === 'chunk').map((file) => [file.fileName, file]));
const homeOnly = [
  '/src/sections/Home.tsx', '/src/sections/Shift.tsx', '/src/components/ShiftStage.tsx',
  '/src/components/ExecutionLoop.tsx', '/src/components/Mark.tsx', '/src/pager.ts',
];
const pages = [];
for (const file of output.filter((file) => file.type === 'asset' && file.fileName.endsWith('.html'))) {
  const html = String(file.source);
  const page = html.match(/data-page="([^"]+)"/)[1];
  const scripts = [...html.matchAll(/<script\b[^>]*src="\/([^"]+\.js)"/g)].map((match) => match[1]);
  const visited = new Set();
  function visit(name) {
    if (visited.has(name)) return;
    assert.ok(chunks.has(name), `Missing chunk: ${name}`);
    visited.add(name);
    chunks.get(name).imports.forEach(visit);
  }
  scripts.forEach(visit);
  const modules = [...visited].flatMap((name) => Object.keys(chunks.get(name).modules));
  assert.ok(modules.some((id) => id.endsWith(`/src/entries/${page}.tsx`)), `${file.fileName}: wrong entry`);
  for (const module of homeOnly) {
    assert.equal(modules.some((id) => id.endsWith(module)), page === 'home', `${file.fileName}: ${module}`);
  }
  pages.push({
    file: file.fileName, page, scripts,
    bytes: [...visited].reduce((sum, name) => sum + Buffer.byteLength(chunks.get(name).code), 0),
    gzipBytes: [...visited].reduce((sum, name) => sum + gzipSync(chunks.get(name).code).length, 0),
    sourceModules: modules.filter((id) => id.includes('/src/')).map((id) => id.slice(id.lastIndexOf('/src/') + 1)),
  });
}
assert.equal(pages.length, 17, 'All 16 localized pages and the shared 404 must be checked');
console.log(JSON.stringify({ pages }, null, 2));
