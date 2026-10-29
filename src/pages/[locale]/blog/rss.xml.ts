import type { APIRoute } from 'astro';
import { blogLang, indexData } from '../../../blog/routes';
import { rssResponse } from '../../../blog/rss';

export const prerender = false;
export const GET: APIRoute = async ({ params }) => {
  const lang = blogLang(params.locale);
  if (!lang) return new Response(null, { status: 404 });
  return rssResponse(lang, await indexData(lang));
};
