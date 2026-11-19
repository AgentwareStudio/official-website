import { handle } from '@astrojs/cloudflare/handler';
import { fallbackCsp, securityHeaders } from './security-headers';

export default {
  async fetch(...args: Parameters<typeof handle>) {
    // Apply headers to the final response after Astro has resolved any custom error page.
    const response = await handle(...args);
    if (import.meta.env.DEV) return response;
    const secured = new Response(response.body, response);
    for (const [name, value] of Object.entries(securityHeaders)) secured.headers.set(name, value);
    // Astro and Static Assets supply CSP for HTML. Other responses need only the deny policy.
    if (!secured.headers.has('Content-Security-Policy')) secured.headers.set('Content-Security-Policy', fallbackCsp);
    return secured;
  },
};
