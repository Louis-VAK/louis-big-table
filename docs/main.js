import { startHandTracking, handPos } from "./hand.js";

const canvas = document.getElementById("scene");

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(devicePixelRatio);

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 4);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --------------------------------------
// 粒子聖誕樹資料生成
// --------------------------------------

function createTreePoints() {
  const count = 4800;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const h = Math.random() * 2.5;   // 樹高
    const r = (2.5 - h) * 0.7;       // 樹半徑逐層縮小
    const theta = Math.random() * Math.PI * 2;

    positions[i * 3] = Math.cos(theta) * r;
    positions[i * 3 + 1] = h - 1.2;  // 移到場景中間
    positions[i * 3 + 2] = Math.sin(theta) * r;

    sizes[i] = 6 + Math.random() * 8;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader: await (await fetch("./shaders/treeVertex.glsl")).text(),
    fragmentShader: await (await fetch("./shaders/treeFragment.glsl")).text(),
    uniforms: {
      uTime: { value: 0 }
    },
    transparent: true
  });

  const points = new THREE.Points(geo, material);
  scene.add(points);

  return points;
}

let tree = await createTreePoints();

// --------------------------------------
// Raycaster（手勢 → 3D互動）
// --------------------------------------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function updateHandRay() {
  if (!handPos) return;

  pointer.x = handPos.x * 2 - 1;
  pointer.y = -(handPos.y * 2 - 1);

  raycaster.setFromCamera(pointer, camera);
}


// --------------------------------------
// Animation Loop
// --------------------------------------
function animate(t) {
  requestAnimationFrame(animate);

  updateHandRay();

  // 粒子樹動畫
  tree.material.uniforms.uTime.value = t * 0.001;

  controls.update();
  renderer.render(scene, camera);
}

animate();

document.getElementById("startBtn").onclick = async () => {
  await startHandTracking();
  document.getElementById("startBtn").style.display = "none";
};
