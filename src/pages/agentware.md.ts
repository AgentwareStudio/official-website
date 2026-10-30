import { MARKDOWN_TYPE, guideMarkdown } from '../markdown';

export const GET = async () => new Response(await guideMarkdown(), { headers: { 'Content-Type': MARKDOWN_TYPE } });
