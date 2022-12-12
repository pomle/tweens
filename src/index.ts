import { vec3, dimension } from './tween';
import { zoom, position, lookAt, opacity, rotation, scale } from './3';

export const springs = {
  dimension,
  lookAt,
  opacity,
  position,
  rotation,
  scale,
  vec3,
  zoom,
};

export type { Config as SpringConfig } from './tween';
