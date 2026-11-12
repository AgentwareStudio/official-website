import type { APIRoute } from 'astro';
import type { Locale } from '../../../../i18n';
import { MARKDOWN_TYPE } from '../../../../markdown';
import { productMarkdown } from '../../../../products/markdown';
import { productLocaleSlugPaths } from '../../../../products/pages';

export const getStaticPaths = productLocaleSlugPaths;
export const GET: APIRoute = ({ params, props }) => new Response(productMarkdown(params.slug!, props.code as Locale), { headers: { 'Content-Type': MARKDOWN_TYPE } });
