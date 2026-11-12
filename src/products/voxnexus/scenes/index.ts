// VoxNexus' own parts of its product page (src/products/scenes.ts).
import './vox.css';
import type { ProductScenes } from '../../scenes';
import { Boundary } from './Boundary';
import { Connect } from './Connect';
import { Forge } from './Forge';
import { HeroActions, HeroVisual } from './Hero';
import { Latency } from './Latency';
import { Maze } from './Maze';
import { EndingField, Spine } from './Page';
import { Talk } from './Talk';

export const VOXNEXUS_SCENES: ProductScenes = {
  scenes: { maze: Maze, talk: Talk, latency: Latency, connect: Connect, forge: Forge, boundary: Boundary },
  heroVisual: HeroVisual,
  heroActions: HeroActions,
  endingVisual: EndingField,
  page: Spine,
};
