// Markdown versions of the pages, for agents and AI search: a page's URL without its trailing slash plus .md
// (/index.md for the root). Site pages and the Agentware guide (/agentware.md) are built from the same copy as the
// HTML (content.ts with the locale's messages), never converted from the HTML; blog pages come from the stored
// Markdown (src/blog/markdown.ts).
import * as C from './content';
import { LOCALES, messagesFor, setLocale, type Locale } from './i18n';
import { ALTERNATES, SITE, pageMeta, pageUrl } from './meta';

export const MARKDOWN_TYPE = 'text/markdown; charset=utf-8';

/** The Markdown path of a page path: /zh/learn/ → /zh/learn.md, / → /index.md. */
export const markdownPath = (path: string) => (path === '/' ? '/index.md' : `${path.replace(/\/$/, '')}.md`);

/** Text for a link label: brackets would end it early. */
export const label = (s: string) => s.replace(/([[\]\\])/g, '\\$1');

const CJK = new Set<Locale>(['zh-CN', 'ja']);
let cjk = false;
/** Copy as shown: "|" only marks where a line may wrap; a line break without punctuation before it separates
 *  phrases ("Exploring the paradigm\nSharing the knowledge"). */
const text = (s: string) => s.replace(/\|/g, '')
  .replace(/(\p{P}?)\s*\n/gu, (_, p: string) => p + (cjk ? '' : p ? ' ' : ' · ')).trim();
/** Pieces of one sentence; no space after a dash that joins them. */
const join = (parts: string[]) => parts.map(text).filter(Boolean).reduce((a, b) => (cjk || !a || /[—–-]$/.test(a) ? a + b : `${a} ${b}`), '');

type SitePage = 'home' | 'learn';
const sub = (page: SitePage) => (page === 'learn' ? 'learn/' : '');
const localePath = (code: Locale) => LOCALES.find((l) => l.code === code)!.path;
/** The page's own URL in a locale (`.md` false) or its Markdown version. */
const pageLink = (page: SitePage, code: Locale, md = false) => {
  const url = pageUrl(localePath(code), sub(page));
  return md ? SITE + markdownPath(url.slice(SITE.length)) : url;
};

/** Title, summary, source URL and the other languages' Markdown. */
function header(page: SitePage, code: Locale, title: string, description: string) {
  const others = ALTERNATES.filter((c) => c !== code)
    .map((c) => `[${LOCALES.find((l) => l.code === c)!.label}](${pageLink(page, c, true)})`).join(' · ');
  return `# ${title}\n\n> ${description}\n\nSource: ${pageLink(page, code)}\nOther languages: ${others}\n`;
}

