import { MARKDOWN_TYPE, pageMarkdown } from '../markdown';

export const GET = async () => new Response(await pageMarkdown('learn', 'en'), { headers: { 'Content-Type': MARKDOWN_TYPE } });
