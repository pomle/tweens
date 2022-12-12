import {
  Camera,
  Euler,
  Material,
  Object3D,
  PerspectiveCamera,
  Vector3,
} from 'three';
import { Config, vec3, dimension } from 'tween';

export function opacity(material: Material, config?: Config) {
  const opacity = {
    value: material.opacity,
  };

  const tween = dimension(opacity, config);
  return {
    ...tween,
    update(deltaTime: number) {
      tween.update(deltaTime);
      material.opacity = opacity.value;
    },
  };
}

export function zoom(camera: PerspectiveCamera, config?: Config) {
  const fov = {
    value: camera.fov,
  };

  const tween = dimension(fov, config);

  return {
    ...tween,
    update(deltaTime: number) {
      tween.update(deltaTime);
      if (fov.value !== camera.fov) {
        camera.fov = fov.value;
        camera.updateProjectionMatrix();
      }
      return fov.value;
    },
  };
}

export function rotation(object: Object3D, config?: Config) {
  const rot = object.rotation;
  const buffer = new Vector3(rot.x, rot.y, rot.z);

  const tween = vec3(buffer, config);

  return {
    ...tween,
    set(rot: Euler) {
      tween.set(new Vector3(rot.x, rot.y, rot.z));
    },
    to(rot: Euler) {
      tween.to(new Vector3(rot.x, rot.y, rot.z));
    },
    update(deltaTime: number) {
      tween.update(deltaTime);
      rot.set(buffer.x, buffer.y, buffer.z);
      return rot;
    },
  };
}

export function lookAt(camera: Camera, config?: Config) {
  const lookAt = new Vector3(0, 0, 0);
  const tween = vec3(lookAt, config);

  return {
    ...tween,
    update(deltaTime: number) {
      tween.update(deltaTime);
      camera.lookAt(lookAt);
    },
  };
}

export function scale(object: Object3D, config?: Config) {
  return vec3(object.scale, config);
}

export function position(object: Object3D, config?: Config) {
  return vec3(object.position, config);
}
