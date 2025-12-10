// main.js
// --------------------------------------------------

const canvas = document.getElementById("scene");

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000");

// Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.5, 5);

// Orbit controls（滑鼠用）
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// -------------------------
// 🎄 Tree (Points)
// -------------------------
const tree = createTree(scene);
const geom = tree.geometry;
const pos = geom.attributes.position.array;
const original = geom.userData.originalPositions;

// -------------------------
// 🎁 Ornaments（圖片）
// -------------------------
createOrnaments(scene);

// -------------------------
// ✋ Mediapipe 狀態
// -------------------------
window.hasHand = false;

// -------------------------
document.getElementById("startBtn").onclick = () => {
  startHandTracking();
};

// -------------------------
function animate() {
  requestAnimationFrame(animate);

  let explosion = 0;

  // ⭐ 偵測是否有手
  if (window.handPos) {
    window.hasHand = true;
  }

  // ⭐ 有手才啟動手勢 / 爆散
  if (window.hasHand && window.handPos) {
    const tx = (window.handPos.x - 0.5) * 2;
    tree.rotation.y = tx * 2.5;

    const dist = 1 - window.handPos.y;
    explosion = Math.pow(dist, 2.2) * 3.5;
  }

  // ⭐ 粒子爆散
  const factor = window.hasHand ? (1 + explosion) : 1;

  for (let i = 0; i < pos.length; i += 3) {
    pos[i]     = original[i]     * factor;
    pos[i + 1] = original[i + 1] * factor;
    pos[i + 2] = original[i + 2] * factor;
  }

  geom.attributes.position.needsUpdate = true;

  // ⭐ 更新飾品
  updateOrnaments(explosion, window.handPos, window.hasHand, tree);

  renderer.render(scene, camera);
}

animate();
