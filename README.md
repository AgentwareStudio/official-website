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

- React 18 + TypeScript
- Vite 6 (multi-page build)
- Plain CSS, no UI or animation libraries
- Self-hosted fonts (Inter, subsetted Noto Sans SC / JP / KR) and local system monospace/italic serif stacks; no third-party requests

## Local Development

```bash
npm install
npm run dev
```

The app runs on `http://127.0.0.1:4810`.

## Build

```bash
npm run build
npm run preview
```

The build is multi-page: every page in every language has its own HTML entry (`index.html`, `learn/index.html`, `zh/index.html`, …, plus a single `404.html`), so any static server can serve `/ja/learn/` directly without an SPA fallback.

Home, learn and 404 also have separate static JavaScript entries in `src/entries/`, sharing React, the site chrome and locale loading through `src/main.tsx`. Course and 404 pages do not load the home page demos or pager. Run `node tools/check_page_entries.mjs` to check the built dependency graphs without rewriting `dist`.

## Deploy on Cloudflare

The site is fully static and is deployed as the Cloudflare Worker **`agentware-official`**, using Workers Static Assets and the custom domain `agentware.studio`.

The root `wrangler.jsonc` serves `dist` with `html_handling: auto-trailing-slash` and `not_found_handling: 404-page`. Missing files use the nearest `404.html` with HTTP 404; the existing 404 entry determines its language from the requested URL. The site's pages have their own HTML entries, so missing paths must not use `single-page-application`, which would serve the homepage with HTTP 200. Static assets are served directly, without an application Worker script.

For Workers Builds, use `npm run build` as the build command and `npx wrangler deploy` as the deploy command, with this repository as the project root. The Worker name is `agentware-official`. Keep the existing custom domain associated with that Worker; the config leaves domain/route management in the dashboard and disables `workers.dev`. Before production deployment, compare the current dashboard configuration with this file, including any existing Worker script, bindings and routes. The local configuration does not prove which settings are currently deployed.

To test locally with Wrangler and Node.js 22 or later:

```bash
npm run build
npx wrangler@4.152.0 dev --local
# In another terminal, use the origin printed by Wrangler:
node tools/check_routes.mjs http://localhost:8787
```

Run `node tools/check_routes.mjs https://agentware.studio` after deploying. The check covers all language pages, their referenced assets, and missing pages/JS/CSS/fonts on first and repeated requests. It verifies status codes and the existing 404 entry, records cache headers and body fingerprints, and exits unsuccessfully on a regression. Random URLs and `CF-Cache-Status` do not by themselves prove a cache bypass. Keep production issues open until the deployed configuration and responses have been verified.

## Languages

Eight locales: English at `/`, Simplified Chinese at `/zh/`, and `/ja/`, `/ko/`, `/es/`, `/fr/`, `/de/`, `/pt-br/`, each with `learn/`.  
On a first visit, the root page redirects to the browser's language; a language picked in the menu is remembered. Crawlers stay on the English root.

- Simplified Chinese is the source language and lives in `src/content.ts`.
- Other locales are generated into `src/i18n/locales/<locale>.json`, shaped like the objects in `src/content.ts`. At boot, `src/i18n.ts` reads `<body data-locale>`, loads that JSON and fills the objects.
- Translated copy comes from the multilingual copy document in the Agentware repository (`04_Agentware_Studio/05_*_Website_Copy_i18n.md`), parsed by `tools/parse_i18n.py` into `src/i18n/doc/<locale>.json`.
- Interface strings, demo captions, the execution-loop texts and the `/learn` scaffolding are not in that document; they live in `tools/i18n_ui.py`.
- `tools/build_locales.py` merges both into the locale JSON files.
- `tools/gen_html.py` writes every HTML entry (lang, title, description, canonical and hreflang links, font preloads), `public/sitemap.xml`, `public/robots.txt`, and `tools/entries.json`, which `vite.config.ts` uses as the build input list.

## Editing Copy

```bash
python3 tools/parse_i18n.py <path/to/the/i18n/copy/document.md>   # only if the document changed
python3 tools/build_locales.py
python3 tools/gen_html.py
python3 tools/fonts.py --sc <NotoSansSC[wght].ttf> --jp <NotoSansJP[wght].ttf> --kr <NotoSansKR[wght].ttf>
npm run build
```

`tools/fonts.py` subsets the CJK fonts to the characters each locale actually uses (`src/assets/fonts/aw-sans-sc|jp|kr.woff2`), so re-run it whenever copy adds new Chinese, Japanese or Korean characters. It needs `fonttools` and `brotli`; the source fonts are `ofl/notosanssc`, `ofl/notosansjp` and `ofl/notosanskr` in the google/fonts repository. Latin locales use Inter; code and small labels use a local system monospace stack.

