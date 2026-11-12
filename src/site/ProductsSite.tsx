import '../products/product.css';
import type { Alternates } from '../components/Chrome';
import { PRODUCTS } from '../products';
import { ProductList } from '../sections/product/List';
import { Site, type PageProps } from './Site';

/** The product list (/products/). */
export default function ProductsSite({ alternates, ...props }: PageProps & { alternates: Alternates }) {
  return <Site page="products" alternates={alternates} {...props}><ProductList products={PRODUCTS} code={props.code} /></Site>;
}
