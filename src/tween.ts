import { Vector3 } from 'three';

export type Physics = {
  friction: number;
  mass: number;
  stiffness: number;
  precision: number;
};

export type Config = Partial<Physics>;

const DEFAULT_PHYSICS: Physics = {
  stiffness: 40,
  mass: 10,
  friction: 3,
  precision: 0.0005,
};

export function vec3(pos: Vector3, config: Config = DEFAULT_PHYSICS) {
  const physics = { ...DEFAULT_PHYSICS };
  Object.assign(physics, config);

  let anchor: Vector3 | undefined;

  const delta = new Vector3();
  const force = new Vector3();
  const dampingForce = new Vector3();
  const springForce = new Vector3();
  const acceleration = new Vector3();
  const offset = new Vector3();
  const velocity = new Vector3();

  return {
    set(this: void, next: Vector3) {
      pos.copy(next);
    },

    to(this: void, next: Vector3) {
      anchor = next;
    },

    reconfigure(config?: Config) {
      Object.assign(physics, config);
    },

    clear() {
      anchor = undefined;
    },

    update(deltaTime: number) {
      if (anchor == null) {
        return pos;
      }

      offset.copy(pos).sub(anchor);
      const distance = offset.length();
      const speed = velocity.length();

      const { stiffness, mass, friction, precision } = physics;

      if (speed < precision && distance < precision) {
        pos.copy(anchor);
        this.clear();
        return pos;
      }

      dampingForce.copy(velocity).multiplyScalar(friction);
      springForce.copy(offset).multiplyScalar(stiffness);
      force.copy(dampingForce).add(springForce).negate();

      acceleration.copy(force).divideScalar(mass);
      velocity.add(acceleration);

      delta.copy(velocity).multiplyScalar(deltaTime);
      pos.add(delta);

      return pos;
    },
  };
}

export function dimension(
  container: { value: number },
  config: Config = DEFAULT_PHYSICS,
) {
  const physics = { ...DEFAULT_PHYSICS };
  Object.assign(physics, config);

  let anchor: number | undefined;

  let delta = 0;
  let force = 0;
  let dampingForce = 0;
  let springForce = 0;
  let acceleration = 0;
  let offset = 0;
  let velocity = 0;

  return {
    set(this: void, next: number) {
      container.value = next;
    },

    to(this: void, next: number) {
      anchor = next;
    },

    reconfigure(config?: Config) {
      Object.assign(physics, config);
    },

    clear(this: void) {
      anchor = undefined;
    },

    update(deltaTime: number) {
      const value = container.value;

      if (anchor == null) {
        return value;
      }

      offset = value - anchor;
      const distance = Math.abs(offset);
      const speed = Math.abs(velocity);

      const { stiffness, mass, friction, precision } = physics;

      if (speed < precision && distance < precision) {
        container.value = anchor;
        this.clear();
        return container.value;
      }

      dampingForce = velocity * friction;
      springForce = offset * stiffness;
      force = -(dampingForce + springForce);

      acceleration = force / mass;
      velocity += acceleration;

      delta = velocity * deltaTime;
      container.value += delta;

      return container.value;
    },
  };
}
