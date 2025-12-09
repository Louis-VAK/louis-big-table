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

// 🎄 Tree
const tree = createTree(scene);
const geom = tree.geometry;
const pos = geom.attributes.position.array;
const original = geom.userData.originalPositions;

// -------------------------
// 🖐︎ 手勢啟動
// -------------------------
document.getElementById("startBtn").onclick = () => {
  startHandTracking();
};

// -------------------------
// 🎉 動畫（爆散 + 聚合）
// -------------------------
function animate() {
  requestAnimationFrame(animate);

  // 手勢控制旋轉
  if (window.handPos) {
    const tx = (window.handPos.x - 0.5) * 2;
    tree.rotation.y = tx * 2.5;
  }

  // ⭐ 粒子爆散效果
  const dist = window.handPos ? (1 - window.handPos.y) : 0;
  // handPos.y 越小 → 手越高 → 爆散越強

  const explosion = dist * 1.5; // 爆散強度（可調）

  for (let i = 0; i < pos.length; i += 3) {
    const ox = original[i];
    const oy = original[i + 1];
    const oz = original[i + 2];

    // 爆散方向（從中心向外）
    const dx = ox;
    const dy = oy;
    const dz = oz;

    pos[i] = ox + dx * explosion;
    pos[i + 1] = oy + dy * explosion;
    pos[i + 2] = oz + dz * explosion;
  }

  geom.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();
