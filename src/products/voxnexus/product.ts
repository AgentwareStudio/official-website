// VoxNexus: the product's facts, the order of its page and the shape of its scenes' copy (strings/*.json).
import type { Product, ProductCopy } from '../types';
import en from './strings/en.json';
import ja from './strings/ja.json';
import zhCN from './strings/zh-CN.json';

/** One scripted call: what the caller says, what gets done along the way, and how it ends — a result, or a stop at
 *  something the agent may not do. */
export interface Call { say: string; steps: string[]; result?: string; stop?: string; reply: string }

export interface VoxScenes {
  hero: { action: string; say: string; steps: string[]; result: string };
  maze: { keys: string[]; say: string };
  talk: { title: string; note: string; pick: string; you: string; agent: string; calls: Call[] };
  latency: { value: string; unit: string; note: string; action: string; ask: string; answer: string; askLabel: string; answerLabel: string };
  connect: { title: string; lead: string; hub: string; pick: string; listTitle: string; empty: string; systems: { name: string; can: string[] }[] };
  forge: {
    title: string; lead: string; pick: string;
    labels: { name: string; langs: string; can: string; cannot: string; confirm: string; published: string; first: string };
    examples: { say: string; name: string; langs: string; can: string[]; cannot: string[]; first: string }[];
    probe: { title: string; say: string; action: string; cause: string; count: string; help: string };
  };
  boundary: { say: string; denied: string; human: string };
}
export type VoxCopy = ProductCopy & { scenes: VoxScenes };

export const voxnexus: Product<VoxCopy> = {
  slug: 'voxnexus',
  status: 'new',
  released: '2026-11-25',
  accent: '#4f5bd5',
  // The 90-second film is added here once it is delivered (`film`); until then the page has no film block.
  sections: [
    { kind: 'hero' },
    { kind: 'scene', id: 'maze' },
    { kind: 'scene', id: 'talk' },
    { kind: 'scene', id: 'latency' },
    { kind: 'scene', id: 'connect' },
    { kind: 'scene', id: 'forge' },
    { kind: 'scene', id: 'boundary' },
    { kind: 'useCases' },
    { kind: 'film' },
    { kind: 'faq' },
    { kind: 'ending' },
  ],
  copy: { en, ja, 'zh-CN': zhCN },
};
