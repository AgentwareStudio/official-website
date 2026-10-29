// RSS 2.0 feed of one blog language: newest posts first, each with its summary and full HTML.
import { SITE } from '../meta';
import { BLOG_UI } from './strings';
import { BLOG_LANGS, blogIndex, postPath, type BlogLang, type Post } from './types';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** CDATA cannot contain its own terminator: split it across two sections. */
const cdata = (s: string) => `<![CDATA[${s.split(']]>').join(']]]]><![CDATA[>')}]]>`;

export const rssPath = (lang: BlogLang) => `${blogIndex(lang)}rss.xml`;

/** Feed readers show the HTML on their own origin: make the article's links and images absolute. */
function absolute(html: string, base: string) {
  const resolve = (url: string) => {
    try { return new URL(url, base).href; } catch { return url; }
  };
  return html
    .replace(/\b(href|src)="([^"]*)"/g, (_, attr: string, url: string) => `${attr}="${url.startsWith('#') ? url : resolve(url)}"`)
    .replace(/\bsrcset="([^"]*)"/g, (_, set: string) =>
      `srcset="${set.split(',').map((part) => part.trim().replace(/^\S+/, (url) => resolve(url))).join(', ')}"`);
}

export function rssResponse(lang: BlogLang, posts: Post[]) {
  const ui = BLOG_UI[lang];
  const items = posts.slice(0, 50).map((p) => {
    const url = SITE + postPath(lang, p.slug);
    return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${p.publish_at.toUTCString()}</pubDate>
      <description>${esc(p.summary)}</description>
${p.tags.map((t) => `      <category>${esc(t)}</category>\n`).join('')}      <content:encoded>${cdata(absolute(p.body_html, url))}</content:encoded>
    </item>
`;
  }).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${esc(`${ui.title} | Agentware Studio`)}</title>
    <link>${SITE + blogIndex(lang)}</link>
    <atom:link href="${SITE + rssPath(lang)}" rel="self" type="application/rss+xml" />
    <description>${esc(ui.lead)}</description>
    <language>${BLOG_LANGS[lang].locale}</language>
${posts[0] ? `    <lastBuildDate>${posts.reduce((d, p) => (p.updated_at > d ? p.updated_at : d), posts[0].updated_at).toUTCString()}</lastBuildDate>\n` : ''}${items}  </channel>
</rss>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
}
