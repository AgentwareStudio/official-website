/// <reference types="astro/client" />

// Bindings of the Worker (wrangler.jsonc) used by the blog; ASSETS (the static files) is added by the build.
declare module 'cloudflare:workers' {
  export const env: { HYPERDRIVE: { connectionString: string }; ASSETS: { fetch(request: Request | string): Promise<Response> } };
}

declare namespace App {
  // Set by @astrojs/cloudflare on every request rendered in the Worker.
  interface Locals {
    cfContext: { waitUntil(promise: Promise<unknown>): void };
  }
}

/** The deployment that built the Worker (astro.config.mjs). */
declare const __AW_BUILD__: string;
