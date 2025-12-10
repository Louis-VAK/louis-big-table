// -----------------------------------------------------
// 基本場景設定
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
// 建立聖誕樹與原始位置
// -----------------------------------------------------
const tree = createTree(scene);
const geom = tree.geometry;
const pos = geom.attributes.position.array;
const original = geom.userData.originalPositions;

// -----------------------------------------------------
// B 模組（相簿模式）圖片物件（ornaments.js 建立）
// -----------------------------------------------------
let ornamentGroup = createOrnaments(scene); // 預設建立 → A 模組時會縮小隱藏
let currentState = "A"; // A = 樹模式（預設） / B = 相簿模式

// -----------------------------------------------------
// 手勢狀態變數
// -----------------------------------------------------
window.handPos = null;
window.handGesture = "none";   // palm / fist / pinch …（hand.js 提供）
window.handZ = 1;              // 手的向前距離（hand.js 提供）

let palmOpenTime = 0;          // 用於避免誤觸 B 模組
const PALM_THRESHOLD = 0.40;   // 手掌需連續 0.4 秒才切 B

// -----------------------------------------------------
// 啟動手勢追蹤
// -----------------------------------------------------
document.getElementById("startBtn").onclick = () => {
  startHandTracking();
};

// -----------------------------------------------------
// A 模組：粒子爆散 + 圖片微調模式
// -----------------------------------------------------
function updateAMode() {
  // 手勢左右：旋轉樹
  if (window.handPos) {
    const tx = (window.handPos.x - 0.5) * 2;
    tree.rotation.y = tx * 2.5;
  }

  // 手勢上下：爆散強度
  const dist = window.handPos ? (1 - window.handPos.y) : 0;
  const explosion = Math.pow(dist, 2.2) * 3.2;

  for (let i = 0; i < pos.length; i += 3) {
    const ox = original[i];
    const oy = original[i + 1];
    const oz = original[i + 2];

    pos[i]     = ox * (1 + explosion);
    pos[i + 1] = oy * (1 + explosion);
    pos[i + 2] = oz * (1 + explosion);
  }

  geom.attributes.position.needsUpdate = true;

  // A 模組的圖片要靠樹 → 小、隨樹旋轉
  applyAStateOrnaments(ornamentGroup, tree.rotation.y);
}

// -----------------------------------------------------
// B 模組：相簿旋轉模式
// -----------------------------------------------------
function updateBMode() {
  // 保持手掌全開才能維持 B 模組
  if (window.handGesture === "palm") {
    // 左右旋轉控制相簿
    if (window.handPos) {
      const tx = (window.handPos.x - 0.5) * 2;
      ornamentGroup.rotation.y = tx * 2.5;
    }
  }

  // 切回 A 模組條件：手接近相機（Z < 0.28）
  if (window.handZ < 0.28) {
    currentState = "A";
    applyAStateOrnaments(ornamentGroup, tree.rotation.y);
  }

  applyBStateOrnaments(ornamentGroup);
}

// -----------------------------------------------------
// 主動畫迴圈
// -----------------------------------------------------
function animate() {
  requestAnimationFrame(animate);

  // ================================
  // A → B 的切換（需手掌全開 0.4 秒）
  // ================================
  if (currentState === "A") {
    if (window.handGesture === "palm") {
      palmOpenTime += 0.016; // 每 frame 約 0.016 秒
      if (palmOpenTime >= PALM_THRESHOLD) {
        currentState = "B";
      }
    } else {
      palmOpenTime = 0;
    }
  }

  // ================================
  // 執行兩個模式的邏輯
  // ================================
  if (currentState === "A") {
    updateAMode();
  } else {
    updateBMode();
  }

  renderer.render(scene, camera);
}

animate();