Install the pinned font tooling into a Python virtual environment with `python3 -m pip install -r tools/requirements-fonts.txt`. The font command also generates small cross-language subsets in `src/fonts/` from the course names and language labels in `src/sections/Pages.tsx`. It retains the original metrics and available FreeType CJK hinting reference characters so that subsetting does not alter stroke alignment. To rebuild just these subsets from the committed WOFF2 fonts, run `python3 tools/fonts.py --shared-only`, then `python3 tools/check_fonts.py`. Commit the generated fonts and CSS with any label changes. Vite gives these assets content-hashed URLs for cache invalidation. Native-language text continues using the original full locale subset; cross-language course labels use the small subset with the original face as a fallback for new characters. Font weights and `font-display: swap` are retained.

Code, small labels and diagram annotations use `ui-monospace`, SFMono-Regular, Menlo, Monaco, Consolas and Liberation Mono, with the locale's existing CJK font as a fallback where configured. The manifesto's italic word and numbers use Georgia, Times New Roman and `serif`. These system stacks replace JetBrains Mono and Instrument Serif; those font files, including the unused regular Instrument Serif, are no longer bundled. The system italic is horizontally condensed to approach the original display proportions; monospace cap height is normalized slightly taller with `font-size-adjust`, while sans-serif text retains its original sizing. Their appearance depends on the fonts installed on the visitor's device.

## Homepage Style Delivery

`tools/home_styles.ts` embeds the final minified CSS into each of the eight homepage HTML entries. It uses the complete existing cascade so menus, responsive layouts, scrolling and animation states remain styled from the first render. Learn and 404 pages continue sharing the external, fingerprinted stylesheet. The CSS file is still emitted for those pages; homepage visits do not fetch it separately.

This removes the homepage stylesheet request but increases each homepage HTML response by roughly 14 KiB compressed. A first navigation from home to learn may need to download the shared stylesheet because home no longer warms that cache. Compare first visits, revisits and language changes when evaluating the tradeoff. HTML still revalidates, and changing CSS or fonts updates the embedded styles automatically. Run `node tools/check_home_styles.mjs` to check cascade identity, asset URLs and page scope.

Inter, native-language fonts and the current locale chunk retain their existing preload behavior. The header brand image also receives a low-priority preload using its actual fingerprinted URL; it is reused by the header rather than downloaded twice. The animated hero mark remains inline SVG.

## Browser Caching on Workers Static Assets

Vite fingerprints JavaScript, CSS, fonts and imported brand images. `tools/browser_cache.ts` generates `dist/_headers` with one-year immutable caching for the exact asset URLs in that build. HTML uses `max-age=0, must-revalidate`. There is no `/assets/*` wildcard, so unknown and obsolete asset URLs do not inherit a long cache lifetime. The build fails if it exceeds Static Assets' 100-rule limit.

The generated headers also declare `Content-Type: text/plain; charset=utf-8` for `/llms.txt`. This file contains Unicode punctuation and symbols; without an HTTP charset, direct browser navigation can decode it as Windows-1252 and display garbled text. Keep the UTF-8 source characters and verify the response header after deploying.

Edit fonts and brand images in `src/assets/`; the build also copies their original bytes to the legacy `/fonts/` and `/brand/` URLs for existing links. Those unversioned copies retain the platform's default revalidation policy. Font preloads, CSS and image imports all point to the fingerprinted URLs used by the current build.

Run `node tools/check_browser_cache.mjs` to check the generated policies, legacy copies and cache invalidation after font or brand changes. For response-header and browser-cache checks, serve `dist` using `wrangler dev --local` with the root config; generic static preview servers do not interpret Cloudflare's `_headers` file. Production cache behavior must also be verified after deploying to Workers Static Assets.

## Project Structure

| Path | Contents |
|---|---|
| `src/content.ts` | All copy (Simplified Chinese) and external links |
| `src/sections/Home.tsx` | Home page screens |
| `src/sections/Shift.tsx` | Paradigm shift section: pinned title, animation and cards that switch on scroll |
| `src/sections/Pages.tsx` | `/learn` and 404 |
| `src/components/Chrome.tsx` | Header, language menu, mobile menu, footer |
| `src/components/ShiftStage.tsx` | Paradigm shift animations |
| `src/components/ExecutionLoop.tsx` | Execution-loop console: run a delegation or simulate going out of bounds |
| `src/components/Mark.tsx` | Logo mark animation |
| `src/pager.ts` | Screen-by-screen paging on desktop |
| `src/i18n.ts` | Locale detection, paths and loading |
| `src/styles.css` | All styles; per-language font stacks and line breaking are at the end |
| `src/assets/brand/` | Official brand files |
| `src/assets/fonts/` | Self-hosted, subsetted fonts |
| `tools/` | Copy, HTML entry and font generation scripts |

## License

No license file yet. The bundled fonts (Inter, Noto Sans SC / JP / KR) are under the SIL Open Font License.
