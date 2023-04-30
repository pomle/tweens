import {
  Camera,
  Euler,
  Material,
  Object3D,
  PerspectiveCamera,
  Vector3,
} from 'three';
import { Config, Spring, spring } from './spring';

export function opacity(
  material: Material,
  config?: Config,
): Spring<{ opacity: number }> {
  const tween = spring({ opacity: material.opacity }, config);

  return {
    ...tween,
    update(deltaTime: number) {
      if (tween.update(deltaTime)) {
        material.opacity = tween.value.opacity;
        return true;
      }
      return false;
    },
  };
}

export function zoom(
  camera: PerspectiveCamera,
  config?: Config,
): Spring<{ fov: number }> {
  const tween = spring({ fov: camera.fov }, config);

  return {
    ...tween,
    update(deltaTime: number) {
      if (tween.update(deltaTime)) {
        camera.fov = tween.value.fov;
        camera.updateProjectionMatrix();
        return true;
      }
      return false;
    },
  };
}

type Vec3 = { x: number; y: number; z: number };

export function vec3(vec3: Vector3, config?: Config): Spring<Vector3> {
  const tween = spring(vec3 as Vec3, config);
  return { ...tween, value: vec3 };
}

export function scale(object: Object3D, config?: Config) {
  return vec3(object.scale, config);
}

export function position(object: Object3D, config?: Config) {
  return vec3(object.position, config);
}

export function rotation(object: Object3D, config?: Config): Spring<Euler> {
  const rot = object.rotation;
  const tween = spring(rot as Vec3, config);
  return {
    ...tween,
    value: rot,
  };
}

export function lookAt(camera: Camera, config?: Config): Spring<Vector3> {
  const lookAt = new Vector3(0, 0, 0);
  const tween = vec3(lookAt, config);

  return {
    ...tween,
    value: lookAt,
    update(deltaTime: number) {
      if (tween.update(deltaTime)) {
        camera.lookAt(lookAt);
        return true;
      }
      return false;
    },
  };
}
