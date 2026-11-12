// What each product brings to its page beyond the shared blocks: its scenes (the `scene` sections of product.ts, by
// id), a backdrop and extra actions for the first screen, a backdrop for the last one, and anything that spans the
// whole page. A product without an entry here is rendered from the shared blocks alone.
import type { ComponentType } from 'react';
import type { ProductCopy } from './types';
import { VOXNEXUS_SCENES } from './voxnexus/scenes';

// The product's own copy type is narrower than ProductCopy; the page hands each product only its own copy.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Part = ComponentType<{ copy: any }>;
export interface ProductScenes {
  scenes: Record<string, Part>;
  heroVisual?: Part;
  heroActions?: Part;
  endingVisual?: Part;
  /** Rendered once, outside the sections. */
  page?: Part;
}

export const SCENES: Record<string, ProductScenes> = { voxnexus: VOXNEXUS_SCENES };
export type { ProductCopy };
