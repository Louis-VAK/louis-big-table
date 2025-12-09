const canvas = document.getElementById("scene");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#000");

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.5, 5);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const tree = createTree(scene); // 來自 tree.js

document.getElementById("startBtn").onclick = () => {
  startHandTracking(); // 來自 hand.js
};

function animate() {
  requestAnimationFrame(animate);

  if (window.handPos) {
    const tx = (window.handPos.x - 0.5) * 2;
    tree.rotation.y = tx * 2.5;
  }

  renderer.render(scene, camera);
}

animate();
