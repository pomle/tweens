import { spring } from './spring';
import {
  zoom,
  fov,
  position,
  lookAt,
  opacity,
  rotation,
  scale,
  vec3,
} from './3';

export const springs = {
  lookAt,
  fov,
  opacity,
  position,
  rotation,
  scale,
  vec3,
  zoom,
  spring,
};

export type { Config as SpringConfig, Spring } from './spring';
