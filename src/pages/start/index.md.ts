import { MARKDOWN_TYPE, pageMarkdown } from '../../markdown';

export const GET = async () => new Response(await pageMarkdown('start', 'en'), { headers: { 'Content-Type': MARKDOWN_TYPE } });
