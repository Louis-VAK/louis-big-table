import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const canvas = document.getElementById("webgl");
const scene = new THREE.Scene();

// ---------------- Camera ----------------
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  50
);
camera.position.set(0, 1.5, 5);

// ---------------- Renderer ----------------
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);

// ---------------- Particle Tree ----------------
const particleCount = 3000;
const geo = new THREE.BufferGeometry();
const pos = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  // 讓樹分佈更立體
  const h = Math.random() * 2.8;
  const r = (2.5 - h) * 0.4;  
  const a = Math.random() * Math.PI * 2;

  pos[i * 3] = Math.cos(a) * r;
  pos[i * 3 + 1] = h;
  pos[i * 3 + 2] = Math.sin(a) * r;
}

geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

const mat = new THREE.PointsMaterial({
  color: 0x55ffee,
  size: 0.03
});

const tree = new THREE.Points(geo, mat);
scene.add(tree);

// ---------------- Mouse Tracking ----------------
const mouse = new THREE.Vector2();
window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ---------------- Convert mouse to world position ----------------
const mouseWorld = new THREE.Vector3();

function updateMouseWorld() {
  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.at(2.5, mouseWorld); 
  // 讓互動點落在 Z ≈ 樹的位置
}

// ---------------- Sprite Album ----------------
const spriteGroup = new THREE.Group();
scene.add(spriteGroup);

const loader = new THREE.TextureLoader();
const imgs = [
  "./assets/img1.png",
  "./assets/img2.png",
  "./assets/img3.png",
  "./assets/img4.png",
  "./assets/img5.png",
  "./assets/img6.png"
];

imgs.forEach((src, i) => {
  const texture = loader.load(src);
  const sm = new THREE.SpriteMaterial({ map: texture });
  const s = new THREE.Sprite(sm);

  s.scale.set(1.2, 1.2, 1);
  const angle = i * (Math.PI * 2 / imgs.length);

  s.position.set(Math.cos(angle) * 2.5, 1.4, Math.sin(angle) * 2.5);
  spriteGroup.add(s);
});

const raycaster = new THREE.Raycaster();

// ---------------- Animation Loop ----------------
function animate() {
  requestAnimationFrame(animate);

  updateMouseWorld();

  const arr = tree.geometry.attributes.position;

  for (let i = 0; i < arr.count; i++) {
    const x = arr.getX(i);
    const y = arr.getY(i);
    const z = arr.getZ(i);

    const v = new THREE.Vector3(x, y, z);

    const dist = v.distanceTo(mouseWorld);

    if (dist < 0.6) {
      const push = v.clone()
        .sub(mouseWorld)
        .normalize()
        .multiplyScalar(0.05 * (0.6 - dist));
      arr.setXYZ(i, x + push.x, y + push.y, z + push.z);
    }
  }
  arr.needsUpdate = true;

  // rotate album
  spriteGroup.rotation.y += 0.004;

  // detect hover
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(spriteGroup.children);

  spriteGroup.children.forEach(s => s.scale.set(1.2, 1.2, 1));

  hits.forEach(hit => {
    hit.object.scale.set(1.9, 1.9, 1);
  });

  renderer.render(scene, camera);
}

animate();

// ---------------- Resize ----------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
