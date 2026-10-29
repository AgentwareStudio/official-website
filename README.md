# Agentware Studio

Official website source for **Agentware Studio**: defining Agentware as a class of software for the agentic era, from operating interfaces to delegating intent.

Website: https://agentware.studio *(pending deployment)*  
Courses: https://learn.agentware.studio *(pending deployment)*  
GitHub Org: https://github.com/AgentwareStudio

## About

Agentware is software you entrust with a goal: within authorized bounds it organizes actions, executes tasks, and delivers verifiable outcomes.  
Core framing on this site:

- Intent & Delegation
- Planning & Execution
- Governance & Guardrails
- Evolving Memory

The home page walks through the paradigm shift (tool era → copilot era → delegation era), what Agentware is not, the architecture, a runnable execution-loop demo, the four pillars, the manifesto, and Agentware Studio itself.

`/learn` introduces the open curriculum and its first course, *Graduating from AI Gacha*, and links to the course site at learn.agentware.studio. Episode lists live on the course site, not here.

The blog and AIKit are separate projects: this site has no blog page and does not link to aikit.pro yet.

## Tech Stack

- Astro 7 rendering React 18 + TypeScript components: site pages prerendered, the blog rendered in a Cloudflare Worker (`@astrojs/cloudflare`)
- Supabase Postgres for blog posts, read through Cloudflare Hyperdrive (`pg`)
- Plain CSS, no UI or animation libraries
- Self-hosted fonts (Inter, subsetted Noto Sans SC / JP / KR) and local system monospace/italic serif stacks; no third-party requests

## Local Development

```bash
npm install
npm run dev
```

The app runs on `http://127.0.0.1:4810`. Node.js 22.23.4 or later is required (`.node-version` pins 24). The blog pages need the local Supabase (`supabase start`, see Blog Database): `wrangler.jsonc` points the `HYPERDRIVE` binding at it with the local-only `blog_reader` password from `supabase/seed.sql`.

## Build

```bash
npm run build
npm run preview
```

The build writes the static files to `dist/client` and the Worker to `dist/server` (with its generated `wrangler.json`; `.wrangler/deploy/config.json` points Wrangler at it).

Every site page in every language is rendered to its own HTML file at build time (`index.html`, `learn/index.html`, `zh/index.html`, …, plus a single `404.html`), with the full copy in the HTML, so crawlers that do not run JavaScript read the whole page and any static server can serve `/ja/learn/` directly.

- `src/pages/` declares the routes: English at the root, the other locales under `[locale]/`, and `404.astro`. The blog routes (`blog/`, `[locale]/blog/` for `zh` and `ja`: index, posts, `rss.xml`) and `sitemap.xml.ts` set `prerender = false` and render in the Worker, so a published post appears without a build.
- `src/layouts/Page.astro` writes the `<head>` (title and description from `src/meta.ts`, canonical and hreflang links, icons, font preloads, the root language redirect) and renders the page body.
- The body is one React island per page type (`src/site/HomeSite.tsx`, `LearnSite.tsx`): rendered at build time and hydrated in the browser with the same locale messages, passed as island props. The 404 page (`NotFoundSite.tsx`) renders in the browser only and takes its language from the URL.
- One build renders every locale in turn: `setLocale()` in `src/i18n.ts` switches the shared copy, and `astro.config.mjs` keeps `build.concurrency` at 1. Read the locale at render time, never once per module.

Course and 404 pages do not load the home page demos or pager. Run `node tools/check_page_entries.mjs` to check: it builds a disposable copy and inspects the module graph of every page.

## Deploy on Cloudflare

The site is deployed as the Cloudflare Worker **`agentware-official`**, using Workers Static Assets and the custom domain `agentware.studio`. Site pages are static assets; the blog and the sitemap are rendered by the Worker.

