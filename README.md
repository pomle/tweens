# Tween

TypeScript lib for animating using spring physics tweens to any dimension.

## Usage

All tweens follow the following pattern.

1. Setup
    ```ts
    import { springs } from "@pomle/tween";
    
    const tween = springs.spring({valueA: 0, valueB: 2});
    tween.to({valueA: 3, valueB: 4});
    ```

2. Update & Read
    ```ts
    // Returns true when change made
    if (tween.update(deltaTime)) {
      const values = tween.values;
      console.log("New values", values);
    }
    ```

### Mutation

Input object will be mutated on update. Depending on your use case you may either supply the reference you need updated, or supply a copy.

Setup
```ts
import { springs } from "@pomle/tween";

const myObject = {
  position: {x: 0, y: 0: z: 0},
};
```

* With mutation
  
  ```ts
  const tween = springs.spring(myObject.position);
  tween.to({x: 1, y: 2: z: 3});
  tween.update(1/60);
  ```

* With copy

  ```ts
  const tween = springs.spring({...myObject.position});
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

Three factors control the behavior of a spring physics simulation.
```ts
const config = {
  stiffness: 25, // How strong is the spring
  mass: 10, // How heavy is the object
  friction: 5, // How thick is the medium the object travels in
};

const tween = springs.spring({value: 0}, config);
```

### Spring Interface 

#### `values: Vector`

Current state of simulation.

#### `to(value: Vector): void`

Set the desired state to which the spring will pull values.

#### `set(value: Vector): void`

Sets the value immediately and thus stops further updates.

#### `update(deltaTime: number): void`

Runs one cycle of the spring simulation moving the values toward their desired state.

#### `clear(): void`

Stops updates immediately and put the values at rest

#### `reconfigure(config: Config): void`

Updates the spring physics model.

### Example with `THREE.Vector3` that transitions a position.

```ts
import { springs } from "@pomle/tweens";

const NEAR = new THREE.Vector3(0, 100, 0);
const FAR = new THREE.Vector3(0, 1000, 0);

const position = new THREE.Vector3(0, 0, 0);

const tween = springs.vec3(position);
tween.set(FAR);
tween.to(NEAR);

function update(deltaTimeInSeconds: number) {
  tween.update(deltaTimeInSeconds);
}
```
