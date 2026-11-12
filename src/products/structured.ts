// The product pages' structured data: the product as a SoftwareApplication (no offers or ratings: there is no price
// and there are no reviews), its film, and the list page as a collection.
import { SITE } from '../meta';
import type { Locale } from '../i18n';
import { LIST, PRODUCTS, copyOf, productPath, productsPath } from './index';
import type { Product } from './types';

const ORG = `${SITE}/#organization`;

export function productGraph(product: Product, code: Locale): object[] {
  const copy = copyOf(product, code);
  const url = SITE + productPath(code, product.slug);
  const list = LIST[code];
  const graph: object[] = [
    {
      '@type': 'SoftwareApplication',
      '@id': `${url}#product`,
      name: copy.name,
      description: copy.summary,
      applicationCategory: 'BusinessApplication',
      url,
      mainEntityOfPage: url,
      inLanguage: code,
      datePublished: product.released,
      featureList: copy.features,
      publisher: { '@id': ORG },
      ...(product.film && { image: SITE + product.film.poster }),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { name: 'Agentware Studio', item: `${SITE}/` },
        { name: list.heading, item: SITE + productsPath(code) },
        { name: copy.name, item: url },
      ].map((it, i) => ({ '@type': 'ListItem', position: i + 1, ...it })),
    },
  ];
  if (product.film) {
    graph.push({
      '@type': 'VideoObject',
      name: copy.name,
      description: copy.summary,
      thumbnailUrl: SITE + product.film.poster,
      contentUrl: SITE + product.film.mp4,
      uploadDate: product.film.uploaded,
      duration: product.film.duration,
    });
  }
  return graph;
}

export function productsGraph(code: Locale): object[] {
  const list = LIST[code];
  const url = SITE + productsPath(code);
  return [{
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    name: list.heading,
    description: list.description,
    url,
    inLanguage: code,
    publisher: { '@id': ORG },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: PRODUCTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: copyOf(p, code).name, url: SITE + productPath(code, p.slug) })),
    },
  }];
}
