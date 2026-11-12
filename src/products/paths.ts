// Where the product pages live. They exist in PRODUCT_LOCALES only; the other locales link to the English pages
// (like the course introduction, src/i18n.ts LEARN_LOCALES). No product data here: the site header imports this.
import { LOCALES, type Locale } from '../i18n';

export const PRODUCT_LOCALES: Locale[] = ['en', 'zh-CN', 'ja'];
export const hasProducts = (code: Locale) => PRODUCT_LOCALES.includes(code);

const prefix = (code: Locale) => { const p = LOCALES.find((l) => l.code === code)!.path; return p ? `/${p}` : ''; };
/** The product list in `code`, or the English one for locales without product pages. */
export const productsPath = (code: Locale) => `${hasProducts(code) ? prefix(code) : ''}/products/`;
export const productPath = (code: Locale, slug: string) => `${productsPath(code)}${slug}/`;
/** A page's language versions (paths), for hreflang, the language menu and the sitemap. */
export const productAlternates = (slug?: string) =>
  Object.fromEntries(PRODUCT_LOCALES.map((c) => [c, slug ? productPath(c, slug) : productsPath(c)])) as Partial<Record<Locale, string>>;