The root `wrangler.jsonc` serves `dist/client` with `html_handling: auto-trailing-slash` and `not_found_handling: 404-page`. Missing files use the nearest `404.html` with HTTP 404; the existing 404 entry determines its language from the requested URL. The site's pages have their own HTML entries, so missing paths must not use `single-page-application`, which would serve the homepage with HTTP 200. Static assets are served directly. `run_worker_first` sends the blog paths and `/sitemap.xml` to the Worker: otherwise a browser navigation that matches no file gets the 404 page without the Worker running. The Worker answers unknown blog URLs with the same 404 page, and adds the trailing slash to blog page URLs only (`trailingSlash: 'ignore'` in `astro.config.mjs`, so a missing path never redirects before its 404).

Blog responses are kept in the data center cache for five minutes (Cache API, `src/middleware.ts`; the key ignores the query string) and revalidate in browsers like the static HTML. The publish script purges the URLs it changes.

The Worker needs the `HYPERDRIVE` binding, a Hyperdrive configuration connecting to Supabase as `blog_reader` through the Session pooler: `agentware-blog-prod` (Supabase `agentware-prod`) for production, and `agentware-blog-staging` (Supabase `agentware-staging`) in the `previews` block for Workers Previews, which do not inherit bindings. `nodejs_compat` is required by `pg`.

For Workers Builds, use `npm run build` as the build command and `npx wrangler deploy` as the deploy command, with this repository as the project root. The Worker name is `agentware-official`. Keep the existing custom domain associated with that Worker; the config leaves domain/route management in the dashboard and disables `workers.dev` for the Worker itself; `preview_urls` keeps workers.dev URLs (public, noindex) for Workers Previews and version previews. Before production deployment, compare the current dashboard configuration with this file, including any existing Worker script, bindings and routes. The local configuration does not prove which settings are currently deployed.

To test locally with Wrangler and Node.js 22.23.4 or later:

```bash
supabase start   # the blog's database
npm run build
npx wrangler dev --local
# In another terminal, use the origin printed by Wrangler:
node tools/check_routes.mjs http://localhost:8787
```

Run `node tools/check_routes.mjs https://agentware.studio` after deploying. The check takes the pages from the deployed `/sitemap.xml` (exactly the 16 localized pages, plus the three blog indexes and the published posts) and requests them as a browser navigation. It covers all of those pages, their referenced assets, and missing pages/JS/CSS/fonts on first and repeated requests. It verifies status codes and the existing 404 entry, records cache headers and body fingerprints, and exits unsuccessfully on a regression. Random URLs and `CF-Cache-Status` do not by themselves prove a cache bypass. Keep production issues open until the deployed configuration and responses have been verified.

## Languages

Eight locales: English at `/`, Simplified Chinese at `/zh/`, and `/ja/`, `/ko/`, `/es/`, `/fr/`, `/de/`, `/pt-br/`, each with `learn/`.  
On a first visit, the root page redirects to the browser's language; a language picked in the menu is remembered. Crawlers stay on the English root.

- Simplified Chinese is the source language and lives in `src/content.ts`.
- Other locales are generated into `src/i18n/locales/<locale>.json`, shaped like the objects in `src/content.ts`. Each page applies its locale with `setLocale()` in `src/i18n.ts`, which resets the objects to the Chinese source and copies the locale's fields over them.
- Translated copy comes from the multilingual copy document in the Agentware repository (`04_Agentware_Studio/05_*_Website_Copy_i18n.md`), parsed by `tools/parse_i18n.py` into `src/i18n/doc/<locale>.json`.
- Interface strings, demo captions, the execution-loop texts and the `/learn` scaffolding are not in that document; they live in `tools/i18n_ui.py`.
- `tools/build_locales.py` merges both into the locale JSON files.
- Page titles come from `tools/meta.json` (Chinese titles and descriptions are in `src/meta.ts`); other descriptions are the page's lead copy, shortened.
- `public/robots.txt` is maintained by hand (it carries the `Content-Signal` declaration).

## Editing Copy

```bash
python3 tools/parse_i18n.py <path/to/the/i18n/copy/document.md>   # only if the document changed
python3 tools/build_locales.py
python3 tools/fonts.py --sc <NotoSansSC[wght].ttf> --jp <NotoSansJP[wght].ttf> --kr <NotoSansKR[wght].ttf>
npm run build
```

