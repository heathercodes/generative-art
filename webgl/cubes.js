// Ensure ThreeJS is in global scope for the 'examples/'
global.THREE = require("three");

// Include any additional ThreeJS examples below
require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");
const palettes = require("nice-color-palettes");
const eases = require('eases');
const BezierEasing = require('bezier-easing');

const settings = {
  dimensions: [ 512, 512 ],
  fps: 24,
  duration: 4,
  // Make the loop animated
  animate: true,
  // Get a WebGL canvas rather than 2D
  context: "webgl",
  // give a soft edge to the mesh
  attributes: { antialias: true }
};

const sketch = ({ context }) => {
  // Create a renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  // WebGL background color, hex + alpha
  renderer.setClearColor("hsl(0, 0%, 95%)", 1);

  // Setup a camera
  const camera = new THREE.OrthographicCamera();

  // Setup your scene
  const scene = new THREE.Scene();

  const palette = random.pick(palettes);

  // Setup a geometry
  const geometry = new THREE.BoxGeometry(random.range(1, 2), random.range(1, 2), random.range(1, 2));

  for (let i = 0; i < 30; i++) {
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: random.pick(palette),
      })
    );
    mesh.position.set(
      random.range(-1, 1), random.range(-1, 1), random.range(-1, 1)
    )
    mesh.scale.set(
      random.range(-1, 1), random.range(-1, 1), random.range(-1, 1)
    )
    mesh.scale.multiplyScalar(0.5); // multiply this value by x,y,z
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight('hsl(0, 0%, 25%)'));
  const light = new THREE.DirectionalLight('white', 1);
  light.position.set(2, 4, 1)
  scene.add(light);

  const easeFn = BezierEasing('.17,.67,.99,.38');

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      const aspect = viewportWidth / viewportHeight;

      // Ortho zoom
      const zoom = 2.0;

      // Bounds
      camera.left = -zoom * aspect;
      camera.right = zoom * aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      // Near/Far
      camera.near = -100;
      camera.far = 100;

      // Set position & look at world center
      camera.position.set(zoom, zoom, zoom);
      camera.lookAt(new THREE.Vector3());

      // Update the camera
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ playhead }) {
      const t = Math.sin(playhead * Math.PI);
      scene.rotation.z = easeFn(t);
      scene.rotation.y = eases.quadInOut(t);
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
