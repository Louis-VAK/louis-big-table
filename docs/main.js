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

// ------------------ Button ------------------
document.getElementById("startBtn").onclick = () => startHandTracking();

// ------------------ Animation Loop ------------------
function animate() {
  requestAnimationFrame(animate);

  const hd = window.handData;
  let hand = hd?.pos;

  // ============== A 模組（TREE） =================
  if (MODE === "TREE") {

    // Palm Open → 切換相簿模式
    if (hd.gesture === "PALM") {
      MODE = "GALLERY";
      layoutGallery(ornaments, 2.3, 1.0); // 放大 4x（scale=1）
      tree.material.opacity = 0.15;
      tree.material.transparent = true;
    }

    // 旋轉
    if (hand) {
      tree.rotation.y = (hand.x - 0.5) * 3;
      ornamentGroup.rotation.y = tree.rotation.y;
    }

    // 爆散
    let dist = hand ? 1 - hand.y : 0;
    let explosion = Math.pow(dist, 2.2) * 3.5;

    for (let i = 0; i < pos.length; i += 3) {
      pos[i] = original[i] * (1 + explosion);
      pos[i + 1] = original[i + 1] * (1 + explosion);
      pos[i + 2] = original[i + 2] * (1 + explosion);
    }

    geom.attributes.position.needsUpdate = true;

    // 掛飾微爆散
    ornaments.forEach((sp) => {
      sp.position.multiplyScalar(1 + explosion * 0.15);
    });
  }

  // ============== B 模組（GALLERY） =================
  else if (MODE === "GALLERY") {
    // Fist → 回 TREE 模式
    if (hd.gesture === "FIST") {
      MODE = "TREE";
      tree.material.opacity = 1.0;
      layoutNormal(); // 還原掛飾位置（我會在下方補）
    }

    // 左右旋轉相簿
    if (hand) {
      galleryRotation = (hand.x - 0.5) * 2;
    }

    ornamentGroup.rotation.y += galleryRotation * 0.02;
  }

  renderer.render(scene, camera);
}

animate();

// ------------------ 掛飾回復 A 模式位置 ------------------
function layoutNormal() {
  ornaments.forEach((sp) => {
    sp.scale.set(0.25, 0.25, 1);
    sp.position.set(
      (Math.random() - 0.5) * 1.6,
      Math.random() * 1.8 - 0.2,
      Math.random() * 0.8 - 0.4
    );
  });
}
