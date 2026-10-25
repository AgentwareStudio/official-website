import type { Plugin } from 'vite';

/** Keep the complete cascade available before the homepage's first render. */
export function homeStyles(): Plugin {
  return {
    name: 'home-inline-styles',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html, { bundle }) {
        if (!/<body\b[^>]*\bdata-page="home"/.test(html)) return;
        let inlined = 0;
        const result = html.replace(/<link\b(?=[^>]*\brel="stylesheet")[^>]*>/g, (tag) => {
          const href = tag.match(/\bhref="([^"]+)"/)?.[1];
          const file = href?.startsWith('/') ? bundle?.[href.slice(1)] : undefined;
          if (!file || file.type !== 'asset' || !file.fileName.endsWith('.css')) {
            throw new Error(`Cannot inline homepage stylesheet: ${href}`);
          }
          const css = String(file.source);
          if (/<\/style\b/i.test(css)) throw new Error('Unsafe closing style tag in homepage CSS');
          inlined++;
          return `<style data-home-styles="${file.fileName}">${css}</style>`;
        });
        if (!inlined) throw new Error('Homepage has no stylesheet to inline');
        // This image was previously discovered only after React mounted the header.
        const brand = Object.values(bundle ?? {}).find((file) =>
          file.type === 'asset' && /^assets\/agentware_lockup_on-dark-[\w-]+\.svg$/.test(file.fileName),
        );
        if (!brand) throw new Error('Missing fingerprinted header brand asset');
        const preload = `    <link rel="preload" href="/${brand.fileName}" as="image" type="image/svg+xml" fetchpriority="low">\n`;
        return result.replace(/(?=\s*<script\b[^>]*\btype="module")/, `\n${preload}`);
      },
    },
  };
}
