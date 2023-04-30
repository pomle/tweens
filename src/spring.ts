type Vector = Record<string, number>;

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

interface Spring<T> {
  value: T;
  set(vec: T): void;
  to(vec: T): void;
  clear(): void;
  reconfigure(config: Config): void;
  update(delatTime: number): boolean;
}

export function spring<T extends Vector>(
  value: T,
  config: Config = DEFAULT_PHYSICS,
): Spring<T> {
  type Key = keyof Vector;
  const keys = Object.keys(value) as Key[];

  function make(initial: number): Vector {
    const next = {};
    for (const k of keys) {
      next[k] = initial;
    }
    return next;
  }

  function copy(vecTo: Vector, vecFrom: Vector) {
    for (const k of keys) {
      vecTo[k] = vecFrom[k];
    }
  }

  function length(vector: Vector) {
    let sum = 0;
    for (const k of keys) {
      const v = vector[k] as number;
      sum += v * v;
    }
    return Math.sqrt(sum);
  }

  const physics = { ...DEFAULT_PHYSICS };
  Object.assign(physics, config);

  let desire: Vector | undefined;

  const acceleration = make(0);
  const dampingForce = make(0);
  const delta = make(0);
  const force = make(0);
  const offset = make(0);
  const springForce = make(0);
  const velocity = make(0);

  return {
    value,

    set(this: void, next: T) {
      copy(value, next);
      desire = undefined;
    },

    to(this: void, next: T) {
      desire = next;
    },

    reconfigure(config?: Config) {
      Object.assign(physics, config);
    },

    clear() {
      desire = undefined;
    },

    update(deltaTime: number) {
      if (desire == null) {
        return false;
      }

      for (const k of keys) {
        offset[k] = value[k] - desire[k];
      }

      const distance = length(offset);
      const speed = length(velocity);

      const { stiffness, mass, friction, precision } = physics;

      if (speed < precision && distance < precision) {
        copy(value, desire);
        this.clear();
        return true;
      }

      for (const k of keys) {
        dampingForce[k] = velocity[k] * friction;
        springForce[k] = offset[k] * stiffness;
        force[k] = -(dampingForce[k] + springForce[k]);
        acceleration[k] = force[k] / mass;
        velocity[k] += acceleration[k];
        delta[k] = velocity[k] * deltaTime;
        (value[k] as number) += delta[k];
      }

      return true;
    },
  };
}
