/// <reference types="astro/client" />

// Bindings of the Worker (wrangler.jsonc) used by the blog.
declare module 'cloudflare:workers' {
  export const env: { HYPERDRIVE: { connectionString: string } };
}

declare namespace App {
  // Set by @astrojs/cloudflare on every request rendered in the Worker.
  interface Locals {
    cfContext: { waitUntil(promise: Promise<unknown>): void };
  }
}

/** The deployment that built the Worker (astro.config.mjs). */
declare const __AW_BUILD__: string;
