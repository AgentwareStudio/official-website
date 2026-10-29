// Pages rendered in the Worker (the blog, its feeds and the sitemap) are kept in the data center's cache for five
// minutes, so most visits skip the database; the publish script purges the URLs it changes. Browsers revalidate
// every time, like the static HTML. The query string is not part of the key: the tag filter runs in the browser.
import { defineMiddleware } from 'astro:middleware';

const EDGE_SECONDS = 300;
const BROWSER = 'public, max-age=0, must-revalidate';

/** Browser caching as for static HTML, and an explicit charset (Astro sends a bare text/html). */
function forBrowser(response: Response) {
  response.headers.set('Cache-Control', BROWSER);
  if (response.headers.get('Content-Type') === 'text/html') response.headers.set('Content-Type', 'text/html; charset=utf-8');
  return response;
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.isPrerendered) return next();
  // Page routes live at directory URLs, like the static pages (feeds and the sitemap are files). Only a page that
  // exists is redirected; anything else keeps its immediate 404.
  const { pathname, search } = new URL(context.request.url);
  if (!pathname.endsWith('/') && !/\.[a-z]+$/.test(pathname)) {
    const response = await next();
    return response.status === 200 ? context.redirect(`${pathname}/${search}`, 301) : response;
  }
  // `caches.default` exists in the Workers runtime only.
  const cache = (globalThis.caches as (CacheStorage & { default?: Cache }) | undefined)?.default;
  if (import.meta.env.DEV || !cache || context.request.method !== 'GET') {
    const response = await next();
    return response.status === 200 ? forBrowser(new Response(response.body, response)) : response;
  }

  const url = new URL(context.request.url);
  const key = new Request(url.origin + url.pathname);
  const hit = await cache.match(key);
  if (hit) return forBrowser(new Response(hit.body, hit));

  const response = await next();
  if (response.status !== 200) return response;
  const stored = new Response(response.body, response);
  stored.headers.set('Cache-Control', `public, max-age=${EDGE_SECONDS}`);
  context.locals.cfContext.waitUntil(cache.put(key, stored.clone()));
  return forBrowser(stored);
});
