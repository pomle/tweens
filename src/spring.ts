type Vector = Record<string, number>;

function set(rec: Record<string, number>, value: number) {
  for (const k of Object.keys(rec)) {
    rec[k] = value;
  }
}

function copy<T extends object>(
  a: Record<keyof T, number>,
  b: Record<keyof T, number>,
) {
  for (const key of Object.keys(a)) {
    a[key] = b[key];
  }
}

function lengthSq(rec: Record<string, number>) {
  let sum = 0;
  for (const v of Object.values(rec)) {
    sum += v * v;
  }
  return sum;
}

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

export interface Spring<T> {
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

  const physics = { ...DEFAULT_PHYSICS };

  function reconfigure(config: Config) {
    Object.assign(physics, config);
    physics.precision = Math.pow(physics.precision, 2);
  }

  reconfigure(config);

  let desire: Vector | undefined;
  const velocity = { ...value } as Vector;
  set(velocity, 0);

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

      const offset = {};

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
        set(velocity, 0);
        desire = undefined;
      }

      return true;
    },
  };
}
