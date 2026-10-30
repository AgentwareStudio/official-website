import type { APIRoute } from 'astro';
import { indexMarkdown, markdownResponse } from '../../../blog/markdown';
import { blogLang, indexData } from '../../../blog/routes';

export const prerender = false;
export const GET: APIRoute = async ({ params }) => {
  const lang = blogLang(params.locale);
  if (!lang) return new Response(null, { status: 404 });
  return markdownResponse(indexMarkdown(lang, await indexData(lang)));
};
