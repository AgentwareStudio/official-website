import { indexData } from '../../blog/routes';
import { rssResponse } from '../../blog/rss';

export const prerender = false;
export const GET = async () => rssResponse('en', await indexData('en'));
