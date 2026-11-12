import type { APIRoute } from 'astro';
import { MARKDOWN_TYPE } from '../../../markdown';
import { PRODUCTS } from '../../../products';
import { productMarkdown } from '../../../products/markdown';

export function getStaticPaths() {
  return PRODUCTS.map((p) => ({ params: { slug: p.slug } }));
}
export const GET: APIRoute = ({ params }) => new Response(productMarkdown(params.slug!, 'en'), { headers: { 'Content-Type': MARKDOWN_TYPE } });
