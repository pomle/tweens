import { spring } from './spring';
import { zoom, position, lookAt, opacity, rotation, scale, vec3 } from './3';

export const springs = {
  lookAt,
  opacity,
  position,
  rotation,
  scale,
  vec3,
  zoom,
  spring,
};

export type { Config as SpringConfig } from './spring';
