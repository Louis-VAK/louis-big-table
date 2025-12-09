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

// Tree (Points)
const tree = createTree(scene);
const geom = tree.geometry;
const pos = geom.attributes.position.array;
const original = geom.userData.originalPositions;

// -------------------------
// 🖐︎ 啟動手勢追蹤
// -------------------------
document.getElementById("startBtn").onclick = () => {
  startHandTracking();
};

// -------------------------
// 🎉 主動畫（旋轉 + 爆散 + 聚合）
// -------------------------
function animate() {
  requestAnimationFrame(animate);

  // -------------------------
  // 1. 左右旋轉（x 手勢）
  // -------------------------
  if (window.handPos) {
    const tx = (window.handPos.x - 0.5) * 2; 
    tree.rotation.y = tx * 2.5;
  }

  // -------------------------
  // 2. 爆散 / 聚合（y 手勢）
  // -------------------------
  let explosion = 0;

  if (window.handPos) {
    // handPos.y 0 = 手高 → 爆散強
    // handPos.y 1 = 手低 → 聚合
    const dist = 1 - window.handPos.y;

    // ⭐ 明顯版：加入指數曲線改善手勢感度
    explosion = Math.pow(dist, 2.2) * 3.5;  
  }

  // 套用到每個粒子
  for (let i = 0; i < pos.length; i += 3) {
    const ox = original[i];
    const oy = original[i + 1];
    const oz = original[i + 2];

    // 指數型爆散 → 動作更大，更柔順
    pos[i]     = ox * (1 + explosion);
    pos[i + 1] = oy * (1 + explosion);
    pos[i + 2] = oz * (1 + explosion);
  }

  geom.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

animate();