`tools/fonts.py` subsets the CJK fonts to the characters each locale actually uses (`src/assets/fonts/aw-sans-sc|jp|kr.woff2`), so re-run it whenever copy adds new Chinese, Japanese or Korean characters. It needs `fonttools` and `brotli`; the source fonts are `ofl/notosanssc`, `ofl/notosansjp` and `ofl/notosanskr` in the google/fonts repository. Latin locales use Inter; code and small labels use a local system monospace stack.

Install the pinned font tooling into a Python virtual environment with `python3 -m pip install -r tools/requirements-fonts.txt`. The font command also generates small cross-language subsets in `src/fonts/` from the course names and language labels in `src/sections/Pages.tsx`. It retains the original metrics and available FreeType CJK hinting reference characters so that subsetting does not alter stroke alignment. To rebuild just these subsets from the committed WOFF2 fonts, run `python3 tools/fonts.py --shared-only`, then `python3 tools/check_fonts.py`. Commit the generated fonts and CSS with any label changes. The build gives these assets content-hashed URLs for cache invalidation. Native-language text continues using the original full locale subset; cross-language course labels use the small subset with the original face as a fallback for new characters. Font weights and `font-display: swap` are retained.

Code, small labels and diagram annotations use `ui-monospace`, SFMono-Regular, Menlo, Monaco, Consolas and Liberation Mono, with the locale's existing CJK font as a fallback where configured. The manifesto's italic word and numbers use Georgia, Times New Roman and `serif`. These system stacks replace JetBrains Mono and Instrument Serif; those font files, including the unused regular Instrument Serif, are no longer bundled. The system italic is horizontally condensed to approach the original display proportions; monospace cap height is normalized slightly taller with `font-size-adjust`, while sans-serif text retains its original sizing. Their appearance depends on the fonts installed on the visitor's device.

## Homepage Style Delivery

`tools/astro_site.mjs` (an Astro integration that runs after the build) embeds the final minified CSS into each of the eight homepage HTML files. It uses the complete existing cascade so menus, responsive layouts, scrolling and animation states remain styled from the first render. Learn and 404 pages continue sharing the external, fingerprinted stylesheet. The CSS file is still emitted for those pages; homepage visits do not fetch it separately.

This removes the homepage stylesheet request but increases each homepage HTML response by roughly 14 KiB compressed. A first navigation from home to learn may need to download the shared stylesheet because home no longer warms that cache. Compare first visits, revisits and language changes when evaluating the tradeoff. HTML still revalidates, and changing CSS or fonts updates the embedded styles automatically. Run `node tools/check_home_styles.mjs` to check cascade identity, asset URLs and page scope.

Inter and native-language fonts retain their existing preload behavior; the locale's messages are part of the page HTML, so there is no locale chunk to preload. The header brand image also receives a low-priority preload using its actual fingerprinted URL; it is reused by the header rather than downloaded twice. The animated hero mark remains inline SVG.

## Browser Caching on Workers Static Assets

The build fingerprints JavaScript, CSS, fonts and imported brand images (`assets/<name>.<hash>.<ext>`). `tools/astro_site.mjs` generates `dist/client/_headers` (replacing the `/assets/*` rule the Cloudflare adapter writes) with one-year immutable caching for the exact asset URLs in that build. HTML uses `max-age=0, must-revalidate`. There is no `/assets/*` wildcard: Static Assets applies a wildcard rule to the 404 response of a missing path too, so unknown and obsolete asset URLs would inherit a long cache lifetime. The build fails if it exceeds Static Assets' 100-rule limit.

