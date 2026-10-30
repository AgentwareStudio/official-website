// Markdown versions of the blog pages (/blog.md, /zh/blog/<slug>.md, …): each post is its stored Markdown
// (body_md, images already on the image host) under a short header: title, summary, author, dates, the page's URL
// and its other languages.
import { SITE } from '../meta';
import { MARKDOWN_TYPE, label, markdownPath } from '../markdown';
import { BLOG_UI } from './strings';
import { blogIndex, postPath, type BlogLang, type Post } from './types';

export const AUTHOR = 'Agentware Studio';
const w3c = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, 'Z');
/** When the post's page last changed: an edit, or a scheduled post becoming visible. */
export const modified = (p: Post) => (p.updated_at > p.publish_at ? p.updated_at : p.publish_at);
export const postMarkdownUrl = (p: Post) => SITE + markdownPath(postPath(p.lang, p.slug));

export function postMarkdown(post: Post, others: Post[]) {
  const ui = BLOG_UI[post.lang];
  const meta = [
    `Author: ${AUTHOR}`,
    `${ui.published}: ${w3c(post.publish_at)}`,
    ...(post.updated_at.getTime() - post.publish_at.getTime() > 60_000 ? [`${ui.updated}: ${w3c(post.updated_at)}`] : []),
    ...(post.tags.length ? [`Tags: ${post.tags.join(', ')}`] : []),
    `Source: ${SITE + postPath(post.lang, post.slug)}`,
    ...(others.length ? [`Other languages: ${others.map((o) => `[${o.lang}](${postMarkdownUrl(o)})`).join(' · ')}`] : []),
  ];
  return `# ${post.title}\n\n> ${post.summary}\n\n${meta.join('\n')}\n\n---\n\n${post.body_md.trim()}\n`;
}

export function indexMarkdown(lang: BlogLang, posts: Post[]) {
  const ui = BLOG_UI[lang];
  const list = posts.map((p) => `- [${label(p.title)}](${postMarkdownUrl(p)}) — ${w3c(p.publish_at).slice(0, 10)}: ${p.summary}`);
  return `# ${ui.title} | Agentware Studio\n\n> ${ui.lead}\n\nSource: ${SITE + blogIndex(lang)}\n\n${list.join('\n') || ui.empty}\n`;
}

export const markdownResponse = (body: string) => new Response(body, { headers: { 'Content-Type': MARKDOWN_TYPE } });
