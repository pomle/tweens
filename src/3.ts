import { Camera, Material, Object3D, PerspectiveCamera, Vector3 } from 'three';
import { Config, spring } from './spring';

export function opacity(material: Material, config?: Config) {
  const tween = spring({ opacity: material.opacity }, config);

  return {
    ...tween,
    to(opacity: number) {
      tween.to({ opacity });
    },
    set(opacity: number) {
      tween.set({ opacity });
    },
    update(deltaTime: number) {
      if (tween.update(deltaTime)) {
        material.opacity = tween.values.opacity;
        return true;
      }
      return false;
    },
  };
}

export function zoom(camera: PerspectiveCamera, config?: Config) {
  const tween = spring({ fov: camera.fov }, config);

  return {
    ...tween,
    to(fov: number) {
      tween.to({ fov });
    },
    set(fov: number) {
      tween.set({ fov });
    },
    update(deltaTime: number) {
      if (tween.update(deltaTime)) {
        camera.fov = tween.values.fov;
        camera.updateProjectionMatrix();
        return true;
      }
      return false;
    },
  };
}

type Vec3 = { x: number; y: number; z: number };

export function vec3(vec3: Vector3, config?: Config) {
  const tween = spring(vec3 as Vec3, config);
  return { ...tween, values: vec3 };
}

export function scale(object: Object3D, config?: Config) {
  return vec3(object.scale, config);
}

export function position(object: Object3D, config?: Config) {
  return vec3(object.position, config);
}

export function rotation(object: Object3D, config?: Config) {
  const rot = object.rotation;
  const tween = spring(rot as Vec3, config);
  return {
    ...tween,
    values: rot,
  };
}

export function lookAt(camera: Camera, config?: Config) {
  const lookAt = new Vector3(0, 0, 0);
  const tween = vec3(lookAt, config);

  return {
    ...tween,
    values: lookAt,
    update(deltaTime: number) {
      if (tween.update(deltaTime)) {
        camera.lookAt(lookAt);
        return true;
      }
      return false;
    },
  };
}
