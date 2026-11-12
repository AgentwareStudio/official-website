import type { APIRoute } from 'astro';
import type { Locale } from '../../../i18n';
import { MARKDOWN_TYPE } from '../../../markdown';
import { productsMarkdown } from '../../../products/markdown';
import { productLocalePaths } from '../../../products/pages';

export const getStaticPaths = productLocalePaths;
export const GET: APIRoute = ({ props }) => new Response(productsMarkdown(props.code as Locale), { headers: { 'Content-Type': MARKDOWN_TYPE } });
