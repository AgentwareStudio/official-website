import { defineConfig, normalizePath, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Multi-page build: every page in every locale has its own HTML entry (written by tools/gen_html.py),
// so any static server (python -m http.server, nginx, GitHub Pages) can serve /ja/learn/ etc. directly.
const entries: string[] = JSON.parse(readFileSync(resolve(__dirname, 'tools/entries.json'), 'utf-8'));

function preloadLocale(): Plugin {
  return {
    name: 'preload-page-locale',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        const locale = html.match(/<body\b[^>]*\bdata-locale="([^"]+)"/)?.[1];
        // Chinese copy is in the main bundle. The shared 404 determines its locale at runtime.
        if (!locale || locale === 'zh-CN') return;
        const moduleId = normalizePath(resolve(__dirname, `src/i18n/locales/${locale}.json`));
        const chunk = Object.values(bundle ?? {}).find(
          (output) => output.type === 'chunk' && output.facadeModuleId === moduleId,
        );
        if (!chunk) throw new Error(`Missing locale chunk for ${locale}`);
        return [{
          tag: 'link',
          attrs: { rel: 'modulepreload', crossorigin: true, href: `/${chunk.fileName}` },
          // Keep the root's language redirect ahead of the preload hint.
          injectTo: 'head',
        }];
      },
    },
  };
}

export default defineConfig({
  plugins: [react(), preloadLocale()],
  build: {
    rollupOptions: {
      input: Object.fromEntries(entries.map((e) => [e.replace(/\/?index\.html$|\.html$/, '').replace(/\//g, '_') || 'home', resolve(__dirname, e)])),
    },
  },
});
