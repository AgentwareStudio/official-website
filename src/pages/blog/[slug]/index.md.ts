import type { APIRoute } from 'astro';
import { markdownResponse, postMarkdown } from '../../../blog/markdown';
import { postVersions } from '../../../blog/routes';

export const prerender = false;
export const GET: APIRoute = async ({ params }) => {
  const data = await postVersions('en', params.slug);
  return data ? markdownResponse(postMarkdown(data.post, data.others)) : new Response(null, { status: 404 });
};
