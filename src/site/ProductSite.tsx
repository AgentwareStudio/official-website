import '../products/product.css';
import type { Alternates } from '../components/Chrome';
import { findProduct } from '../products';
import { ProductPage } from '../sections/product/Page';
import { Site, type PageProps } from './Site';

/** One product's page (/products/<slug>/). The island gets the slug, not the product: its copy is in the bundle. */
export default function ProductSite({ slug, alternates, ...props }: PageProps & { slug: string; alternates: Alternates }) {
  const product = findProduct(slug);
  if (!product) throw new Error(`Unknown product: ${slug}`);
  return <Site page="product" alternates={alternates} {...props}><ProductPage product={product} code={props.code} /></Site>;
}
