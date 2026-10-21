#!/usr/bin/env python3
"""Parse 05_官网多语言文案定稿_Website_Copy_i18n.md into per-locale JSON (Part 1 + Stage A).

Usage: python3 tools/parse_i18n.py <i18n.md>  -> src/i18n/doc/<locale>.json
"""
import json, re, sys, pathlib

SRC = pathlib.Path(sys.argv[1]).read_text(encoding='utf-8')
OUT = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'i18n' / 'doc'
OUT.mkdir(parents=True, exist_ok=True)

LOCALES = ['en', 'ja', 'es', 'de', 'fr', 'pt-BR', 'ko']

def strip_md(s):
    s = re.sub(r'\*\*\[([^\]]+)\]\([^)]+\)\*\*', r'\1', s)
    s = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', s)
    s = s.replace('**', '').replace('`', '')
    s = re.sub(r'(?<!\w)\*([^*]+)\*(?!\w)', r'\1', s)
    return s.strip()

def blocks(text):
    """Split into paragraphs (blank-line separated), keeping list items."""
    return [b.strip() for b in re.split(r'\n\s*\n', text) if b.strip() and b.strip() != '---']

def bolds(b):
    return [m.strip() for m in re.findall(r'^\*\*(.+?)\*\*\s*$', b, re.M)]

def section(body, start_pat, end_pat):
    m = re.search(start_pat, body, re.M)
    if not m: raise SystemExit(f'missing {start_pat}')
    rest = body[m.end():]
    rest = rest.split('\n', 1)[1] if '\n' in rest else ''
    e = re.search(end_pat, rest, re.M)
    return rest[: e.start()] if e else rest

def question(line):
    line = line.strip()
    m = re.match(r'^(.*?)[\s]*\*(.+)\*\s*$', line)
    if m:
        pre, q = m.group(1).strip(), m.group(2).strip()
    else:  # 「…」 style
        m = re.match(r'^(.*?)(「.+」)\s*$', line)
        pre, q = m.group(1).strip(), m.group(2).strip()
    q = q.strip('"“”「」 ')
    return {'pre': pre, 'q': q}

