// Every page in every locale, each entry listing all its language versions (formerly written by tools/gen_html.py).
import { LOCALES } from '../i18n';
import { ALTERNATES, pageUrl } from '../meta';

const path = (code: string) => LOCALES.find((l) => l.code === code)!.path;

export function GET() {
  const rows: string[] = [];
  for (const sub of ['', 'learn/']) {
    const alts = ALTERNATES.map((c) => `    <xhtml:link rel="alternate" hreflang="${c}" href="${pageUrl(path(c), sub)}" />\n`).join('')
      + `    <xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl('', sub)}" />\n`;
    for (const c of ALTERNATES) rows.push(`  <url>\n    <loc>${pageUrl(path(c), sub)}</loc>\n${alts}  </url>\n`);
  }
  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
    + rows.join('') + '</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
