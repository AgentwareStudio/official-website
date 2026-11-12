// What the routes need for the product pages: their static paths and each page's head (title, description, path,
// language versions, structured data).
import { LOCALES, type Locale } from '../i18n';
import { LIST, PRODUCTS, PRODUCT_LOCALES, copyOf, findProduct, productAlternates, productPath, productsPath } from './index';
import { productGraph, productsGraph } from './structured';

/** Locales with a path segment that have product pages (English lives at the root). */
const prefixed = () => LOCALES.filter((l) => l.path && PRODUCT_LOCALES.includes(l.code));
export const productLocalePaths = () => prefixed().map((l) => ({ params: { locale: l.path }, props: { code: l.code } }));
export const productLocaleSlugPaths = () =>
  prefixed().flatMap((l) => PRODUCTS.map((p) => ({ params: { locale: l.path, slug: p.slug }, props: { code: l.code } })));

export interface Doc { title: string; description: string; path: string; alternates: Partial<Record<Locale, string>>; graph: object[] }

export function productsDoc(code: Locale): Doc {
  const l = LIST[code];
  return { title: l.title, description: l.description, path: productsPath(code), alternates: productAlternates(), graph: productsGraph(code) };
}

export function productDoc(slug: string, code: Locale): Doc {
  const product = findProduct(slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  const { meta } = copyOf(product, code);
  return { title: meta.title, description: meta.description, path: productPath(code, slug), alternates: productAlternates(slug), graph: productGraph(product, code) };
}
