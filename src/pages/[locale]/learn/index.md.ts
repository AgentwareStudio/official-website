import type { APIRoute } from 'astro';
import { LOCALES, type Locale } from '../../../i18n';
import { MARKDOWN_TYPE, pageMarkdown } from '../../../markdown';

export function getStaticPaths() {
  return LOCALES.filter((l) => l.path).map((l) => ({ params: { locale: l.path }, props: { code: l.code } }));
}
export const GET: APIRoute = async ({ props }) =>
  new Response(await pageMarkdown('learn', props.code as Locale), { headers: { 'Content-Type': MARKDOWN_TYPE } });
