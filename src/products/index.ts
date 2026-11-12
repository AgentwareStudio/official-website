// The products the site presents, in list order, and the list page's own words.
import type { Locale } from '../i18n';
import type { Product, ProductCopy } from './types';
import { voxnexus } from './voxnexus/product';

export const PRODUCTS: Product[] = [voxnexus];
export { PRODUCT_LOCALES, hasProducts, productAlternates, productPath, productsPath } from './paths';

export const findProduct = (slug: string) => PRODUCTS.find((p) => p.slug === slug);
/** The product's copy in `code` (callers only ask for PRODUCT_LOCALES). */
export function copyOf<C extends ProductCopy>(product: Product<C>, code: Locale): C {
  const copy = product.copy[code];
  if (!copy) throw new Error(`${product.slug}: no ${code} copy`);
  return copy;
}

/** The list pages' own words. */
export const LIST: Record<string, { title: string; description: string; heading: string; lead: string; open: string; status: Record<Product['status'], string> }> = {
  en: {
    title: 'Products — Agentware Studio',
    description: 'Products built by Agentware Studio: software you hand work to, instead of operating it step by step.',
    heading: 'Products', lead: 'Software you hand work to. Each product here puts the Agentware paradigm to work on a real job.',
    open: 'See the product', status: { new: 'New', beta: 'Beta', ga: 'Available' },
  },
  'zh-CN': {
    title: '产品 — Agentware Studio',
    description: 'Agentware Studio 开发的产品：把工作交给软件，而不是一步一步操作软件。',
    heading: '产品', lead: '把工作交给软件。这里的每一款产品，都把 Agentware 范式用在一件真实的工作上。',
    open: '查看产品', status: { new: '新发布', beta: '测试中', ga: '已发布' },
  },
  ja: {
    title: '製品 — Agentware Studio',
    description: 'Agentware Studio が開発する製品。ソフトウェアを操作するのではなく、仕事を任せる。',
    heading: '製品', lead: '仕事を、ソフトウェアに任せる。ここにある製品は、Agentware の考え方を実際の仕事に使ったものです。',
    open: '製品を見る', status: { new: '新登場', beta: 'ベータ', ga: '提供中' },
  },
};
