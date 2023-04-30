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
  values: T;
  set(vec: T): void;
  to(vec: T): void;
  clear(): void;
  reconfigure(config: Config): void;
  update(delatTime: number): boolean;
}

export function spring<T extends Vector>(
  vec: T,
  config: Config = DEFAULT_PHYSICS,
): Spring<T> {
  type Key = keyof Vector;
  const keys = Object.keys(vec) as Key[];

  function make(initial: number): Vector {
    const next = {};
    for (const k of keys) {
      next[k] = initial;
    }
    return next;
  }

  function add(vecTo: Vector, vecFrom: Vector) {
    for (const k of keys) {
      vecTo[k] += vecFrom[k];
    }
  }

  function sub(vecTo: Vector, vecFrom: Vector) {
    for (const k of keys) {
      vecTo[k] -= vecFrom[k];
    }
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

  function multiplyScalar(vec: Vector, scalar: number) {
    for (const k of keys) {
      vec[k] *= scalar;
    }
  }

  function divideScalar(vec: Vector, scalar: number) {
    for (const k of keys) {
      vec[k] /= scalar;
    }
  }

  const physics = { ...DEFAULT_PHYSICS };
  Object.assign(physics, config);

  let desire: Vector | undefined;

  const delta = make(0);
  const force = make(0);
  const dampingForce = make(0);
  const springForce = make(0);
  const acceleration = make(0);
  const offset = make(0);
  const velocity = make(0);

  return {
    values: vec,

    set(this: void, next: T) {
      copy(vec, next);
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

      copy(offset, vec);
      sub(offset, desire);

      const distance = length(offset);
      const speed = length(velocity);

      const { stiffness, mass, friction, precision } = physics;

      if (speed < precision && distance < precision) {
        copy(vec, desire);
        this.clear();
        return true;
      }

      copy(dampingForce, velocity);
      multiplyScalar(dampingForce, friction);

      copy(springForce, offset);
      multiplyScalar(springForce, stiffness);

      copy(force, dampingForce);
      add(force, springForce);
      multiplyScalar(force, -1);

      copy(acceleration, force);
      divideScalar(acceleration, mass);
      add(velocity, acceleration);

      copy(delta, velocity);
      multiplyScalar(delta, deltaTime);

      add(vec, delta);

      return true;
    },
  };
}

export function value(
  container: { value: number },
  config: Config = DEFAULT_PHYSICS,
) {
  const tween = spring(container, config);

  return {
    ...tween,
    to(value: number) {
      tween.to({ value });
    },
    set(value: number) {
      tween.set({ value });
    },
  };
}
