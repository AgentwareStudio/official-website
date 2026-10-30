// Structured data (JSON-LD, schema.org) for search engines: the studio and the site on every page, and for a blog
// post the article and its breadcrumb trail.
import { LINKS } from './content';
import { ALTERNATES, SITE } from './meta';
import { AUTHOR, modified } from './blog/markdown';
import { BLOG_UI } from './blog/strings';
import { BLOG_LANGS, blogIndex, postPath, type Post } from './blog/types';

const ORG = `${SITE}/#organization`;

const organization = {
  '@type': 'Organization',
  '@id': ORG,
  name: AUTHOR,
  url: `${SITE}/`,
  // An unversioned copy of src/assets/brand (tools/astro_site.mjs), so the URL stays stable.
  logo: { '@type': 'ImageObject', url: `${SITE}/brand/agentware_icon_app_dark_180.png`, width: 180, height: 180 },
  email: 'dev@agentware.studio',
  sameAs: [LINKS.github, LINKS.x, LINKS.youtube, ...Object.values(LINKS.youtubeByLocale)],
};

const website = { '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: AUTHOR, publisher: { '@id': ORG }, inLanguage: ALTERNATES };

/** A blog post: the article (author and publisher the studio) and Home › Blog › post. */
export function postGraph(post: Post) {
  const url = SITE + postPath(post.lang, post.slug);
  const prefix = BLOG_LANGS[post.lang].prefix;
  return [
    {
      '@type': 'BlogPosting',
      '@id': `${url}#article`,
      headline: post.title,
      description: post.summary,
      url,
      mainEntityOfPage: url,
      inLanguage: BLOG_LANGS[post.lang].locale,
      datePublished: post.publish_at.toISOString(),
      dateModified: modified(post).toISOString(),
      author: { '@type': 'Organization', '@id': ORG, name: AUTHOR, url: `${SITE}/` },
      publisher: { '@id': ORG },
      ...(post.cover && { image: post.cover.webp }),
      ...(post.tags.length ? { keywords: post.tags.join(', ') } : {}),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { name: AUTHOR, item: `${SITE}${prefix}/` },
        { name: BLOG_UI[post.lang].title, item: SITE + blogIndex(post.lang) },
        { name: post.title, item: url },
      ].map((it, i) => ({ '@type': 'ListItem', position: i + 1, ...it })),
    },
  ];
}

/** The page's JSON-LD, ready for a <script type="application/ld+json"> (no "<" that could close the element). */
export function jsonLd(extra: object[] = []) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': [organization, website, ...extra] }).replace(/</g, '\\u003c');
}
