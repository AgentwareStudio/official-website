import { indexMarkdown, markdownResponse } from '../blog/markdown';
import { indexData } from '../blog/routes';

export const prerender = false;
export const GET = async () => markdownResponse(indexMarkdown('en', await indexData('en')));
