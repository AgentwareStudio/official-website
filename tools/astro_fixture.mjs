// Build a disposable copy of the site for checks, so the real dist/ and caches are never touched.
// Astro writes its server build next to the working directory and keeps caches under node_modules, so the build
// runs with the copy as working directory and with its caches inside the copy.
import { build } from 'astro';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

export const root = fileURLToPath(new URL('../', import.meta.url));
const INPUTS = ['src', 'public', 'tools', 'astro.config.mjs', 'tsconfig.json', 'package.json', 'wrangler.jsonc'];

/** Built files as a map of path (relative to the given directory, "/"-separated) to contents. */
export function output(dist) {
  const files = new Map();
  for (const f of readdirSync(dist, { recursive: true, withFileTypes: true }).filter((f) => f.isFile())) {
    const path = join(f.parentPath, f.name);
    files.set(relative(dist, path).split('\\').join('/'), readFileSync(path));
  }
  return files;
}

/**
 * Run `fn(fixture)` on a fresh copy of the site; `fixture.build(vitePlugins)` builds it and returns output().
 * The copy and the working directory are restored afterwards.
 */
export async function withFixture(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'aw-fixture-'));
  const cwd = process.cwd();
  try {
    for (const path of INPUTS) cpSync(join(root, path), join(dir, path), { recursive: true });
    symlinkSync(join(root, 'node_modules'), join(dir, 'node_modules'), 'junction');
    process.chdir(dir);
    const fixture = {
      dir,
      async build(plugins = []) {
        await build({
          root: dir,
          logLevel: 'silent',
          cacheDir: join(dir, '.cache/astro'),
          vite: { cacheDir: join(dir, '.cache/vite'), plugins },
        });
        // The static files (the Worker is in dist/server).
        return output(join(dir, 'dist/client'));
      },
    };
    return await fn(fixture);
  } finally {
    process.chdir(cwd);
    rmSync(dir, { recursive: true, force: true });
  }
}
