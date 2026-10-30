// /llms-full.txt: the Agentware guide (/agentware.md, a static file) followed by every published post in full,
// newest first. Rendered in the Worker, so new posts appear without a build.
import { env } from 'cloudflare:workers';
import { postMarkdown } from '../blog/markdown';
import { withBlog } from '../blog/source';
import type { Post } from '../blog/types';

export const prerender = false;

export async function GET({ request }: { request: Request }) {
  const guide = await env.ASSETS.fetch(new URL('/agentware.md', request.url).href);
  if (!guide.ok) throw new Error(`/agentware.md: HTTP ${guide.status}`);
  const rows = await withBlog((blog) => blog.allPosts());
  const byId = new Map<string, Post[]>();
  for (const p of rows) byId.set(p.id, [...(byId.get(p.id) ?? []), p]);
  const posts = rows.map((p) => postMarkdown(p, byId.get(p.id)!.filter((o) => o !== p)));
  const text = [await guide.text(), ...posts].map((s) => s.trim()).join('\n\n---\n\n') + '\n';
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
