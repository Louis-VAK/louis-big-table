// -----------------------------------------------------
// 基本場景設定（回到最穩定版本）
// -----------------------------------------------------
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

// -----------------------------------------------------
// 建立聖誕樹（100% 正常版）
// -----------------------------------------------------
const tree = createTree(scene);
const geom = tree.geometry;
const pos = geom.attributes.position.array;
const original = geom.userData.originalPositions;

// -----------------------------------------------------
// 模式狀態
// -----------------------------------------------------
let mode = "A";  // A = 樹模式（預設） / B = 相簿模式
let palmTimer = 0;

// -----------------------------------------------------
// 啟動手勢追蹤
// -----------------------------------------------------
document.getElementById("startBtn").onclick = () => {
  startHandTracking();
};

// -----------------------------------------------------
// A 模組：粒子旋轉 + 爆散（保持你的原本邏輯）
// -----------------------------------------------------
function updateAMode() {
  // 左右旋轉（你原本的版本）
  if (window.handPos) {
    const tx = (window.handPos.x - 0.5) * 2;
    tree.rotation.y = tx * 2.5;
  }

  // 爆散
  let explosion = 0;
  if (window.handPos) {
    const dist = 1 - window.handPos.y;
    explosion = Math.pow(dist, 2.2) * 3.2;
  }

  for (let i = 0; i < pos.length; i += 3) {
    const ox = original[i];
    const oy = original[i + 1];
    const oz = original[i + 2];

    pos[i]     = ox * (1 + explosion);
    pos[i + 1] = oy * (1 + explosion);
    pos[i + 2] = oz * (1 + explosion);
  }

  geom.attributes.position.needsUpdate = true;
}

// -----------------------------------------------------
// B 模組（先留空，不影響 A 模組）
// -----------------------------------------------------
function updateBMode() {
  // 目前先不上邏輯，避免破壞 A 模組
  // 等 A 模組完全穩定再加相簿旋轉
}

// -----------------------------------------------------
// 模式切換（保留你要求的條件）
// -----------------------------------------------------
function handleModeSwitch() {

  // 只有在 A 模式才檢查是否切 B
  if (mode === "A") {
    if (window.handGesture === "palm") {
      palmTimer += 0.016;
      if (palmTimer > 0.4) {
        mode = "B";
        console.log(">>> 切換到 B 模組");
      }
    } else {
      palmTimer = 0;
    }
  }

  // B → A（手向前推）
  if (mode === "B") {
    if (window.handZ < 0.28) {
      mode = "A";
      console.log(">>> 切換回 A 模組");
    }
  }
}

// -----------------------------------------------------
// 主動畫迴圈（100% 可執行、安全）
// -----------------------------------------------------
function animate() {
  requestAnimationFrame(animate);

  handleModeSwitch();

  if (mode === "A") {
    updateAMode();
  } else {
    updateBMode();
  }

  renderer.render(scene, camera);
}

animate();
