const canvasSketch = require('canvas-sketch');
const { lerp } = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');

const settings = {
  dimensions: [2048, 2048]
};

const sketch = () => {
  const colorCount = random.rangeFloor(2, 6);
  const palette = random.shuffle(
    random.pick(palettes)
  ).slice(0, colorCount);

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
        const radius = Math.abs(random.noise2D(u, v)) * 0.1;
        const rotation = random.noise2D(u, v);

        points.push({
          color: random.pick(palette),
          radius,
          position: [ u, v],
          rotation
        });
      }
    }
    return points;
  }

  const points = createGrid().filter(() => random.value() > 0.5);
  const margin = 300;

  return ({ context, width, height }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    points.forEach(data => {
      const {
        position,
        radius,
        color,
        rotation
      } = data;
      const [ u, v ] = position;
      // scale these back up to pixel space, but account for margin against the canvas
      const x = lerp(margin, width - margin, u);
      const y = lerp(margin, height - margin, v);

      context.save()
      context.fillStyle = color;
      context.font = `${radius * width}px "Georgia"`;
      context.translate(x, y);
      context.rotate(rotation);
      context.fillText('__', 0, 0);
      context.restore();
    });
  };
};

canvasSketch(sketch, settings);
