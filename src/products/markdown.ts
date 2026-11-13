// Markdown versions of the product pages (/products/index.md, /products/<slug>/index.md), built from the same copy
// as the pages: the shared blocks here, a product's own scenes from its markdown.ts.
import { LOCALES, type Locale } from '../i18n';
import { label, markdownPath } from '../markdown';
import { SITE } from '../meta';
import { LIST, PRODUCTS, PRODUCT_LOCALES, copyOf, findProduct, productPath, productsPath } from './index';
import type { ProductCopy } from './types';
import { VOXNEXUS_MARKDOWN } from './voxnexus/markdown';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SCENES: Record<string, Record<string, (copy: any) => string>> = { voxnexus: VOXNEXUS_MARKDOWN };

const flat = (s: string) => s.replace(/\n/g, '');

function header(title: string, description: string, code: Locale, path: (c: Locale) => string) {
  const others = PRODUCT_LOCALES.filter((c) => c !== code)
    .map((c) => `[${LOCALES.find((l) => l.code === c)!.label}](${SITE + markdownPath(path(c))})`).join(' · ');
  return `# ${title}\n\n> ${description}\n\nSource: ${SITE + path(code)}\nOther languages: ${others}\n`;
}

const BLOCKS: Record<string, (c: ProductCopy) => string> = {
  hero: (c) => `## ${flat(c.hero.title)}\n\n${c.hero.lead}\n\n${c.features.map((f) => `- ${f}`).join('\n')}`,
  shift: (c) => `## ${c.shift.now}\n\n${c.shift.old}\n\n${c.shift.now}`,
  useCases: (c) => `## ${c.useCases.title}\n\n` + c.useCases.tabs.map((t) => `### ${t.label}\n\n${t.items.map((it) => `- **${it.title}**: ${it.body}`).join('\n')}`).join('\n\n'),
  trust: (c) => `## ${flat(c.trust.title)}\n\n${c.trust.items.map((t) => `- ${t}`).join('\n')}`,
  faq: (c) => `## ${c.faq.title}\n\n` + c.faq.items.map((it) => `### ${it.q}\n\n${it.a}`).join('\n\n'),
  ending: (c) => `## ${c.ending.title}`,
};

export function productMarkdown(slug: string, code: Locale) {
  const product = findProduct(slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  const copy = copyOf(product, code);
  const parts = product.sections.map((s) => {
    if (s.kind === 'scene') {
      const scene = SCENES[slug]?.[s.id];
      if (!scene) throw new Error(`${slug}: no Markdown for scene "${s.id}"`);
      return scene(copy);
    }
    // The film has no text of its own; the page links it when there is one.
    if (s.kind === 'film') return product.film ? `## ${copy.film.title}\n\n${SITE + product.film.mp4}` : '';
    return BLOCKS[s.kind](copy);
  }).filter(Boolean);
  return `${header(copy.meta.title, copy.meta.description, code, (c) => productPath(c, slug))}\n${parts.join('\n\n')}\n`;
}

export function productsMarkdown(code: Locale) {
  const l = LIST[code];
  const items = PRODUCTS.map((p) => {
    const c = copyOf(p, code);
    return `## ${c.name}\n\n${c.summary}\n\n${c.features.map((f) => `- ${f}`).join('\n')}\n\n[${label(l.open)}](${SITE + markdownPath(productPath(code, p.slug))})`;
  });
  return `${header(l.title, l.description, code, productsPath)}\n${l.lead}\n\n${items.join('\n\n')}\n`;
}
