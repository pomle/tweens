# Tween

A JavaScript and TypeScript lib for animating using spring physics tweens.

## Usage

All tweens follow the following pattern.

1. Setup
    ```ts
    const tween = springs.dimension({value: 0});
    tween.to(1);
    ```

2. Update & Read
    ```ts
    const value = tween.update(deltaTime)
    console.log(value)
    ```

3. GoTo 2

### Spring Config

Three factors control the behavior of a spring physics simulation.
```ts
const config = {
  stiffness: 25, // How strong is the spring
  mass: 10, // How heavy is the object
  friction: 5, // How thick is the medium the object travels in
};

const tween = springs.dimension({value: 0}, config);
```


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
