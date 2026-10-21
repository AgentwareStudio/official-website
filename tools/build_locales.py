"""Build src/i18n/locales/<locale>.json from the parsed copy doc (src/i18n/doc) and tools/i18n_ui.py.

The JSON mirrors the shape of the exported objects in src/content.ts, so the app can
overwrite them field by field at boot. Field `zh` in content.ts means "local language".
Run:  python3 tools/build_locales.py
"""
import json, re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'tools'))
from i18n_ui import UI  # noqa: E402

LOCALES = ['en', 'ja', 'es', 'de', 'fr', 'pt-BR', 'ko']
CJK = {'ja', 'ko'}

END = re.compile(r'[\s。．.！!]+$')


def nop(s: str) -> str:
    """Strip a trailing full stop (headings carry no periods)."""
    return END.sub('', s.strip())


def sentences(s: str):
    parts = re.split(r'(?<=[。．])\s*|(?<=[.!?])\s+', s.strip())
    return [nop(p) for p in parts if p.strip()]


def clause_break(s: str, loc: str):
    """Split a one-sentence heading into phrases joined by '|', for CJK only."""
    if loc not in CJK:
        return s
    return re.sub(r'([、，,])\s*', r'\1|', s) if loc == 'ja' else re.sub(r',\s*', ', |', s)


def split_closing(s: str):
    s = s.strip()
    for sep in ['——', '—', ' – ', '。', '；', ';', ', ', '，']:
        i = s.rfind(sep) if sep in (', ', '，') else s.find(sep)
        if 0 < i < len(s) - len(sep) - 2:
            a, b = s[: i + len(sep)].rstrip(), s[i + len(sep):].strip()
            if sep == '。':
                a = a  # keep the stop on the first line
            return [a, b]
    return [s]


def split_principle(s: str):
    for sep in ['；', ';', '。']:
        if sep in s:
            i = s.index(sep) + len(sep)
            return [s[:i] + ('' if sep == '。' else ' ' if sep == ';' else ''), s[i:].strip()]
    m = re.search(r'\.\s', s)
    if m:
        return [s[: m.end()], s[m.end():]]
    return ['', s]


def mlocal(s: str, loc: str):
    if loc in CJK:
        return re.sub(r'[。．]\s*', '　', s)
    def low(m):
        w = m.group(1)
        if loc == 'de' and w not in ('Sie', 'Es', 'Er', 'Das', 'Die', 'Der'):
            return '; ' + w
        return ('\u00a0; ' if loc == 'fr' else '; ') + w[0].lower() + w[1:]
    return re.sub(r'\.\s+(\w+)', low, s)


def paren(s: str):
    """'Local (English)' -> (local, english); 'English' -> ('', English)."""
    m = re.match(r'^(.*?)\s*[（(]([^()（）]+)[)）]\s*$', s.strip())
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return '', s.strip()


def cell(s: str):
    m = re.match(r'^(.*?)\s*[（(]([^()（）]*→[^()（）]*)[)）]\s*$', s.strip())
    return f'{m.group(1)}|{m.group(2)}' if m else s


def season(label: str):
    no, _, rest = label.partition('·')
    local, en = paren(rest)
    return no.strip(), local, en


SEASON_IDS = ['ai-fundamentals', 'ai-coding', 'building-ai-systems']
LEARN = 'https://learn.agentware.studio'  # course site; lesson lists live there, not on this site


