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
const ornamentGroup = createOrnaments(scene);

// -------------------------
// 🖐︎ 啟動手勢
// -------------------------
document.getElementById("startBtn").onclick = () => {
  startHandTracking();
};

// -------------------------
// 🎉 主動畫（旋轉 + 爆散 + 飾品同步）
// -------------------------
function animate() {
  requestAnimationFrame(animate);

  // 1. 左右旋轉
  let explosion = 0;

  if (window.handPos) {
    const tx = (window.handPos.x - 0.5) * 2;
    tree.rotation.y = tx * 2.5;

    // 手越高 → 爆散越強
    const dist = 1 - window.handPos.y;
    explosion = Math.pow(dist, 2.2) * 3.5;
  }

  // 2. 粒子爆散
  for (let i = 0; i < pos.length; i += 3) {
    const ox = original[i];
    const oy = original[i + 1];
    const oz = original[i + 2];

    pos[i]     = ox * (1 + explosion);
    pos[i + 1] = oy * (1 + explosion);
    pos[i + 2] = oz * (1 + explosion);
  }
  geom.attributes.position.needsUpdate = true;

  // 3. 更新飾品邏輯（散開 + OK 手勢）
  updateOrnaments(explosion, window.handPos);

  renderer.render(scene, camera);
}

animate();
