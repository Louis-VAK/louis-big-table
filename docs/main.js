// main.js
// --------------------------------------------------

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

// -------------------------
// 🎄 Tree
// -------------------------
const tree = createTree(scene);
const geom = tree.geometry;
const pos = geom.attributes.position.array;
const original = geom.userData.originalPositions;

// -------------------------
// 🎁 Ornaments
// -------------------------
createOrnaments(scene);

// -------------------------
// ⭐ 新增：手是否已被偵測
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

  // ⭐ 更新 hasHand 狀態
  if (window.handPos) {
    window.hasHand = true;
  }

  // -------------------------
  // 只有「偵測到手」才允許爆散
  // -------------------------
  if (window.hasHand && window.handPos) {
    const tx = (window.handPos.x - 0.5) * 2;
    tree.rotation.y = tx * 2.5;

    const dist = 1 - window.handPos.y;
    explosion = Math.pow(dist, 2.2) * 3.5;
  }

  // -------------------------
  // 粒子爆散（若無手 → 完全不爆散）
  // -------------------------
  let factor = window.hasHand ? 1 + explosion : 1;

  for (let i = 0; i < pos.length; i += 3) {
    pos[i]     = original[i] * factor;
    pos[i + 1] = original[i + 1] * factor;
    pos[i + 2] = original[i + 2] * factor;
  }

  geom.attributes.position.needsUpdate = true;

  // -------------------------
  // 更新圖片（傳入 hasHand）
  // -------------------------
  updateOrnaments(explosion, window.handPos, window.hasHand);

  renderer.render(scene, camera);
}

animate();
