// A product page: the product's sections in order, shared blocks and its own scenes alike.
import type { Locale } from '../../i18n';
import { copyOf } from '../../products';
import { SCENES } from '../../products/scenes';
import type { Product } from '../../products/types';
import { Faq, ProductEnding, ProductFilm, ProductHero, ShiftStatement, SoundToggle, TrustList, UseCases } from './Blocks';

export function ProductPage({ product, code }: { product: Product; code: Locale }) {
  const copy = copyOf(product, code);
  const own = SCENES[product.slug];
  const Visual = own?.heroVisual;
  const Actions = own?.heroActions;
  const End = own?.endingVisual;
  const Whole = own?.page;
  return (
    <div className="pd" style={{ '--accent': product.accent } as React.CSSProperties}>
      {Whole && <Whole copy={copy} />}
      {product.sections.map((s, i) => {
        if (s.kind === 'scene') {
          const Scene = own?.scenes[s.id];
          if (!Scene) throw new Error(`${product.slug}: no scene "${s.id}"`);
          return <Scene key={i} copy={copy} />;
        }
        switch (s.kind) {
          case 'hero': return <ProductHero key={i} copy={copy} film={!!product.film} visual={Visual && <Visual copy={copy} />} actions={Actions && <Actions copy={copy} />} />;
          case 'shift': return <ShiftStatement key={i} copy={copy} />;
          case 'useCases': return <UseCases key={i} copy={copy} />;
          case 'trust': return <TrustList key={i} copy={copy} />;
          case 'film': return product.film ? <ProductFilm key={i} copy={copy} film={product.film} code={code} /> : null;
          case 'faq': return <Faq key={i} copy={copy} />;
          case 'ending': return <ProductEnding key={i} copy={copy} code={code} visual={End && <End copy={copy} />} />;
        }
      })}
      <SoundToggle copy={copy} />
    </div>
  );
}
