import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js";

import { startHandTracking, handPos } from "./hand.js";
import { createTree } from "./tree.js";

// 取得 canvas
const canvas = document.getElementById("scene");

// 建立 Renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 建立 Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#000");

// 建立 Camera
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.5, 5);

// 加入 OrbitControls（支援滑鼠旋轉）
const controls = new OrbitControls(camera, renderer.domElement);

// 建立 3D 聖誕樹
const tree = createTree(scene);

// 手勢啟動按鈕
document.getElementById("startBtn").onclick = async () => {
  console.log("Start hand tracking...");
  await startHandTracking();
  console.log("Hand tracking started!");
};

// 每秒更新畫面
function animate() {
  requestAnimationFrame(animate);

  // 若偵測到手勢點
  if (handPos) {
    const tx = (handPos.x - 0.5) * 2; // -1 ~ +1
    tree.rotation.y = tx * 2.5;       // 控制旋轉
  }

  renderer.render(scene, camera);
}

animate();

// 視窗縮放處理
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});
