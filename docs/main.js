const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#000");

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 5);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// ------------------ Tree ------------------
const tree = createTree(scene);
const geom = tree.geometry;
const pos = geom.attributes.position.array;
const original = geom.userData.originalPositions;

// ------------------ Ornaments ------------------
const { group: ornamentGroup, ornaments } = createOrnaments(scene);

// ------------------ App State ------------------
let MODE = "TREE"; // TREE / GALLERY
let galleryRotation = 0;

// Palm / Fist debounce counters
let palmCount = 0;
let fistCount = 0;

// 啟動後 1 秒內不接受模式切換
let lockUntil = 0;

// ------------------ Button ------------------
document.getElementById("startBtn").onclick = () => {
  startHandTracking();
  lockUntil = performance.now() + 1000; // 1 秒保護期間
};

// ------------------ Animation Loop ------------------
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const hd = window.handData;
  let hand = hd?.pos;

  // ============================================================
  //  手勢穩定偵測（0.5 秒 Palm / 0.3 秒 Fist）
  // ============================================================
  if (hd.gesture === "PALM") {
    palmCount++;
    fistCount = 0;
  } else if (hd.gesture === "FIST") {
    fistCount++;
    palmCount = 0;
  } else {
    palmCount = 0;
    fistCount = 0;
  }

  const PALM_STABLE = palmCount > 15; // Palm 0.5 秒
  const FIST_STABLE = fistCount > 10; // Fist 0.3 秒


  // ============================================================
  //  A 模組（樹 + 掛飾）
  // ============================================================
  if (MODE === "TREE") {

    // ------ Palm Open 切換到 B 模組 --------
    if (PALM_STABLE && now > lockUntil) {
      MODE = "GALLERY";
      lockUntil = now + 800; // 切換後再加 0.8 秒安全期

      layoutGallery(ornaments, 2.3, 2.0); // ⭐ 改成 2 倍大
      tree.material.opacity = 0.15;
      tree.material.transparent = true;
    }

    // 旋轉樹 & 掛飾
    if (hand) {
      tree.rotation.y = (hand.x - 0.5) * 3;
      ornamentGroup.rotation.y = tree.rotation.y;
    }

    // 爆散
    let dist = hand ? 1 - hand.y : 0;
    let explosion = Math.pow(dist, 2.2) * 3.5;

    for (let i = 0; i < pos.length; i += 3) {
      pos[i]     = original[i]     * (1 + explosion);
      pos[i + 1] = original[i + 1] * (1 + explosion);
      pos[i + 2] = original[i + 2] * (1 + explosion);
    }

    geom.attributes.position.needsUpdate = true;

    ornaments.forEach((sp) => {
      sp.position.multiplyScalar(1 + explosion * 0.15);
    });
  }

  // ============================================================
  //  B 模組（相簿模式）
  // ============================================================
  else if (MODE === "GALLERY") {

    // -------- FIST → 回到 TREE 模式 --------
    if (FIST_STABLE && now > lockUntil) {
      MODE = "TREE";
      lockUntil = now + 800;

      tree.material.opacity = 1.0;
      layoutNormal();
    }

    // 左右移動控制相簿旋轉
    if (hand) {
      galleryRotation = (hand.x - 0.5) * 2;
      ornamentGroup.rotation.y += galleryRotation * 0.02;
    }
  }

  renderer.render(scene, camera);
}

animate();
