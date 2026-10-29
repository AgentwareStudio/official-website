// Every site page is rendered to HTML at build time (copy included) and hydrated in the browser, then served as
// Workers Static Assets (wrangler.jsonc). Blog pages read Supabase and render in the Worker (`prerender = false`).
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import { siteFiles } from './tools/astro_site.mjs';

export default defineConfig({
  site: 'https://agentware.studio',
  output: 'static',
  // Prerender in Node as before (the pages share module state for the locale); no sessions or image service.
  adapter: cloudflare({ prerenderEnvironment: 'node', imageService: 'passthrough' }),
  session: false,
  // Pages live at directory URLs (build.format). The Worker must not redirect requests it has no route for, or a
  // missing path would answer 301 before 404: src/middleware.ts adds the slash for the blog routes only.
  trailingSlash: 'ignore',
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
