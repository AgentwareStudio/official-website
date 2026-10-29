// Every page in every locale, each entry listing all its language versions. Blog pages list the versions that exist,
// with <lastmod>: when a post last changed or became visible, and for a blog index its newest such change.
// Rendered in the Worker, so published posts appear without a build.
import { LOCALES } from '../i18n';
import { ALTERNATES, SITE, pageUrl } from '../meta';
import { INDEX_ALTERNATES } from '../blog/pages';
import { withBlog } from '../blog/source';
import { BLOG_LANGS, blogIndex, postPath } from '../blog/types';
import type { Alternates } from '../components/Chrome';

export const prerender = false;

const path = (code: string) => LOCALES.find((l) => l.code === code)!.path;

/** W3C datetime, to the second. */
const w3c = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, 'Z');

/** One <url> per version, each listing every version (and English as x-default when there is one). */
function entries(versions: Alternates, lastmod: Map<string, Date> = new Map()) {
  const list = Object.entries(versions) as [string, string][];
  const alts = list.map(([c, p]) => `    <xhtml:link rel="alternate" hreflang="${c}" href="${SITE + p}" />\n`).join('')
    + (versions.en ? `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE + versions.en}" />\n` : '');
  return list.map(([, p]) => {
    const mod = lastmod.get(p);
    return `  <url>\n    <loc>${SITE + p}</loc>\n${mod ? `    <lastmod>${w3c(mod)}</lastmod>\n` : ''}${alts}  </url>\n`;
  });
}

export async function GET() {
  const rows: string[] = [];
  for (const sub of ['', 'learn/']) {
    const alts = ALTERNATES.map((c) => `    <xhtml:link rel="alternate" hreflang="${c}" href="${pageUrl(path(c), sub)}" />\n`).join('')
      + `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('', sub)}" />\n`;
    for (const c of ALTERNATES) rows.push(`  <url>\n    <loc>${pageUrl(path(c), sub)}</loc>\n${alts}  </url>\n`);
  }
  // The language versions of a post share its id. A post's page changes when it is edited or becomes visible
  // (a scheduled post appears at publish_at); its blog index changes with it.
  const versions = new Map<string, Alternates>();
  const lastmod = new Map<string, Date>();
  const later = (path: string, d: Date) => { if (!lastmod.has(path) || lastmod.get(path)! < d) lastmod.set(path, d); };
  for (const p of await withBlog((blog) => blog.allPosts())) {
    const path = postPath(p.lang, p.slug);
    versions.set(p.id, { ...versions.get(p.id), [BLOG_LANGS[p.lang].locale]: path });
    const changed = p.updated_at > p.publish_at ? p.updated_at : p.publish_at;
    later(path, changed);
    later(blogIndex(p.lang), changed);
  }
  rows.push(...entries(INDEX_ALTERNATES, lastmod));
  for (const v of versions.values()) rows.push(...entries(v, lastmod));
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    + rows.join('') + '</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
