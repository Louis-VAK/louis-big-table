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

// ⭐ 初始化飾品
createOrnaments(scene, geom);

// 🖐 開啟手勢
document.getElementById("startBtn").onclick = () => startHandTracking();

// =====================================================
// 🎉 主動畫迴圈
// =====================================================
function animate() {
  requestAnimationFrame(animate);

  let rotationY = 0;
  let explosion = 0;

  if (window.handPos) {
    rotationY = (window.handPos.x - 0.5) * 2.5;
    tree.rotation.y = rotationY;

    const dist = 1 - window.handPos.y;
    explosion = Math.pow(dist, 2.2) * 3.5;
  }

  // 粒子爆散
  for (let i = 0; i < pos.length; i += 3) {
    const ox = original[i];
    const oy = original[i + 1];
    const oz = original[i + 2];

    pos[i]     = ox * (1 + explosion);
    pos[i + 1] = oy * (1 + explosion);
    pos[i + 2] = oz * (1 + explosion);
  }

  geom.attributes.position.needsUpdate = true;

  // ⭐ 更新飾品狀態
  updateOrnaments(explosion, rotationY);

  // ⭐ OK 手勢 → 放大最近飾品
  if (window.okGesture === true) {
    enlargeClosestOrnament(camera);
    window.okGesture = false;
  }

  renderer.render(scene, camera);
}

animate();