def parse(code, body):
    d = {}
    # ---------- 01 hero ----------
    h = section(body, r'^### 01 ', r'^### 02 ')
    bl = blocks(h)
    b0 = bolds(bl[0])
    d['heroTitle'] = b0[1] if len(b0) > 1 else ''
    tag_lines = bl[1].split('\n')
    d['heroTag'] = strip_md(tag_lines[1]) if len(tag_lines) > 1 else 'Software that acts on intent.'
    ql = bl[2].split('\n')
    d['questions'] = [question(ql[0]), question(ql[1])]
    d['definition'] = strip_md(bl[3])
    # ---------- 02 shift ----------
    s = section(body, r'^### 02 ', r'^### 03 ')
    bl = blocks(s)
    d['shiftTitle'] = strip_md(bl[0])
    intro, eras, closing = [], [], ''
    for b in bl[1:]:
        if b.startswith('- **'):
            items = re.split(r'\n(?=- \*\*)', b)
            for it in items:
                lines = it.split('\n')
                head = strip_md(lines[0][2:])
                m = re.match(r'^(\d\.\d)\s+(.+?)\s*·\s*(Software as \w+)\s*(?:[（(](.+?)[）)])?\s*$', head)
                ver, era, en, loc = m.group(1), m.group(2), m.group(3), m.group(4) or ''
                rest = lines[1].strip()
                mm = re.match(r'^\*\*(Humans \w+)\.\*\*\s*(.+)$', rest)
                eras.append({'ver': ver, 'era': era, 'en': en, 'local': loc, 'motto': mm.group(1), 'body': strip_md(mm.group(2))})
        elif not eras:
            intro.append(strip_md(b))
        else:
            closing = strip_md(b)
    d['shiftIntro'], d['eras'], d['shiftClosing'] = intro, eras, closing
    # ---------- 03 not ----------
    n = section(body, r'^### 03 ', r'^### 04 ')
    bl = blocks(n)
    d['notTitle'] = strip_md(bl[0]); d['notLead'] = strip_md(bl[1])
    items = re.split(r'\n(?=- \*\*)', bl[2])
    d['notItems'] = []
    for it in items:
        lines = it.split('\n')
        name = strip_md(lines[0][2:]).replace(' ≠ Agentware', '')
        d['notItems'].append({'name': name, 'body': strip_md(' '.join(l.strip() for l in lines[1:]))})
    # ---------- 04 architecture + loop ----------
    a = section(body, r'^### 04 ', r'^### 05 ')
    arch, loop = re.split(r'^#### ', a, maxsplit=1, flags=re.M)
    bl = blocks(arch)
    b0 = bolds(bl[0])
    d['archSub'] = b0[1] if len(b0) > 1 else ''
    d['archBody'] = strip_md(bl[1])
    rows = [r for r in bl[2].split('\n') if r.startswith('|')]
    cells = lambda r: [c.strip() for c in r.strip('|').split('|')]
    head = cells(rows[0])
    d['tableHead'] = [strip_md(x) for x in head]
    trs = []
    for r in rows[2:]:
        c = [strip_md(x) for x in cells(r)]
        trs.append(c)
    d['tableRows'] = trs
    bl = blocks(loop.split('\n', 1)[1])
    d['loopTitle'] = strip_md(bl[0])
    flow = strip_md(bl[1].lstrip('> '))
    d['loopFlow'] = [x.strip() for x in flow.split('→')]
    d['loopPrinciple'] = strip_md(bl[2])
    # ---------- 05 pillars ----------
    p = section(body, r'^### 05 ', r'^### 06 ')
    parts = re.split(r'^#### ', p, flags=re.M)
    d['pillarsLead'] = strip_md(blocks(parts[0])[0])
    d['pillars'] = []
    for part in parts[1:]:
        lines = part.strip().split('\n')
        title = re.sub(r'^\d\.\s*', '', lines[0]).strip()
        m = re.match(r'^(.*?)\s*\(([^)]+)\)\s*$', title)
        local, en = (m.group(1), m.group(2)) if m else (title, title)
        lead = strip_md(lines[1])
        body_lines = [l for l in lines[2:] if l.strip() and l.strip() != '---']
        bodyp = [strip_md(l) for l in body_lines if not l.startswith('- ')]
        pts = []
        for l in body_lines:
            if l.startswith('- '):
                mm = re.match(r'^- \*\*(.+?)\*\*\s*[:：]\s*(.+)$', l)
                pts.append([mm.group(1).strip(), strip_md(mm.group(2))])
        d['pillars'].append({'en': en, 'local': local if local != en else '', 'lead': lead, 'body': ' '.join(bodyp), 'points': pts})
    # ---------- 07 manifesto ----------
    mf = section(body, r'^### 07 ', r'^---\s*$\n+^## ')
    bl = blocks(mf)
    d['manifestoIntro'] = strip_md(bl[1])
    items = []
    for b in bl[2:]:
        lines = b.split('\n')
        m = re.match(r'^\*\*(I|II|III|IV|V|VI)\.\s*(.+?)\*\*$', lines[0].strip())
        if not m: continue
        local = ''
        rest = lines[1:]
        if rest and rest[0].startswith('**'):
            local = strip_md(rest[0]); rest = rest[1:]
        items.append({'n': m.group(1), 'en': m.group(2).strip(), 'local': local, 'body': strip_md(' '.join(rest))})
    d['manifesto'] = items
    # ---------- Stage A: 08 ----------
    stA = section(body, r'^#### 08 ', r'^#### 09 ')
    parts = re.split(r'^##### ', stA, flags=re.M)
    head = blocks(parts[0])
    hb = bolds(head[0])
    d['studioTitleEn'] = hb[0]
    d['studioTitle'] = hb[1] if len(hb) > 1 else hb[0]
    d['studioIntro'] = strip_md(head[1])
    st = []
    for part in parts[1:]:
        lines = [l for l in part.strip().split('\n') if l.strip() and l.strip() != '---']
        t = re.sub(r'^\d\.\s*', '', lines[0]).strip()
        m = re.match(r'^(.*?)\s*\(([^)]+)\)\s*$', t)
        title = m.group(1).strip() if m else t
        motto = ''
        paras, seasons = [], []
        for l in lines[1:]:
            if re.match(r'^\*[^*].*\*$', l.strip()):
                motto = l.strip().strip('*')
            elif l.startswith('- '):
                mm = re.match(r'^- \*\*(.+?)\*\*\s*[:：]\s*(.+)$', l)
                seasons.append([mm.group(1).strip(), strip_md(mm.group(2))])
            else:
                paras.append(strip_md(l))
        st.append({'title': title, 'motto': motto, 'body': ' '.join(paras), 'seasons': seasons})
    d['studioItems'] = st
    return d

# split by top-level language headings
chunks = re.split(r'^# \d\. .*\(`([^`]+)`\)\s*$', SRC, flags=re.M)
found = {}
for i in range(1, len(chunks), 2):
    found[chunks[i]] = chunks[i + 1]
for code in LOCALES:
    data = parse(code, found[code])
    (OUT / f'{code}.json').write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding='utf-8')
    print(code, 'ok', len(data['eras']), len(data['notItems']), len(data['tableRows']), len(data['loopFlow']), len(data['pillars']), len(data['manifesto']), len(data['studioItems']))