def build(loc: str):
    d = json.loads((ROOT / f'src/i18n/doc/{loc}.json').read_text('utf-8'))
    U = UI[loc]
    en = loc == 'en'

    hero = dict(
        intro=U['heroIntro'],
        zh=clause_break(nop(d['heroTitle']), loc),
        tagZh=nop(d['heroTag']),
        questions=[dict(when='', who=q['pre'], q=q['q']) for q in d['questions']],
        btnWord=U['btnWord'],
    )

    st = sentences(d['shiftTitle'])
    shift = dict(
        title=[clause_break(x, loc) for x in st],
        intro=d['shiftIntro'],
        eras=[dict(no=f'0{i + 1}', ver=e['ver'], era=e['era'], en=e['en'], zh=e['local'], motto=e['motto'], body=e['body'],
                   role=['OPERATOR', 'PROMPTER', 'DELEGATOR'][i]) for i, e in enumerate(d['eras'])],
        closing=split_closing(d['shiftClosing']),
    )

    notA = dict(title=clause_break(nop(d['notTitle']), loc), lead=d['notLead'], items=d['notItems'])

    head = d['tableHead']
    h1, h2 = paren(head[1]), paren(head[2])
    if en:
        h1, h2 = (head[1], ''), (head[2], '')
    architecture = dict(
        titleZh=clause_break(nop(d['archSub']), loc) if loc in CJK else ' · '.join(sentences(d['archSub'])),
        body=d['archBody'],
        table=dict(head=[head[0], h1[0], h2[0]], headEn=['', h1[1], h2[1]], rows=[[r[0], cell(r[1]), cell(r[2])] for r in d['tableRows']]),
    )

    flow = [re.sub(r'\s*[（(].*?[)）]\s*$', '', f).strip() for f in d['loopFlow']]
    codes = ['goal · constraints · acceptance', 'context · memory · evidence', 'state → next action', 'tools · APIs · deterministic core',
             'action → feedback → state', 'replan · adapt · escalate', 'acceptance criteria → evidence', 'verified outcome / human handoff']
    ens = ['Intent', 'Context', 'Plan', 'Act', 'Observe', 'Adapt', 'Verify', 'Deliver']
    loop = dict(
        title=clause_break(nop(d['loopTitle']).replace('; ', ';|').replace('；', '；|'), loc),
        principle=split_principle(d['loopPrinciple']),
        steps=[dict(en=ens[i], zh=flow[i], text=U['steps'][i], code=codes[i]) for i in range(8)],
        handback=dict(en='Hand back', zh=U['handback'][0], text=U['handback'][1], code='out of scope → human decision'),
    )
    if loc not in CJK:
        loop['title'] = nop(d['loopTitle'])

    pillars = dict(
        titleZh=U['pillarsLocal'],
        lead=d['pillarsLead'],
        items=[dict(code=['01 / DELEGATION', '02 / EXECUTION', '03 / GOVERNANCE', '04 / MEMORY'][i],
                    en='' if en else p['en'], zh=p['en'] if en else p['local'], lead=p['lead'], body=p['body'], points=p['points'])
               for i, p in enumerate(d['pillars'])],
    )

    manifesto = dict(
        intro=d['manifestoIntro'],
        items=[[m['n'], sentences(m['en']), mlocal(nop(m['local']), loc), m['body']] for m in d['manifesto']],
    )

    # the copy doc lists research, curriculum, aikit; research (the blog) is a separate project and not shown here
    items = d['studioItems']
    curr, aikit = items[1], items[2]
    if en:
        stitle = '\n'.join(sentences(d['studioTitle']))
    else:
        parts = [x.strip() for x in re.split(r'(?<=[、，,])', nop(d['studioTitle'])) if x.strip()]
        if loc in CJK and len(parts) >= 3:
            stitle = parts[0] + ('|' if loc == 'ja' else ' |') + parts[1] + '\n' + ' '.join(parts[2:])
        else:
            stitle = parts[0] + '\n' + ' '.join(parts[1:])
    studio = dict(
        title=stitle,
        sub=d['studioIntro'],
        items=[
            dict(tag='01 // OPEN CURRICULUM', title=curr['title'], body=curr['body'].rstrip('：: '), action=U['ui']['studioActions'][0], href=LEARN),
            # AIKit is not deployed yet: described, but not linked
            dict(tag='02 // USER TOOLS', title=aikit['title'], body=aikit['body']),
        ],
    )

    motto = curr['motto']
    m_en, m_local = 'We teach what we build.', motto.replace('We teach what we build.', '').strip()
    seasons = []
    for i, (label, body) in enumerate(curr['seasons']):
        no, local, sen = season(label)
        if en:
            local, sen = sen, ''
        seasons.append(dict(id=SEASON_IDS[i], no=no, zh=local, en=sen, body=body))
    course = U['learn']['course']
    learn = dict(title=curr['title'], en='Open Curriculum', motto=[m_en, m_local], lead=curr['body'].rstrip('：: '),
                 status=U['learn']['status'], course=course, seasons=seasons, cta=U['learn']['cta'])

    ui = dict(U['ui'])
    ui['learn'] = {k: U['learn'][k] for k in ('seasonsAria', 'actions')}
    ui['nf'] = U['nf']
    ui.pop('studioActions', None)

    return dict(hero=hero, shift=shift, notAgentware=notA, architecture=architecture, loop=loop, pillars=pillars,
                manifesto=manifesto, studio=studio, learn=learn, ui=ui), U['meta']


def frspace(v):
    """French punctuation: no-break space inside guillemets and before : ; ! ?"""
    if isinstance(v, str):
        v = re.sub(r'«\s+', '«\u00a0', v)
        v = re.sub(r'\s+»', '\u00a0»', v)
        return re.sub(r'\s+([:;!?])(?=\s|$)', '\u00a0\\1', v)
    if isinstance(v, list):
        return [frspace(x) for x in v]
    if isinstance(v, dict):
        return {k: frspace(x) for k, x in v.items()}
    return v


if __name__ == '__main__':
    out = ROOT / 'src/i18n/locales'
    out.mkdir(parents=True, exist_ok=True)
    metas = {}
    for loc in LOCALES:
        data, meta = build(loc)
        if loc == 'fr':
            data = frspace(data)
        metas[loc] = meta
        (out / f'{loc}.json').write_text(json.dumps(data, ensure_ascii=False, indent=1), 'utf-8')
    (ROOT / 'tools/meta.json').write_text(json.dumps(metas, ensure_ascii=False, indent=1), 'utf-8')
    print('ok', LOCALES)
