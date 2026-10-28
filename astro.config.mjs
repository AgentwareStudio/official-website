// Static build: every page in every locale is rendered to HTML (copy included) and hydrated in the browser.
// Deployed as Workers Static Assets (wrangler.jsonc), like the former Vite build.
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import { siteFiles } from './tools/astro_site.mjs';

export default defineConfig({
  site: 'https://agentware.studio',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Same /assets/ directory as before (Astro names files "<name>.<hash>.<ext>").
    assets: 'assets',
    // Home pages get the stylesheet inlined by tools/astro_site.mjs; other pages link it.
    inlineStylesheets: 'never',
    // The pages share module state for the current locale (src/i18n.ts): render them one at a time.
    concurrency: 1,
  },
  integrations: [react(), siteFiles()],
  vite: {
    build: {
      assetsInlineLimit: 0,
      // Same CSS minifier as the former Vite 6 build. Vite 8's default (lightningcss) rewrites colours such as
      // rgba(155, 163, 184, .13) as #9ba3b821, whose rounded alpha shifts how text and hairlines render.
      cssMinify: 'esbuild',
    },
  },
});
