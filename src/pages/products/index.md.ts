import { MARKDOWN_TYPE } from '../../markdown';
import { productsMarkdown } from '../../products/markdown';

export const GET = () => new Response(productsMarkdown('en'), { headers: { 'Content-Type': MARKDOWN_TYPE } });
