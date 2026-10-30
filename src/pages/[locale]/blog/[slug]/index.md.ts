import type { APIRoute } from 'astro';
import { markdownResponse, postMarkdown } from '../../../../blog/markdown';
import { blogLang, postVersions } from '../../../../blog/routes';

export const prerender = false;
export const GET: APIRoute = async ({ params }) => {
  const lang = blogLang(params.locale);
  const data = lang && (await postVersions(lang, params.slug));
  return data ? markdownResponse(postMarkdown(data.post, data.others)) : new Response(null, { status: 404 });
};
