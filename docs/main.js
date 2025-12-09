import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const canvas = document.getElementById("webgl");
const scene = new THREE.Scene();

// =================== Camera ===================
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  50
);
camera.position.set(0, 1.5, 5);

// =================== Renderer ===================
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);

// =================== Particle Tree ===================
const particleCount = 3500;
const geo = new THREE.BufferGeometry();
const pos = new Float32Array(particleCount * 3);

// 圓錐型的樹形狀
function treeRadius(h) {
  return (2.5 - h) * 0.4; // 樹越高半徑越小
}

for (let i = 0; i < particleCount; i++) {
  const h = Math.random() * 2.8;
  const r = treeRadius(h);
  const a = Math.random() * Math.PI * 2;

  pos[i * 3] = Math.cos(a) * r;
  pos[i * 3 + 1] = h;
  pos[i * 3 + 2] = Math.sin(a) * r;
}

geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

const mat = new THREE.PointsMaterial({
  color: 0x66ffee,
  size: 0.025
});

const tree = new THREE.Points(geo, mat);
scene.add(tree);

// =================== Breathing Motion ===================
let t = 0;

// =================== Mouse Pointer ===================
const mouse = new THREE.Vector2();
window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// 將滑鼠轉成世界座標（深度 = 2.2 貼近樹表面）
const mouseWorld = new THREE.Vector3();
const raycaster = new THREE.Raycaster();

function updateMouseWorld() {
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.at(2.2, mouseWorld);
}

// =================== Sprite Ornaments ===================
const spriteGroup = new THREE.Group();
scene.add(spriteGroup);

const loader = new THREE.TextureLoader();
const imgSrc = [
  "./assets/img1.png",
  "./assets/img2.png",
  "./assets/img3.png",
  "./assets/img4.png",
  "./assets/img5.png",
  "./assets/img6.png"
];

// 生成「隨機不重疊」飾品位置
function generateRandomSurfacePoint() {
  let h = Math.random() * 2.6 + 0.1;
  let r = treeRadius(h);
  let a = Math.random() * Math.PI * 2;

  return new THREE.Vector3(
    Math.cos(a) * r,
    h,
    Math.sin(a) * r
  );
}

// 確保不重疊（距離 > 0.8）
function isFarFromOthers(p, list) {
  return list.every(v => p.distanceTo(v) > 0.8);
}

// 放置 6 個飾品
let ornamentPositions = [];
for (let i = 0; i < 6; i++) {
  let p;
  do {
    p = generateRandomSurfacePoint();
  } while (!isFarFromOthers(p, ornamentPositions));

  ornamentPositions.push(p);
}

imgSrc.forEach((src, i) => {
  const tex = loader.load(src);
  const sm = new THREE.SpriteMaterial({ map: tex });
  const s = new THREE.Sprite(sm);

  s.scale.set(1, 1, 1);

  const p = ornamentPositions[i];
  s.position.copy(p);

  s.userData.baseScale = 1;

  spriteGroup.add(s);
});

// =================== Animation Loop ===================
function animate() {
  requestAnimationFrame(animate);

  updateMouseWorld();
  t += 0.01;

  // ----- Breathing movement -----
  const arr = tree.geometry.attributes.position;
  for (let i = 0; i < arr.count; i++) {
    let x = pos[i * 3];
    let y = pos[i * 3 + 1];
    let z = pos[i * 3 + 2];

    // 微微上下呼吸
    let wave = Math.sin(t + x * 2 + z * 2) * 0.005;

    arr.setXYZ(i, x, y + wave, z);
  }
  arr.needsUpdate = true;

  // ----- Push particles away -----
  for (let i = 0; i < arr.count; i++) {
    let x = arr.getX(i);
    let y = arr.getY(i);
    let z = arr.getZ(i);

    let v = new THREE.Vector3(x, y, z);

    let dist = v.distanceTo(mouseWorld);

    if (dist < 0.6) {
      let push = v.clone()
        .sub(mouseWorld)
        .normalize()
        .multiplyScalar((0.6 - dist) * 0.05);

      arr.setXYZ(i, x + push.x, y + push.y, z + push.z);
    }
  }
  arr.needsUpdate = true;

  // ----- Hover ornament -----
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(spriteGroup.children);

  spriteGroup.children.forEach(s => {
    s.scale.set(1, 1, 1);
  });

  hits.forEach(hit => {
    hit.object.scale.set(1.6, 1.6, 1);
  });

  renderer.render(scene, camera);
}

animate();

// =================== Resize ===================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
