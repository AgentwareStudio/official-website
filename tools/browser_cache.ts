import type { Plugin } from 'vite';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

/** Fingerprinted files are immutable; no wildcard may cache a missing-path HTML fallback. */
export function browserCache(): Plugin {
  let root: string;
  return {
    name: 'browser-cache-policy',
    apply: 'build',
    configResolved(config) { root = config.root; },
    buildStart() {
      // Preserve existing download URLs with the platform's revalidation defaults.
      for (const kind of ['fonts', 'brand']) {
        const dir = resolve(root, 'src/assets', kind);
        for (const name of readdirSync(dir)) {
          this.emitFile({ type: 'asset', fileName: `${kind}/${name}`, source: readFileSync(resolve(dir, name)) });
        }
      }
    },
    generateBundle: {
      order: 'post',
      handler(_, bundle) {
        const rules = new Map<string, Record<string, string>>();
        // Plain-text and Markdown navigations cannot use HTML's <meta charset> declaration.
        rules.set('/llms.txt', { 'Content-Type': 'text/plain; charset=utf-8' });
        rules.set('/agentware.md', { 'Content-Type': 'text/markdown; charset=utf-8' });
        for (const file of Object.values(bundle)) {
          if (file.fileName.startsWith('assets/')) {
            if (!/^assets\/.+-[A-Za-z0-9_-]{8,}\.(?:js|css|woff2|svg|png)$/.test(file.fileName)) {
              this.error(`Cannot cache an unversioned asset: ${file.fileName}`);
            }
            rules.set(`/${file.fileName}`, { 'Cache-Control': 'public, max-age=31536000, immutable' });
          } else if (file.fileName.endsWith('.html')) {
            rules.set(`/${file.fileName}`, { 'Cache-Control': 'public, max-age=0, must-revalidate' });
            rules.set(`/${file.fileName.replace(/index\.html$|\.html$/, '')}`, { 'Cache-Control': 'public, max-age=0, must-revalidate' });
          }
        }
        if (rules.size > 100) this.error('Cloudflare Static Assets supports at most 100 header rules');
        const source = '# Generated from existing build files; never replace with /assets/*.\n'
          + [...rules].sort(([a], [b]) => a.localeCompare(b))
            .map(([path, headers]) => `${path}\n${Object.entries(headers).map(([name, value]) => `  ${name}: ${value}\n`).join('')}`).join('\n');
        this.emitFile({ type: 'asset', fileName: '_headers', source });
      },
    },
  };
}