The generated headers also declare `Content-Type: text/plain; charset=utf-8` for `/llms.txt` (the concise [llmstxt.org](https://llmstxt.org/) index) and `Content-Type: text/markdown; charset=utf-8` for `/agentware.md` (the standalone Markdown guide). Both files contain Unicode punctuation and symbols; without an HTTP charset, direct browser navigation can decode them as Windows-1252 and display garbled text. Keep the UTF-8 source characters and verify the response headers after deploying.

Edit fonts and brand images in `src/assets/`; the build also copies their original bytes to the legacy `/fonts/` and `/brand/` URLs for existing links. Those unversioned copies retain the platform's default revalidation policy. Font preloads, CSS and image imports all point to the fingerprinted URLs used by the current build.

CSS is minified with esbuild (`astro.config.mjs`): Vite 8's default minifier rewrites colours such as `rgba(155, 163, 184, .13)` as `#9ba3b821`, and the rounded alpha visibly changes text rendering.

After `npm run build`, run `node tools/check_browser_cache.mjs` to check the generated policies, legacy copies and cache invalidation after font or brand changes (it builds a disposable copy twice). For response-header and browser-cache checks, serve the build using `wrangler dev --local` with the root config; generic static preview servers do not interpret Cloudflare's `_headers` file. Production cache behavior must also be verified after deploying to Workers Static Assets.

## Blog Database

Blog posts live in Supabase (Postgres), schema `blog`; publishing writes a row, so no article or draft is ever committed here. The schema is defined by migrations in `supabase/migrations/`.

- `blog.posts` holds every language version (`zh`, `en`, `ja`) of every post, drafts and scheduled posts included.
- `blog.published_posts` is the only thing the site reads: posts with `status = 'published'` whose `publish_at` has passed.
- `blog_reader` (the site, through Hyperdrive) can read that view and nothing else, not even the table; `blog_writer` (the publish script) writes the table. Row level security is enabled on the table as a second line of defence. The `blog` schema is not exposed through the Supabase Data API.
- The migration creates both roles without `LOGIN`. Give each environment its own passwords, never in Git: `alter role blog_reader with login password '…';` and the same for `blog_writer`.

Locally (Docker required):

```bash
supabase start          # Postgres on 127.0.0.1:54322, Studio on 127.0.0.1:54323
supabase db reset       # apply the migrations and supabase/seed.sql (local test posts and local-only passwords)
supabase test db        # supabase/tests/: who can read and write what
```

## Project Structure

| Path | Contents |
|---|---|
| `src/pages/` | Routes: home and learn per locale, 404, sitemap, blog |
| `src/blog/` | Blog pages, styles, strings, RSS, and the Supabase source (`source.ts`, `routes.ts`) |
| `src/middleware.ts` | Edge caching and trailing slashes for Worker-rendered pages |
| `src/layouts/Page.astro` | `<head>` and the page island |
| `src/site/` | Page islands (`HomeSite`, `LearnSite`, `NotFoundSite`, `BlogSite`) and the shared shell |
| `src/meta.ts` | Page titles and descriptions, canonical origin, hreflang order |
| `src/content.ts` | All copy (Simplified Chinese) and external links |
| `src/sections/Home.tsx` | Home page screens |
| `src/sections/Shift.tsx` | Paradigm shift section: pinned title, animation and cards that switch on scroll |
| `src/sections/Pages.tsx` | `/learn` and 404 |
| `src/components/Chrome.tsx` | Header, language menu, mobile menu, footer |
| `src/components/ShiftStage.tsx` | Paradigm shift animations |
| `src/components/ExecutionLoop.tsx` | Execution-loop console: run a delegation or simulate going out of bounds |
| `src/components/Mark.tsx` | Logo mark animation |
| `src/pager.ts` | Screen-by-screen paging on desktop |
| `src/i18n.ts` | Locales, `setLocale()`, paths, and loading for the browser-only 404 page |
| `src/styles.css` | All styles; per-language font stacks and line breaking are at the end |
| `src/assets/brand/` | Official brand files |
| `src/assets/fonts/` | Self-hosted, subsetted fonts |
| `tools/` | Copy and font generation, the post-build integration (`astro_site.mjs`) and the `check_*` scripts |

## License

No license file yet. The bundled fonts (Inter, Noto Sans SC / JP / KR) are under the SIL Open Font License.
