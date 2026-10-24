"""Write the HTML entry for every page in every locale (en at the root, others under /<path>/).

Each entry sets <html lang>, <body data-locale>, a localized title and description, hreflang
alternates and the font preloads that locale needs. Run after tools/build_locales.py.
"""
import json, pathlib, html

ROOT = pathlib.Path(__file__).resolve().parent.parent
SITE = 'https://agentware.studio'  # canonical origin used for hreflang alternates
LOCALES = [('en', ''), ('zh-CN', 'zh'), ('ja', 'ja'), ('ko', 'ko'), ('es', 'es'), ('fr', 'fr'), ('de', 'de'), ('pt-BR', 'pt-br')]
PAGES = [('home', ''), ('learn', 'learn/')]
FONT = {'zh-CN': 'aw-sans-sc', 'ja': 'aw-sans-jp', 'ko': 'aw-sans-kr'}

ZH = {
    'home': ('Agentware Studio — From Interface to Intent · 从操作界面，到委托意图',
             'Agentware 是为智能体时代而生的软件范式：你说明目标、划定边界、定义完成标准，系统在授权范围内组织行动，并交付可验证的结果。'),
    'learn': ('AI 体系化公开课 — Agentware Studio', 'We teach what we build. Agentware Studio 的 AI 体系化公开课。首门课程《AI 抽卡毕业课》分三季：原理篇、实战篇、搭建篇。'),
    'notfound': ('页面不存在 — Agentware Studio', '这个地址没有页面。'),
}

# Root home page only: on the first visit go to the browser's language (kept as aw-auto, so later visits to / land
# in the same place); a language picked in the menu or the hint (aw-lang) always wins.
# Crawlers and automation are left on the page so the English root stays indexable.
REDIRECT = '''    <script>(function(){try{
      var ua=navigator.userAgent||'';if(navigator.webdriver||/bot|crawl|spider|slurp|preview|lighthouse|headless/i.test(ua))return;
      var P={'en':'','zh-CN':'zh','ja':'ja','ko':'ko','es':'es','fr':'fr','de':'de','pt-BR':'pt-br'};
      var ls=window.localStorage,pick=ls.getItem('aw-lang'),seen=ls.getItem('aw-seen');ls.setItem('aw-seen','1');
      if(!pick&&seen)pick=ls.getItem('aw-auto');
      if(!pick){if(seen)return;var L=navigator.languages&&navigator.languages.length?navigator.languages:[navigator.language||''];
        pick='en';for(var i=0;i<L.length;i++){var t=String(L[i]).toLowerCase(),b=t.split('-')[0];
          if(b==='zh'){pick='zh-CN';break}if(b==='pt'){pick='pt-BR';break}if(/^(en|ja|ko|es|fr|de)$/.test(b)){pick=b;break}}ls.setItem('aw-auto',pick)}
      var path=P[pick];if(path)location.replace('/'+path+'/'+location.search+location.hash);
    }catch(e){}})();</script>
'''

TPL = '''<!doctype html>
<html lang="{lang}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#07080C" />
    <meta name="color-scheme" content="dark" />
    <title>{title}</title>
    <meta name="description" content="{desc}" />
{alts}    <link rel="icon" type="image/x-icon" sizes="32x32" href="/favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="/src/assets/brand/agentware_favicon_dark.svg" />
    <link rel="icon" type="image/png" sizes="32x32" href="/src/assets/brand/agentware_favicon_dark_32.png" />
    <link rel="apple-touch-icon" href="/src/assets/brand/agentware_icon_app_dark_180.png" />
    <link rel="preload" href="/src/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
{font}{redir}    <script>try{{document.documentElement.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reveal-pending')}}catch(e){{}}</script>
  </head>
  <body data-page="{page}"{dl}>
    <div id="root"></div>
    <script type="module" src="/src/entries/{page}.tsx"></script>
  </body>
</html>
'''


def short(s, n=158):
    s = ' '.join(s.split())
    return s if len(s) <= n else s[: n - 1].rsplit(' ', 1)[0].rstrip('，,、;；:：') + '…'


def main():
    meta = json.loads((ROOT / 'tools/meta.json').read_text('utf-8'))
    written = []
    for code, path in LOCALES:
        data = None if code == 'zh-CN' else json.loads((ROOT / f'src/i18n/locales/{code}.json').read_text('utf-8'))
        # the single 404 page is written in the root locale and takes its language from the path at runtime
        pages = PAGES + ([('notfound', None)] if not path else [])
        for page, sub in pages:
            if code == 'zh-CN':
                title, desc = ZH[page]
            else:
                m = meta[code]
                title = m['nf' if page == 'notfound' else page]
                desc = short({'home': data['hero']['intro'], 'learn': data['learn']['lead'], 'notfound': data['ui']['nf']['title']}[page])
            if sub is None:
                alts, out = '    <meta name="robots" content="noindex" />\n', ROOT / '404.html'
            else:
                alts = ''.join(f'    <link rel="alternate" hreflang="{c}" href="{SITE}/{p + "/" if p else ""}{sub}" />\n' for c, p in LOCALES)
                alts += f'    <link rel="alternate" hreflang="x-default" href="{SITE}/{sub}" />\n'
                out = ROOT / (f'{path}/' if path else '') / sub / 'index.html'
                alts = f'    <link rel="canonical" href="{SITE}/{path + "/" if path else ""}{sub}" />\n' + alts
            font = f'    <link rel="preload" href="/src/assets/fonts/{FONT[code]}.woff2" as="font" type="font/woff2" crossorigin />\n' if code in FONT else ''
            dl = '' if sub is None else f' data-locale="{code}"'
            out.parent.mkdir(parents=True, exist_ok=True)
            redir = REDIRECT if (not path and page == 'home') else ''
            out.write_text(TPL.format(lang=code, title=html.escape(title), desc=html.escape(desc), alts=alts, font=font, redir=redir, page=page, dl=dl), 'utf-8')
            written.append(out.relative_to(ROOT).as_posix())
    (ROOT / 'tools/entries.json').write_text(json.dumps(written, indent=1), 'utf-8')
    write_sitemap()
    print(len(written), 'entries')


def write_sitemap():
    """public/sitemap.xml: every page in every locale, each listing all its language versions; plus robots.txt."""
    url = lambda p, sub: f'{SITE}/{p + "/" if p else ""}{sub}'
    rows = []
    for _, sub in PAGES:
        alts = ''.join(f'    <xhtml:link rel="alternate" hreflang="{c}" href="{url(p, sub)}" />\n' for c, p in LOCALES)
        alts += f'    <xhtml:link rel="alternate" hreflang="x-default" href="{url("", sub)}" />\n'
        for _, p in LOCALES:
            rows.append(f'  <url>\n    <loc>{url(p, sub)}</loc>\n{alts}  </url>\n')
    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
           + ''.join(rows) + '</urlset>\n')
    (ROOT / 'public/sitemap.xml').write_text(xml, 'utf-8')
    (ROOT / 'public/robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\nLLMs-Txt: {SITE}/llms.txt\n', 'utf-8')
    print(len(rows), 'urls in sitemap')


if __name__ == '__main__':
    main()
