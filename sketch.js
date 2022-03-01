const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const createGrid = () => {
    const points = [];
    const count = 40;

    for (let x = 0; x < count; x++) {
      for (let y = 0; y < count; y++) {
        const deriveUVSpace = (coord) => count <= 1 ? 0.5 : coord / (count - 1);
        // u v space is the value between 0 and 1
        // top left is 0,0 / bottom right is 1,1
        const u = deriveUVSpace(x);
        const v = deriveUVSpace(y);
        points.push({
          radius: Math.max(0, random.gaussian() * 0.01),
          position: [ u, v]
        });
      }
    }
    return points;
  }

  random.setSeed(512);
  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 400;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius
      } = data;
      const [ u, v ] = position;
      // scale these back up to pixel space, but account for margin against the canvas
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.beginPath();
      context.arc(x, y, radius * width, 0, Math.PI * 2, false);
      context.fillStyle = 'red';
      context.fill();
    });
  };
};

canvasSketch(sketch, settings);
