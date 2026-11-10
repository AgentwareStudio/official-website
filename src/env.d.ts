/// <reference types="astro/client" />

// Bindings of the Worker (wrangler.jsonc) used by the blog and the newsletter; ASSETS (the static files) is added by the build.
declare module 'cloudflare:workers' {
  export const env: {
    HYPERDRIVE: { connectionString: string };
    ASSETS: { fetch(request: Request | string): Promise<Response> };
    // Newsletter (src/newsletter): vars in wrangler.jsonc, the rest secrets.
    NEWSLETTER_FROM: string;
    NEWSLETTER_SEGMENTS: string;
    NEWSLETTER_REPLY_TO?: string;
    RESEND_API_URL?: string;
    NEWSLETTER_PREVIEW?: string;
    NEWSLETTER_PRODUCTION_SEGMENTS?: string;
    RESEND_API_KEY: string;
    NEWSLETTER_SECRET: string;
    TURNSTILE_SECRET: string;
    NEWSLETTER_API_TOKEN: string;
  };
}

declare namespace App {
  // Set by @astrojs/cloudflare on every request rendered in the Worker.
  interface Locals {
    cfContext: { waitUntil(promise: Promise<unknown>): void };
  }
}

/** The deployment that built the Worker (astro.config.mjs). */
declare const __AW_BUILD__: string;
