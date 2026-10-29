// What the blog routes pass to the page layout: title, path and the language versions of each page.
import { rssPath } from './rss';
import { BLOG_UI } from './strings';
import { BLOG_LANGS, blogIndex, postPath, type BlogLang, type Post } from './types';
import type { Alternates } from '../components/Chrome';

export const INDEX_ALTERNATES: Alternates = Object.fromEntries(
  (Object.keys(BLOG_LANGS) as BlogLang[]).map((l) => [BLOG_LANGS[l].locale, blogIndex(l)]),
);

export const indexMeta = (lang: BlogLang) => ({
  title: `${BLOG_UI[lang].title} | Agentware Studio`,
  description: BLOG_UI[lang].lead,
  path: blogIndex(lang),
  alternates: INDEX_ALTERNATES,
  rss: rssPath(lang),
});

export const postMeta = (post: Post, others: Post[]) => ({
  title: `${post.title} | Agentware Studio`,
  description: post.summary,
  path: postPath(post.lang, post.slug),
  alternates: Object.fromEntries([post, ...others].map((p) => [BLOG_LANGS[p.lang].locale, postPath(p.lang, p.slug)])) as Alternates,
  rss: rssPath(post.lang),
});

/** h2/h3 headings with ids, for the table of contents. */
export function headings(html: string) {
  return [...html.matchAll(/<h([23]) id="([^"]+)">([\s\S]*?)<\/h\1>/g)].map((m) => ({
    level: Number(m[1]),
    id: m[2],
    text: m[3].replace(/<[^>]+>/g, ''),
  }));
}
