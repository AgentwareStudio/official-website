// Post-build steps that the Vite plugins (tools/home_styles.ts, tools/browser_cache.ts) used to do:
// - keep the existing download URLs /fonts/* and /brand/* (unversioned copies of src/assets/);
// - inline the stylesheet into home pages, so the full cascade is there before the first render,
//   and preload the header brand image;
// - write _headers: fingerprinted files are immutable, HTML always revalidates.
import { cpSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const files = (dir) => readdirSync(dir, { recursive: true, withFileTypes: true }).filter((f) => f.isFile()).map((f) => join(f.parentPath, f.name));

function inlineHomeStyles(out) {
  const assets = readdirSync(join(out, 'assets'));
  const brand = assets.find((f) => /^agentware_lockup_on-dark[.-][\w-]+\.svg$/.test(f));
  if (!brand) throw new Error('Missing fingerprinted header brand asset');
  let pages = 0;
  for (const file of files(out).filter((f) => f.endsWith('.html'))) {
    let html = readFileSync(file, 'utf8');
    if (!/<body\b[^>]*\bdata-page="home"/.test(html)) continue;
    let inlined = 0;
    html = html.replace(/<link\b(?=[^>]*\brel="stylesheet")[^>]*>/g, (tag) => {
      const href = tag.match(/\bhref="([^"]+)"/)?.[1];
      if (!href?.startsWith('/assets/') || !href.endsWith('.css')) throw new Error(`Cannot inline homepage stylesheet: ${href}`);
      const css = readFileSync(join(out, href), 'utf8');
      if (/<\/style\b/i.test(css)) throw new Error('Unsafe closing style tag in homepage CSS');
      inlined++;
      return `<style data-home-styles="${href.slice(1)}">${css}</style>`;
    });
    if (!inlined) throw new Error(`Homepage has no stylesheet to inline: ${relative(out, file)}`);
    // This image was previously discovered only after React mounted the header.
    html = html.replace('</head>', `<link rel="preload" href="/assets/${brand}" as="image" type="image/svg+xml" fetchpriority="low"></head>`);
    writeFileSync(file, html);
    pages++;
  }
  if (!pages) throw new Error('No home page found');
}

function writeHeaders(out) {
  const rules = new Map();
  // Plain-text and Markdown navigations cannot use HTML's <meta charset> declaration.
  rules.set('/llms.txt', { 'Content-Type': 'text/plain; charset=utf-8' });
  rules.set('/agentware.md', { 'Content-Type': 'text/markdown; charset=utf-8' });
  for (const file of files(out).map((f) => relative(out, f).split('\\').join('/'))) {
    if (file.startsWith('assets/')) {
      if (!/^assets\/.+[.-][A-Za-z0-9_-]{8,}\.(?:js|css|woff2|svg|png)$/.test(file)) throw new Error(`Cannot cache an unversioned asset: ${file}`);
      rules.set(`/${file}`, { 'Cache-Control': 'public, max-age=31536000, immutable' });
    } else if (file.endsWith('.html')) {
      rules.set(`/${file}`, { 'Cache-Control': 'public, max-age=0, must-revalidate' });
      rules.set(`/${file.replace(/index\.html$|\.html$/, '')}`, { 'Cache-Control': 'public, max-age=0, must-revalidate' });
    }
  }
  if (rules.size > 100) throw new Error('Cloudflare Static Assets supports at most 100 header rules');
  const source = '# Generated from existing build files; never replace with /assets/*.\n'
    + [...rules].sort(([a], [b]) => a.localeCompare(b))
      .map(([path, headers]) => `${path}\n${Object.entries(headers).map(([name, value]) => `  ${name}: ${value}\n`).join('')}`).join('\n');
  writeFileSync(join(out, '_headers'), source);
}

export function siteFiles() {
  return {
    name: 'agentware-site-files',
    hooks: {
      'astro:build:done': ({ dir }) => {
        const out = fileURLToPath(dir);
        const root = fileURLToPath(new URL('../', import.meta.url));
        // Preserve existing download URLs with the platform's revalidation defaults.
        for (const kind of ['fonts', 'brand']) cpSync(join(root, 'src/assets', kind), join(out, kind), { recursive: true });
        inlineHomeStyles(out);
        writeHeaders(out);
      },
    },
  };
}
