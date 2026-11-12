// The product list (/products/): one card per product. Kept apart from the product page's blocks, so the list loads
// none of their code.
import { href, type Locale } from '../../i18n';
import { LIST, copyOf, productPath } from '../../products';
import type { Product } from '../../products/types';

/** The product list: one card per product. */
export function ProductList({ products, code }: { products: Product[]; code: Locale }) {
  const l = LIST[code];
  return (
    <>
      <section className="page-hero pd-list-hero">
        <div className="wrap">
          <p className="eyebrow"><a href={href('/')}>AGENTWARE STUDIO</a> <span aria-hidden="true">//</span> PRODUCTS</p>
          <h1 className="page-hero__title">{l.heading}{l.heading !== 'Products' && <em lang="en">Products</em>}</h1>
          <p className="page-hero__lead pd-list-hero__lead">{l.lead}</p>
        </div>
      </section>
      <section className="pd-list">
        <ul className="wrap pd-list__grid">
          {products.map((p, i) => {
            const c = copyOf(p, code);
            return (
              <li key={p.slug}>
                <a className="pd-card" href={productPath(code, p.slug)} style={{ '--accent': p.accent } as React.CSSProperties}>
                  <p className="eyebrow">{String(i + 1).padStart(2, '0')} // {p.slug.toUpperCase()} <span className="pd-card__status">{l.status[p.status]}</span></p>
                  <h2 className="pd-card__name">{c.name}</h2>
                  <i className="pd-card__line" aria-hidden="true" />
                  <p className="pd-card__sum">{c.summary}</p>
                  <span className="pd-card__go">{l.open}<span aria-hidden="true"> →</span></span>
                </a>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
