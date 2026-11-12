// The product module's data: one directory per product (src/products/<slug>/) with its facts (product.ts), its copy
// per language (strings/*.json) and, optionally, scenes of its own (scenes/). The pages, their Markdown versions and
// the structured data all read this; nothing here is specific to one product.
import type { Locale } from '../i18n';

/** Shared blocks every product page can use, and `scene`: a block the product brings itself (its `scenes` map). */
export type Section =
  | { kind: 'hero' | 'shift' | 'useCases' | 'trust' | 'film' | 'faq' | 'ending' }
  | { kind: 'scene'; id: string };

export interface Film {
  /** Fingerprinted URLs (imported with ?url). */
  mp4: string;
  mp4Mobile?: string;
  poster: string;
  /** ISO 8601 duration and upload date, for the structured data. */
  duration: string;
  uploaded: string;
  captions: Partial<Record<Locale, string>>;
}

/** The copy the shared blocks read. A product's own scenes add their copy under `scenes`. */
export interface ProductCopy {
  meta: { title: string; description: string };
  name: string;
  /** One sentence for the product list and the structured data. */
  summary: string;
  /** What the product can do, as short phrases (structured data `featureList`, the list card). */
  features: string[];
  hero: { eyebrow: string; title: string; lead: string; film: string };
  shift: { old: string; now: string };
  useCases: { title: string; tabs: { label: string; items: { title: string; body: string }[] }[] };
  trust: { title: string; items: string[] };
  film: { title: string };
  faq: { title: string; items: { q: string; a: string }[] };
  ending: { title: string; again: string; all: string };
  ui: { soundOn: string; soundOff: string; sound: string; replay: string; demoData: string };
  scenes: Record<string, unknown>;
}

export interface Product<C extends ProductCopy = ProductCopy> {
  slug: string;
  status: 'new' | 'beta' | 'ga';
  /** ISO date, for the structured data and the list order. */
  released: string;
  /** The product's own colour (CSS), used by its scenes. */
  accent: string;
  film?: Film;
  sections: Section[];
  /** Only the languages in PRODUCT_LOCALES. */
  copy: Partial<Record<Locale, C>>;
}
