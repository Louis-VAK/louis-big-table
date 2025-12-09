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

// 建立 3D 聖誕樹
const tree = createTree(scene);

// 手勢啟動
document.getElementById("startBtn").onclick = async () => {
  await startHandTracking();
};

// 動畫迴圈
function animate() {
  requestAnimationFrame(animate);

  if (handPos) {
    // 手勢控制旋轉（簡易版本）
    const tx = (handPos.x - 0.5) * 2;
    tree.rotation.y = tx * 2.5;
  }

  renderer.render(scene, camera);
}

animate();
