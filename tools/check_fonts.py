#!/usr/bin/env python3
"""Check cross-language glyph coverage, metrics and variable outlines against the originals."""
import hashlib
import pathlib
import tempfile
from unittest.mock import patch

from fontTools.pens.recordingPen import DecomposingRecordingPen
from fontTools.ttLib import TTFont

import fonts

ROOT = pathlib.Path(__file__).resolve().parent.parent


def check():
    chars = {ord(c) for p in fonts.SHARED_SOURCES for c in (ROOT / p).read_text(encoding='utf-8')}
    chars |= {ord(c) for c in fonts.HINTING_REFERENCE}
    for suffix in ('sc', 'jp'):
        original = TTFont(ROOT / f'public/fonts/aw-sans-{suffix}.woff2')
        shared = TTFont(ROOT / f'src/fonts/aw-sans-{suffix}-shared.woff2')
        cmap, subset = original.getBestCmap(), shared.getBestCmap()
        assert subset.keys() == chars & cmap.keys(), f'{suffix}: stale shared glyph coverage'
        for table, fields in {
            'head': ['unitsPerEm', 'xMin', 'yMin', 'xMax', 'yMax'],
            'hhea': ['ascent', 'descent', 'lineGap', 'advanceWidthMax', 'minLeftSideBearing', 'minRightSideBearing', 'xMaxExtent'],
            'OS/2': ['sTypoAscender', 'sTypoDescender', 'sTypoLineGap', 'usWinAscent', 'usWinDescent', 'sxHeight', 'sCapHeight'],
        }.items():
            for field in fields:
                assert getattr(original[table], field) == getattr(shared[table], field), (suffix, table, field)
        axes = lambda font: [(a.axisTag, a.minValue, a.defaultValue, a.maxValue) for a in font['fvar'].axes]
        assert axes(original) == axes(shared), f'{suffix}: changed weight range'
        for weight in (300, 400, 500, 700):
            full_set = original.getGlyphSet(location={'wght': weight})
            small_set = shared.getGlyphSet(location={'wght': weight})
            for codepoint, name in subset.items():
                full, small = full_set[cmap[codepoint]], small_set[name]
                assert full.width == small.width, (suffix, weight, codepoint, 'width')
                a, b = DecomposingRecordingPen(full_set), DecomposingRecordingPen(small_set)
                full.draw(a); small.draw(b)
                assert a.value == b.value, (suffix, weight, codepoint, 'outline')
        print(f'{suffix}: coverage, metrics, weight range and every outline match')

    # Regenerate in isolation to catch stale assets and nondeterministic WOFF2 output.
    with tempfile.TemporaryDirectory() as tmp:
        root = pathlib.Path(tmp)
        (root / 'public').symlink_to(ROOT / 'public', target_is_directory=True)
        (root / 'src').mkdir()
        sources = [str(ROOT / p) for p in fonts.SHARED_SOURCES]
        with patch.object(fonts, 'ROOT', root), patch.object(fonts, 'SHARED_SOURCES', sources):
            fonts.shared_subsets()
        for path in (ROOT / 'src/fonts').iterdir():
            assert path.read_bytes() == (root / 'src/fonts' / path.name).read_bytes(), f'{path.name}: stale or non-reproducible'
        shared = root / 'src/fonts/aw-sans-sc-shared.woff2'
        old_hash = hashlib.sha256(shared.read_bytes()).digest()
        supported = TTFont(root / 'public/fonts/aw-sans-sc.woff2').getBestCmap()
        current = TTFont(shared).getBestCmap()
        new_codepoint = next(c for c in sorted(supported) if 0x4E00 <= c <= 0x9FFF and c not in current)
        label = root / 'new-label.tsx'
        label.write_text(chr(new_codepoint), encoding='utf-8')
        with patch.object(fonts, 'ROOT', root), patch.object(fonts, 'SHARED_SOURCES', sources + [str(label)]):
            fonts.shared_subsets()
        assert new_codepoint in TTFont(shared).getBestCmap()
        assert old_hash != hashlib.sha256(shared.read_bytes()).digest(), 'New glyph must invalidate content hash'
    print('All generated files reproduce byte-for-byte; new label glyphs change the font hash')


if __name__ == '__main__':
    check()
