// ------- 全域變數 -------
let scene, camera, renderer, controls;
let treeParticles, particleMaterial;
let clock = new THREE.Clock();

// ====== 初始化場景 ======
function init() {
  const canvas = document.getElementById("scene");

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 2, 6);

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // OrbitControls（你已經用 CDN 載入）
  controls = new THREE.OrbitControls(camera, renderer.domElement);

  createTree();
  animate();
}

// ====== 建立 3D 聖誕樹粒子 ======
function createTree() {
  const numParticles = 2500;
  const positions = [];
  const sizes = [];

  for (let i = 0; i < numParticles; i++) {
    const y = Math.random() * 3;
    const radius = 1.2 - y * 0.35;
    const angle = Math.random() * Math.PI * 2;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    positions.push(x, y - 1.5, z);
    sizes.push(Math.random() * 5 + 1);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

  particleMaterial = new THREE.PointsMaterial({
    color: 0x66ffff,
    size: 0.05,
    transparent: true,
    opacity: 0.9
  });

  treeParticles = new THREE.Points(geometry, particleMaterial);
  scene.add(treeParticles);
}

// ====== 動畫循環 ======
function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  treeParticles.rotation.y = t * 0.1;

  renderer.render(scene, camera);
  controls.update();
}

// ====== 啟動 ======
init();

// ====== 手勢資料接收（之後接 MediaPipe） ======
window.handPos = null; // 預留給手勢腳本寫入