/** The home page's sections, in page order. `base` is the locale's path prefix for site links. */
function homeBody(base: string) {
  const { hero, shift, notAgentware, architecture, loop, pillars, manifesto, studio, ui, LINKS } = C;
  const out: string[] = [];

  out.push(`## From Interface to Intent${hero.zh ? ` — ${text(hero.zh)}` : ''}\n\n`
    + '`[ A↗• ] AGENTWARE — SOFTWARE THAT ACTS ON INTENT`\n\n' + text(hero.intro));

  out.push(`## ${text(ui.questionsAria)}\n\n`
    + hero.questions.map((q) => `- ${join([q.when, q.who])} **${text(q.q)}**`).join('\n'));

  out.push(`## ${shift.title.map(text).join(' / ')}\n\n${shift.intro.map(text).join('\n\n')}\n\n`
    + shift.eras.map((e, i) => `${i + 1}. **${e.ver} — ${text(e.era)}** (${[e.en, e.zh].filter(Boolean).join(' · ')}; ${e.role}; *${e.motto}*)\n   ${text(e.body)}`).join('\n')
    + `\n\n> ${join(shift.closing)}`);

  out.push(`## ${text(notAgentware.title)}\n\n${text(notAgentware.lead)}\n\n`
    + notAgentware.items.map((it) => `- **${it.name} ≠ Agentware**: ${text(it.body)}`).join('\n'));

  const t = architecture.table;
  const cell = (c: string) => { const [a, b] = c.split('|'); return b ? `${text(a)} (\`${b}\`)` : text(a); };
  const head = [t.head[0], ...[1, 2].map((i) => [t.head[i], t.headEn[i]].filter(Boolean).join(' · '))];
  out.push(`## ${architecture.titleEn.join(', ')}\n\n${architecture.titleZh ? `**${text(architecture.titleZh)}**\n\n` : ''}${text(architecture.body)}\n\n`
    + `| ${head.join(' | ')} |\n| --- | --- | --- |\n` + t.rows.map((r) => `| ${r[0]} | ${cell(r[1])} | ${cell(r[2])} |`).join('\n'));

  const step = (s: { en: string; zh: string; text: string; code: string }) => `**${[s.en, s.zh].filter(Boolean).join(' — ')}**: ${text(s.text)} \`${s.code}\``;
  out.push(`## ${text(loop.title)}\n\n${join(loop.principle)}\n\n`
    + loop.steps.map((s, i) => `${i + 1}. ${step(s)}`).join('\n') + `\n\n- ${step(loop.handback)}`);

  out.push(`## ${pillars.titleEn.join(' ')}\n\n${pillars.titleZh ? `**${text(pillars.titleZh)}** ` : ''}${text(pillars.lead)}\n\n`
    + pillars.items.map((it) => `### ${it.code}: ${[it.zh, it.en].filter(Boolean).join(' · ')}\n\n**${text(it.lead)}** ${text(it.body)}`
      + (it.points.length ? `\n\n${it.points.map(([k, v]) => `- **${k}**: ${v}`).join('\n')}` : '')).join('\n\n'));

  out.push(`## The Agentware Manifesto\n\n${text(manifesto.intro)}\n\n`
    + manifesto.items.map(([n, en, local, body]) => `### ${n}. ${en.join('. ')}\n\n${local ? `**${text(local)}**\n\n` : ''}${text(body)}`).join('\n\n')
    + '\n\n— From Interface to Intent, Agentware Studio');

  out.push(`## ${text(studio.title)}\n\n${text(studio.sub)}\n\n`
    + studio.items.map((it) => `### ${text(it.title)}\n\n${text(it.body)}`
      + (it.href && it.action ? `\n\n[${label(text(it.action).replace(/\s*↗$/, ''))}](${it.href.startsWith('http') ? it.href : SITE + base + it.href})` : '')).join('\n\n'));

  out.push(`## Links\n\n- GitHub: ${LINKS.github}\n- X: ${LINKS.x}\n- YouTube: ${LINKS.youtube}\n- Course site: ${LINKS.learn}`);
  return out.join('\n\n');
}

/** The open curriculum page's sections. */
function learnBody() {
  const { learn, ui, LINKS } = C;
  const c = learn.course;
  return [
    `## ${text(learn.title)}${learn.en ? ` · ${learn.en}` : ''}\n\n> ${learn.motto.map(text).join(' ')}\n\n${text(learn.lead)}\n\n${text(learn.status)}`,
    `## ${text(c.name)}\n\n${text(c.body)}\n\n${text(c.langs)}: 中文 · 日本語 · English\n\n`
      + learn.seasons.map((s) => `### ${s.no}: ${[s.zh, s.en].filter(Boolean).join(' · ')}\n\n${text(s.body)}`).join('\n\n'),
    `## ${text(learn.cta)}\n\n- [${label(ui.learn.actions[0])}](${LINKS.learn})\n- [${label(ui.learn.actions[1])}](${LINKS.youtube})`,
  ].join('\n\n');
}

/** Applies the locale to the shared copy; the caller reads it before anything else can switch it. */
async function useLocale(code: Locale) {
  const messages = await messagesFor(code);
  setLocale(code, messages);
  cjk = CJK.has(code);
  return messages;
}

/** /index.md, /zh.md, /learn.md, /zh/learn.md, … (built with the static pages). */
export async function pageMarkdown(page: SitePage, code: Locale) {
  const messages = await useLocale(code);
  const { title, description } = pageMeta(page, code, messages);
  const path = localePath(code);
  const body = page === 'home' ? homeBody(path ? `/${path}` : '') : learnBody();
  return `${header(page, code, title, description)}\n${body}\n`;
}

/** /agentware.md: the standalone English guide — the home page and the curriculum in one document. */
export async function guideMarkdown() {
  await useLocale('en');
  const { hero, LINKS } = C;
  const links = [
    ['Official website', `${SITE}/`], ['Blog', `${SITE}/blog/`], ['Open curriculum', `${SITE}/learn/`], ['Course platform', LINKS.learn],
    ['GitHub', LINKS.github], ['X (Twitter)', LINKS.x], ['YouTube', LINKS.youtube],
  ].map(([k, v]) => `- **${k}**: ${v}`).join('\n');
  const home = homeBody('').replace(/\n\n## Links\n[\s\S]*$/, '');
  return `# Agentware\n\n> ${text(hero.intro)}\n\n${links}\n\n${home}\n\n${learnBody()}\n`;
}
