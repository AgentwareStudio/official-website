// Every page in every locale, each entry listing all its language versions. Blog pages list the versions that exist;
// rendered in the Worker, so published posts appear without a build.
import { LOCALES } from '../i18n';
import { ALTERNATES, SITE, pageUrl } from '../meta';
import { INDEX_ALTERNATES } from '../blog/pages';
import { withBlog } from '../blog/source';
import { BLOG_LANGS, postPath } from '../blog/types';
import type { Alternates } from '../components/Chrome';

export const prerender = false;

const path = (code: string) => LOCALES.find((l) => l.code === code)!.path;

/** One <url> per version, each listing every version (and English as x-default when there is one). */
function entries(versions: Alternates) {
  const list = Object.entries(versions) as [string, string][];
  const alts = list.map(([c, p]) => `    <xhtml:link rel="alternate" hreflang="${c}" href="${SITE + p}" />\n`).join('')
    + (versions.en ? `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE + versions.en}" />\n` : '');
  return list.map(([, p]) => `  <url>\n    <loc>${SITE + p}</loc>\n${alts}  </url>\n`);
}

export async function GET() {
  const rows: string[] = [];
  for (const sub of ['', 'learn/']) {
    const alts = ALTERNATES.map((c) => `    <xhtml:link rel="alternate" hreflang="${c}" href="${pageUrl(path(c), sub)}" />\n`).join('')
      + `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('', sub)}" />\n`;
    for (const c of ALTERNATES) rows.push(`  <url>\n    <loc>${pageUrl(path(c), sub)}</loc>\n${alts}  </url>\n`);
  }
  rows.push(...entries(INDEX_ALTERNATES));
  // The language versions of a post share its id.
  const versions = new Map<string, Alternates>();
  for (const p of await withBlog((blog) => blog.allPosts())) {
    versions.set(p.id, { ...versions.get(p.id), [BLOG_LANGS[p.lang].locale]: postPath(p.lang, p.slug) });
  }
  for (const v of versions.values()) rows.push(...entries(v));
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    + rows.join('') + '</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
