import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const canvas = document.getElementById("webgl");
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 1.2, 5);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: false,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);

// ---- Particle Tree Geometry ----
const particleCount = 3500;
const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const radius = Math.random() * 1.2;
  const height = Math.random() * 2.5;
  const angle = Math.random() * Math.PI * 2;

  // Cone distribution
  positions[i * 3 + 0] = Math.cos(angle) * (radius * (1 - height / 3));
  positions[i * 3 + 1] = height;
  positions[i * 3 + 2] = Math.sin(angle) * (radius * (1 - height / 3));
}

particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0x66ffdd,
  size: 0.02,
});

const particleTree = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleTree);

// ---- Mouse Interaction Force ----
const mouse = new THREE.Vector2();
const forceStrength = 0.15;

window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// ---- Sprites (6 images) ----
const spriteGroup = new THREE.Group();
scene.add(spriteGroup);

const textureLoader = new THREE.TextureLoader();

// 6 張相簿圖片
const imagePaths = [
  "./assets/img1.png",
  "./assets/img2.png",
  "./assets/img3.png",
  "./assets/img4.png",
  "./assets/img5.png",
  "./assets/img6.png",
];

imagePaths.forEach((src, i) => {
  const tex = textureLoader.load(src);
  const mat = new THREE.SpriteMaterial({ map: tex });
  const sprite = new THREE.Sprite(mat);

  sprite.scale.set(1, 1, 1);
  sprite.position.set(Math.cos(i) * 2.2, 1.2, Math.sin(i) * 2.2);

  sprite.userData.baseScale = 1;

  spriteGroup.add(sprite);
});

// ---- Raycaster for hover scaling ----
const raycaster = new THREE.Raycaster();

// ---- Animation Loop ----
function animate() {
  requestAnimationFrame(animate);

  // --- 推開粒子 ---
  const pos = particleTree.geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const vector = new THREE.Vector3(x, y, z);
    const mouse3D = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);

    const dist = vector.distanceTo(mouse3D);

    if (dist < 0.3) {
      const push = vector
        .clone()
        .sub(mouse3D)
        .normalize()
        .multiplyScalar(forceStrength * (0.3 - dist));

      pos.setXYZ(i, x + push.x, y + push.y, z + push.z);
    }
  }
  pos.needsUpdate = true;

  // --- Sprite 旋轉 ---
  spriteGroup.rotation.y += 0.003;

  // --- Sprite 手勢偵測（放大） ---
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(spriteGroup.children);

  // Reset
  spriteGroup.children.forEach((sprite) => {
    sprite.scale.set(sprite.userData.baseScale, sprite.userData.baseScale, 1);
  });

  // Hover enlarge
  intersects.forEach((hit) => {
    hit.object.scale.set(1.6, 1.6, 1);
  });

  renderer.render(scene, camera);
}

animate();

// ---- Resize ----
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
