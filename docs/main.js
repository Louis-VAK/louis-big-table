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

// ------------------ States ------------------
let MODE = "TREE"; // TREE / GALLERY
let galleryRotation = 0;

let palmCount = 0;
let fistCount = 0;

let lockUntil = 0;

document.getElementById("startBtn").onclick = () => {
  startHandTracking();
  lockUntil = performance.now() + 1500; // 啟動後 1.5 秒不接受切換
};


// ---------------------- Animation -----------------------
function animate() {
  requestAnimationFrame(animate);

  const now = performance.now();
  const hd = window.handData;
  let hand = hd?.pos;

  const isPalm = hd?.gesture === "PALM";
  const isFist = hd?.gesture === "FIST";

  // -------- 防抖（Debounce）-----------
  if (isPalm) {
    palmCount++;
    fistCount = 0;
  }
  else if (isFist) {
    fistCount++;
    palmCount = 0;
  }
  else {
    palmCount = 0;
    fistCount = 0;
  }

  const PALM_STABLE = palmCount >= 20;  // 約 0.6 秒
  const FIST_STABLE = fistCount >= 15;  // 約 0.45 秒


  // ============================================================
  //  A 模組：樹 + 掛飾（正常狀態）
  // ============================================================
  if (MODE === "TREE") {

    // ------ 進入相簿模式( Palm Open ) ------
    if (PALM_STABLE && now > lockUntil) {
      MODE = "GALLERY";
      lockUntil = now + 800;

      layoutGallery(ornaments, 2.3, 2.0);
      tree.material.transparent = true;
      tree.material.opacity = 0.15;
    }

    // ------ 手勢左右控制樹旋轉 + 掛飾同步 ------
    if (hand) {
      const rot = (hand.x - 0.5) * 3;
      tree.rotation.y = rot;
      ornamentGroup.rotation.y = rot;
    }

    // ------ 樹爆散控制（掛飾不爆散） ------
    let dist = hand ? 1 - hand.y : 0;
    let explosion = Math.pow(dist, 2.2) * 3.3;

    for (let i = 0; i < pos.length; i += 3) {
      pos[i]     = original[i]     * (1 + explosion);
      pos[i + 1] = original[i + 1] * (1 + explosion);
      pos[i + 2] = original[i + 2] * (1 + explosion);
    }

    geom.attributes.position.needsUpdate = true;
  }


  // ============================================================
  //  B 模組：相簿模式
  // ============================================================
  else if (MODE === "GALLERY") {

    // ------ 手勢左右旋轉整個相簿 ------
    if (hand) {
      let spin = (hand.x - 0.5) * 2;
      ornamentGroup.rotation.y += spin * 0.025;
    }

    // ------ 拳頭（FIST） → 回到 A 模組 ------
    if (FIST_STABLE && now > lockUntil) {
      MODE = "TREE";
      lockUntil = now + 800;

      // 還原掛飾位置
      layoutNormal();

      tree.material.opacity = 1.0;
    }
  }

  renderer.render(scene, camera);
}

animate();
