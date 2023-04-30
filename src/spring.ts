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

  function lengthSq(vector: Vector) {
    let sum = 0;
    for (const k of keys) {
      const v = vector[k] as number;
      sum += v * v;
    }
    return sum;
  }

  const physics = { ...DEFAULT_PHYSICS };

  function reconfigure(config: Config) {
    Object.assign(physics, config);
    physics.precision = Math.pow(physics.precision, 2);
  }

  reconfigure(config);

  let desire: Vector | undefined;

  const offset = make(0);
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

    reconfigure,

    clear() {
      desire = undefined;
    },

    update(deltaTime: number) {
      if (!desire) {
        return false;
      }

      const { stiffness, mass, friction, precision } = physics;

      for (const k of keys) {
        offset[k] = value[k] - desire[k];
        const damp = velocity[k] * friction;
        const drag = offset[k] * stiffness;
        const force = -(damp + drag);
        const acc = force / mass;
        velocity[k] += acc;
        (value[k] as number) += velocity[k] * deltaTime;
      }

      const distance = lengthSq(offset);
      const speed = lengthSq(velocity);

      if (speed < precision && distance < precision) {
        copy(value, desire);
        desire = undefined;
      }

      return true;
    },
  };
}
