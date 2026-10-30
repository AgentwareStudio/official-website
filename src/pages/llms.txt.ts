// /llms.txt (llmstxt.org): the site for language models, linking the Markdown version of every page. Rendered in
// the Worker so the blog section lists the newest posts without a build.
import { withBlog } from '../blog/source';
import { label, markdownPath } from '../markdown';
import { postMarkdownUrl } from '../blog/markdown';
import { BLOG_LANGS, blogIndex, type BlogLang, type Post } from '../blog/types';
import { LINKS } from '../content';
import { LOCALES } from '../i18n';
import { ALTERNATES, SITE } from '../meta';

export const prerender = false;

const LATEST = 20;
const md = (path: string) => SITE + markdownPath(path);
const BLOG_NAMES: Record<BlogLang, string> = { en: 'English', zh: 'Chinese', ja: 'Japanese' };

/** The newest posts (all language versions of each), newest first. */
function latest(rows: Post[]) {
  const posts = new Map<string, Post[]>();
  for (const p of rows) {
    if (!posts.has(p.id) && posts.size === LATEST) continue;
    posts.set(p.id, [...(posts.get(p.id) ?? []), p]);
  }
  return [...posts.values()].map((versions) => versions
    .map((p) => `- [${label(p.title)}](${postMarkdownUrl(p)}): ${p.summary} (${BLOG_NAMES[p.lang]}, ${p.publish_at.toISOString().slice(0, 10)})`)
    .join('\n')).join('\n');
}

export async function GET() {
  const posts = latest(await withBlog((blog) => blog.allPosts()));
  const languages = ALTERNATES.map((c) => {
    const l = LOCALES.find((x) => x.code === c)!;
    const base = l.path ? `/${l.path}/` : '/';
    return `- [${l.label}](${md(base)}): the home page in ${l.label}\n- [${l.label}: curriculum](${md(`${base}learn/`)}): the open curriculum page in ${l.label}`;
  }).join('\n');
  const text = `# Agentware Studio

> Agentware Studio is an independent research and creation studio dedicated to Agentware—a class of software designed for the agentic era that shifts human-computer interaction from operating interfaces to delegating intent (\`[ A↗• ] AGENTWARE — SOFTWARE THAT ACTS ON INTENT\`).

Instead of operating interfaces step by step, you entrust software with a goal, define the boundaries, and specify the acceptance criteria; within its authorized scope, the system understands context, autonomously organizes actions, adapts to changes, and delivers verifiable outcomes. Agentware Studio advances this paradigm through deep research, an open AI engineering curriculum, and user-facing product experiments. The studio focuses on delivering goal-driven Agentware for consumers and private, high-governance Agentware solutions for enterprises.

Every page has a Markdown version at its URL plus \`index.md\` (\`/zh/learn/\` → \`/zh/learn/index.md\`). Each HTML page also links it as \`<link rel="alternate" type="text/markdown">\`.

## Documentation

- [Agentware Guide](${SITE}/agentware.md): Comprehensive standalone Markdown guide covering the core definition, paradigm shift (Tool, Copilot, and Delegation eras), what Agentware is not, deterministic core and agentic control plane architecture, the eight-step execution loop, the four pillars, the six manifesto principles, studio initiatives and the open curriculum.
- [Agentware Studio](${md('/')}): Official multilingual website presenting the Agentware paradigm, architecture comparison, execution loop, four foundational pillars, and manifesto.
- [Full text](${SITE}/llms-full.txt): The Agentware Guide followed by every published blog post in full, in one file.
- [Public Access Policy](${SITE}/auth.md): Audience, anonymous access policy, and GET request instructions for AI agents, bots, and automated clients; all public pages and documentation require no registration, credentials, or Authorization header.

## Curriculum

- [AI Courses & Labs](${md('/learn/')}): The studio's AI courses, built by practicing engineers (\`Built by engineers. Crafted to last.\`), and the three seasons of its first course, *Graduating from AI Gacha* (\`ai-fundamentals\`, \`ai-coding\`, and \`building-ai-systems\`), with price, length and audience for each.
- [Course Platform](${LINKS.learn}): Learning portal for *Graduating from AI Gacha* featuring interactive practice games and a course-grounded AI assistant.

## Blog

${(Object.keys(BLOG_LANGS) as BlogLang[]).map((l) => `- [Blog (${BLOG_NAMES[l]})](${md(blogIndex(l))}): ${l === 'en' ? 'Studio essays on Agentware, agentic software, and what the studio is building, written conclusion first; every post in its language.' : `The ${BLOG_NAMES[l]} edition of the blog.`}`).join('\n')}
${posts ? `\n## Latest posts\n\n${posts}\n` : ''}
## Languages

${languages}

## Optional

- [GitHub](${LINKS.github}): Official Agentware Studio organization and open-source repositories.
- [X (Twitter)](${LINKS.x}): Official X profile for studio updates and research notes.
- [YouTube](${LINKS.youtube}): Official Agentware Studio YouTube channel.
- [YouTube (Chinese)](${LINKS.youtubeByLocale['zh-CN']}): The Chinese-language channel.
- [YouTube (Japanese)](${LINKS.youtubeByLocale.ja}): The Japanese-language channel.
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
