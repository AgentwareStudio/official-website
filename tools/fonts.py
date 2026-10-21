#!/usr/bin/env python3
"""Subset the CJK fonts (variable, OFL) to the characters each locale actually uses.

Usage:  python3 tools/fonts.py
Sources (google/fonts, OFL):
  ofl/notosanssc/NotoSansSC[wght].ttf  -> public/fonts/aw-sans-sc.woff2  (zh-CN copy: src/**/*.ts(x) + zh HTML)
  ofl/notosansjp/NotoSansJP[wght].ttf  -> public/fonts/aw-sans-jp.woff2  (src/i18n/locales/ja.json + ja HTML)
  ofl/notosanskr/NotoSansKR[wght].ttf  -> public/fonts/aw-sans-kr.woff2  (src/i18n/locales/ko.json + ko HTML)
Paths default to ../fontlab/; pass --sc/--jp/--kr to override. Re-run after changing copy.
Latin locales use Inter / JetBrains Mono as they are (Latin-1 coverage is enough for en/es/de/fr/pt).
"""
import argparse, pathlib
from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = pathlib.Path(__file__).resolve().parent.parent
LAB = ROOT.parent / 'fontlab'
PUNCT = set('“”‘’—–…→←↑↓↗≠·•›✓　，。、；：？！（）《》「」『』〜・')


def read(paths):
    s = set()
    for p in paths:
        if p.exists():
            s |= set(p.read_text(encoding='utf-8'))
    return s


def make(src, chars, out):
    cjk = {c for c in chars | PUNCT if ord(c) > 0x2000}
    font = TTFont(src)
    o = subset.Options()
    o.layout_features = ['*']; o.name_IDs = ['*']; o.notdef_outline = True; o.hinting = False
    s = subset.Subsetter(o); s.populate(unicodes=[ord(c) for c in cjk]); s.subset(font)
    font = instancer.instantiateVariableFont(font, {'wght': (300, 700)})
    font.flavor = 'woff2'
    dst = ROOT / 'public' / 'fonts' / out
    font.save(dst)
    print(f'{out}: {len(cjk)} chars, {dst.stat().st_size // 1024} KB')


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--sc', default=str(LAB / 'NotoSansSC-VF.ttf'))
    ap.add_argument('--jp', default=str(LAB / 'dl' / 'NotoSansJP-VF.ttf'))
    ap.add_argument('--kr', default=str(LAB / 'dl' / 'NotoSansKR-VF.ttf'))
    a = ap.parse_args()
    zh_html = [*ROOT.glob('zh/**/index.html')]
    zh = read([*ROOT.glob('src/**/*.ts'), *ROOT.glob('src/**/*.tsx'), *zh_html])
    ja = read([ROOT / 'src/i18n/locales/ja.json', *ROOT.glob('ja/**/index.html'), ROOT / 'src/i18n.ts'])
    ko = read([ROOT / 'src/i18n/locales/ko.json', *ROOT.glob('ko/**/index.html'), ROOT / 'src/i18n.ts'])
    make(a.sc, zh, 'aw-sans-sc.woff2')
    make(a.jp, ja, 'aw-sans-jp.woff2')
    make(a.kr, {c for c in ko if not ('一' <= c <= '鿿')} | set('한국어'), 'aw-sans-kr.woff2')
