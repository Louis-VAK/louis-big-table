// ===============================
// 3D Gesture Christmas Tree (Core)
// ===============================

import { startHandTracking, handPos } from "./hand.js";

// ------------------------------
// Three.js 基本場景建立
// ------------------------------

const canvas = document.getElementById("scene");

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.6, 4);

// Controls（可先保留，方便調整場景）
const controls = new THREE.OrbitControls(camera, canvas);
controls.enableDamping = true;

// Light
const ambient = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambient);

const point = new THREE.PointLight(0xffffff, 1.5);
point.position.set(0, 3, 3);
scene.add(point);

// ------------------------------
// Load 3D Christmas Tree Model
// ------------------------------

let tree;

const loader = new THREE.GLTFLoader();
loader.load(
  "./models/tree.glb",
  (gltf) => {
    tree = gltf.scene;
    tree.scale.set(1.8, 1.8, 1.8);
    tree.position.set(0, -1, 0);
    scene.add(tree);
  },
  undefined,
  (err) => console.error("載入 tree.glb 發生錯誤:", err)
);

// ------------------------------
// Raycaster（手勢 → 3D 空間）
// ------------------------------

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// 將 MediaPipe 手勢轉成 3D Ray
function updateHandRay() {
  if (!handPos) return;

  // handPos.x, handPos.y 為 0~1
  pointer.x = handPos.x * 2 - 1;
  pointer.y = -(handPos.y * 2 - 1);

  raycaster.setFromCamera(pointer, camera);
}

// ------------------------------
// Animation Loop
// ------------------------------

function animate() {
  requestAnimationFrame(animate);

  controls.update();
  updateHandRay();

  renderer.render(scene, camera);
}

animate();

// ------------------------------
// Start
// ------------------------------

document.getElementById("startBtn").addEventListener("click", async () => {
  await startHandTracking();
  document.getElementById("startBtn").style.display = "none";
});
