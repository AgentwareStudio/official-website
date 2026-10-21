# Agentware Studio 官网 — final_demo_website

这是在三版方案基础上整合的最终版。以 gemini 版为基础，吸收了 astra 版的排版对齐和 opus 版的图形与交互。文案依据 `../04_官网文案定稿_Website_Copy.md`（v3.1，第一部分 01–07 和第二部分阶段 A）。

技术栈：Vite + React + TypeScript，没有其他运行时依赖。字体全部本地托管，不请求第三方。

## 本地预览

已构建好的静态站点在 `dist/`，任何静态服务器都能打开：

```powershell
python -m http.server 4810 --bind 127.0.0.1 --directory dist
```

然后打开 <http://127.0.0.1:4810/>。

## 开发与构建

```bash
npm install
npm run dev      # http://127.0.0.1:4810
npm run build    # 输出到 dist/
```

本站是多页面构建：`index.html`、`learn/index.html`、`blog/index.html`、`404.html` 各自对应一个入口。所以任何静态服务器都能直接打开 `/learn/` 和 `/blog/`，不需要 SPA 回退。

## 目录

| 路径 | 内容 |
|---|---|
| `src/content.ts` | 全部文案，改文案只改这里 |
| `src/sections/Home.tsx` | 首页各屏：主张、边界声明、架构、运行时闭环、四大支柱、宣言、Studio 与页脚 |
| `src/pager.ts` | 桌面端一屏一屏翻页（缓动曲线、惯性吸收、长屏内滚动） |
| `src/sections/Shift.tsx` | 02 范式转移：标题固定，左侧动画和右侧卡片随滚动切换 01 → 02 → 03 |
| `src/components/ShiftStage.tsx` | 范式转移的三段动画 |
| `src/components/ExecutionLoop.tsx` | 运行时闭环控制台，可以运行一次委托或模拟超出边界 |
| `src/components/Mark.tsx` | 标志动效：开场 Reveal、指针 Pivot、轻触 Working 位置 |
| `src/components/Chrome.tsx` | 导航、移动端菜单、页脚 |
| `src/sections/Pages.tsx` | `/learn`、`/blog`、404 |
| `src/styles.css` | 全部样式 |
| `public/fonts/` | Inter、JetBrains Mono、Instrument Serif 斜体（仅宣言标题）的拉丁子集；中文是按站内用字子集化的 Noto Sans SC（均为 OFL） |
| `public/brand/` | 直接复制的 VIS 正式文件 |
| `tools/fonts.py` | 改文案后重新子集化中文字体 |

## 修改文案后

如果新文案用到了新的汉字，需要重新生成中文字体子集（需要 `fonttools` 和 `brotli`）：

```bash
python3 tools/fonts.py <NotoSansSC[wght].ttf>
npm run build
```

中文字体源文件：google/fonts 仓库的 `ofl/notosanssc/NotoSansSC[wght].ttf`。

## Languages (i18n)

Eight locales: 简体中文 at `/`, and `/en/`, `/ja/`, `/ko/`, `/es/`, `/fr/`, `/de/`, `/pt-br/` (each with `learn/` and `blog/`).
The header has a language menu (desktop) and a language row in the mobile menu; each link opens the same page in that language.

- Copy source: `05_官网多语言文案定稿_Website_Copy_i18n.md` → `tools/parse_i18n.py` → `src/i18n/doc/<locale>.json`.
- Interface strings, the demo-animation captions, the execution-loop texts and the /learn, /blog scaffolding are not in that
  document; they live in `tools/i18n_ui.py` (translated for the site — review before publishing).
- `tools/build_locales.py` merges both into `src/i18n/locales/<locale>.json`, shaped like the objects in `src/content.ts`
  (zh-CN stays in `content.ts`). At boot `src/i18n.ts` reads `<body data-locale>`, loads that JSON and fills the objects.
- `tools/gen_html.py` writes every HTML entry (lang, title, description, hreflang alternates, font preloads) and
  `tools/entries.json`, which `vite.config.ts` uses as the build input list. The single `404.html` picks its language from the URL.
- Fonts: `tools/fonts.py` subsets Noto Sans SC / JP / KR per locale (`aw-sans-sc|jp|kr.woff2`); Latin locales use Inter and
  JetBrains Mono as they are. Per-language stacks and line breaking are at the end of `src/styles.css` (“i18n”).

After editing copy:

```
python3 tools/parse_i18n.py <path/to/05_官网多语言文案定稿_Website_Copy_i18n.md>   # only if the doc changed
python3 tools/build_locales.py && python3 tools/gen_html.py && python3 tools/fonts.py
npm run build
```
