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
- Self-hosted fonts (Inter, JetBrains Mono, Instrument Serif, subsetted Noto Sans SC / JP / KR); no third-party requests

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

## Deploy on Cloudflare

The site is fully static and is deployed from GitHub with Cloudflare Pages.

1. In Cloudflare, create a Pages project and connect this repository.
2. Framework preset: `Vite` (or none).
3. Build command: `npm run build`.
4. Build output directory: `dist`.
5. Add the custom domain `agentware.studio`.

Missing paths are served `dist/404.html`, which picks its language from the URL.

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

`tools/fonts.py` subsets the CJK fonts to the characters each locale actually uses (`public/fonts/aw-sans-sc|jp|kr.woff2`), so re-run it whenever copy adds new Chinese, Japanese or Korean characters. It needs `fonttools` and `brotli`; the source fonts are `ofl/notosanssc`, `ofl/notosansjp` and `ofl/notosanskr` in the google/fonts repository. Latin locales use Inter and JetBrains Mono as they are.

Install the pinned font tooling into a Python virtual environment with `python3 -m pip install -r tools/requirements-fonts.txt`. The font command also generates small cross-language subsets in `src/fonts/` from the course names and language labels in `src/sections/Pages.tsx`. It retains the original metrics and available FreeType CJK hinting reference characters so that subsetting does not alter stroke alignment. To rebuild just these subsets from the committed WOFF2 fonts, run `python3 tools/fonts.py --shared-only`, then `python3 tools/check_fonts.py`. Commit the generated fonts and CSS with any label changes. Vite gives these assets content-hashed URLs for cache invalidation. Native-language text continues using the original full locale subset; cross-language course labels use the small subset with the original face as a fallback for new characters. Font weights and `font-display: swap` are retained.

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
| `public/brand/` | Official brand files |
| `public/fonts/` | Self-hosted, subsetted fonts |
| `tools/` | Copy, HTML entry and font generation scripts |

## License

No license file yet. The bundled fonts (Inter, JetBrains Mono, Instrument Serif, Noto Sans SC / JP / KR) are under the SIL Open Font License.
