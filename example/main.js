import { spring } from './tween.js';

class Box {
  x = 0;
  y = 0;
  w = 64;
  h = 64;
}

class Circle {
  x = 0;
  y = 0;
  r = 8;
}

function createEngine(canvas) {
  const graphCanvas = document.createElement('canvas');
  graphCanvas.width = canvas.width;
  graphCanvas.height = 512;

  const box = new Box();
  const anchor = new Circle();

  const tween = spring({ x: 0, y: 0 });
  const graphSpring = spring({ x: 0 });

  function moveTo(x, y) {
    x = Math.round(x);
    y = Math.round(y);

    anchor.x = x;
    anchor.y = y;

    tween.to({
      x,
      y,
    });
  }

  function handlePointer(event) {
    if (event.buttons === 1) {
      moveTo(event.offsetX, event.offsetY);
    }
  }

  moveTo(canvas.width / 2, canvas.height / 2);

  canvas.addEventListener('pointermove', handlePointer);
  canvas.addEventListener('pointerdown', handlePointer);

  const config = {
    stiffness: undefined,
    mass: undefined,
    friction: undefined,
    precision: 0.01,
  };

  function configure(input) {
    const name = input.name;
    const value = parseFloat(input.value);

    config[name] = value;

    console.debug('Setting config', name, value);
  }

  function applyConfig() {
    tween.reconfigure(config);

    console.debug('Applying config', config);

    drawGraph(graphCanvas);
    drawSimulation();

    output();
  }

  function output() {
    const code = `const config = {
  friction: ${config.friction},
  mass: ${config.mass},
  stiffness: ${config.stiffness},
  precision: ${config.precision},
};

const position = spring({x: 0, y: 0}, config);
position.to({
  x: ${anchor.x.toFixed(2)},
  y: ${anchor.y.toFixed(2)},
});
`;

    document.getElementById('code').textContent = code;

    const console = `Position
X: ${box.x}
Y: ${box.y}
`;

    document.getElementById('console').textContent = console;
  }

  document.querySelectorAll('.config').forEach((input) => {
    input.addEventListener('input', (event) => {
      configure(event.target);
      applyConfig();
    });

    configure(input);
  });

  document.querySelectorAll('.preset').forEach((button) => {
    const props = Object.keys(config);
    button.addEventListener('click', (event) => {
      for (const prop of props) {
        const value = event.target.dataset[prop];
        if (isFinite(value)) {
          const input = document.querySelector(`.config[name=${prop}]`);
          if (input) {
            input.value = value;
            configure(input);
          }
        }
      }
      applyConfig();
    });
  });

  applyConfig();

  let lastTime = 0;
  let deltaTime = 0;

  function update(time) {
    deltaTime = (time - lastTime) / 1000;

    if (tween.update(deltaTime)) {
      box.x = tween.value.x;
      box.y = tween.value.y;

      drawSimulation();

      output();
    }

    lastTime = time;

    window.requestAnimationFrame(update);
  }

  function drawGraph(canvas) {
    const tween = spring({ x: 0 }, config);
    tween.to({ x: canvas.height });

    const values = [0];

    while (tween.update(1 / 60)) {
      values.push(tween.value.x);
      if (values.length >= 1000) {
        break;
      }
    }

    console.log(values.length);

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    context.moveTo(0, 0);
    for (let index = 1; index < values.length; index++) {
      const p = values[index];
      const x = index / values.length;
      context.lineTo(x * canvas.width, p / 3);
    }
    context.strokeStyle = '#fff';
    context.stroke();
  }

  function drawSimulation() {
    const context = canvas.getContext('2d');

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.drawImage(graphCanvas, 0, 400);

    context.fillStyle = '#000';
    context.fillRect(box.x - box.w / 2, box.y - box.h / 2, box.w, box.h);

    context.beginPath();
    context.moveTo(box.x, box.y);
    context.lineTo(anchor.x, anchor.y);
    context.strokeStyle = '#888';
    context.stroke();

    context.beginPath();
    context.arc(anchor.x, anchor.y, anchor.r, 0, 2 * Math.PI, false);
    context.fillStyle = '#f00';
    context.fill();
  }

  window.requestAnimationFrame(update);
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.querySelector('canvas');
  createEngine(canvas);
});
