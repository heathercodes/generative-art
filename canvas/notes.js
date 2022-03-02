const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: 'A4', // or [ 16, 10 ] for instance, which follows the unit you set below
  // you can use [2048, 2048] without any unit sets, for IG
  orientation: 'landscape',
  units: 'cm',
  pixelsPerInch: 300 // common for print design. 72 is default
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'orange';
    context.fillRect(0, 0, width, height);

    context.beginPath();
    context.arc(width / 2, height / 2, width * 0.2, 0, Math.PI * 2, false);
    context.fillStyle = 'red';
    context.fill();
    context.lineWidth = width * 0.04; // use the width instead of hardcoded values. Keeps the aspect ratio
    context.strokeStyle = 'blue';
    context.stroke();
  };
};

canvasSketch(sketch, settings);
