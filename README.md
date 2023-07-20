# Tween

TypeScript lib for animating using spring physics tweens to any dimension.

## Usage

1. Initialize
    ```ts
    import { spring } from "@pomle/tween";
    
    const tween = spring({valueA: 0, valueB: 2});
    tween.to({valueA: 3, valueB: 4});
    ```

2. Update & Read
    ```ts
    // Returns true when change made
    if (tween.update(1/60)) {
      const values = tween.values;
      console.log("New values", values);
    }
    ```

### Mutation

Input object will be mutated on update. Depending on your use case you may either supply the reference you need updated, or supply a copy.

Setup
```ts
import { spring } from "@pomle/tween";

const myObject = {
  position: {x: 0, y: 0: z: 0},
};
```

* With mutation
  
  ```ts
  const tween = spring(myObject.position);
  tween.to({x: 1, y: 2: z: 3});
  tween.update(1/60);
  ```

* With copy

  ```ts
  const tween = spring({...myObject.position});
  tween.to({x: 1, y: 2: z: 3});
  tween.update(1/60);
  Object.assign(myObject.position, tween.values);
  ```

## API

### `Vector`

Value container for all springs. Can have any number of dimensions.
```ts
type Vector = Record<string, number>;
```

### Config

Three factors, *stiffness*, *mass*, and *friction*, control the behavior of a spring physics simulation.

The fourth config option, *precision*, determines how low velocity must be before the spring is considered settled. Once the spring is settled, it will set the spring value to the desired and pause simulation until a new desired value is supplied to the `.to` function.
```ts
const config = {
  stiffness: 25, // How strong is the spring
  mass: 10, // How heavy is the object
  friction: 5, // How thick is the medium the object travels in
  precision: 0.0005, // A threshold below which the spring settles and stops updating
};

const tween = spring({value: 0}, config);
```

Config is unit-less but values are related to time step used in update function.

For example, if your time step is in milliseconds instead of seconds, the config input must be set to numbers of the same magnitude.

To avoid the spring physics from going havoc, values must be low enough to achieve a negative feedback loop.


### Spring Interface 

#### `values: Vector`

Current state of simulation.

#### `to(value: Vector): void`

Set the desired state to which the spring will pull values.

#### `set(value: Vector): void`

Sets the value immediately and thus stops further updates.

#### `update(deltaTime: number): void`

Runs one cycle of the spring simulation moving the values toward their desired state. Fractions 1/10-1/120 is a reasonable range given the default spring config.

#### `clear(): void`

Stops updates immediately and put the values at rest

#### `reconfigure(config: Config): void`

Updates the spring physics config.
