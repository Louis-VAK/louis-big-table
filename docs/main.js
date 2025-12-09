// main.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

import { initHandTracking } from "./hand-tracking.js";
import { createParticleTree, updateParticles } from "./particles.js";
import { createOrnaments, updateOrnaments } from "./ornaments.js";

const canvas = document.getElementById("webgl");
const video = document.getElementById("webcam");
const startBtn = document.getElementById("start-btn");
const startContainer = document.getElementById("start-container");

// ---------------- Camera ----------------
const scene = new THREE.Scene();
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

// ---------------- Create Objects ----------------
createParticleTree(scene);
createOrnaments(scene);

// ---------------- Start Button ----------------
startBtn.addEventListener("click", async () => {
  startContainer.style.display = "none";
  canvas.style.display = "block";

  // 啟動鏡頭 + 手勢追蹤
  initHandTracking(video);
});

// ---------------- Animation Loop ----------------
function animate() {
  requestAnimationFrame(animate);

  updateParticles();
  updateOrnaments();

  renderer.render(scene, camera);
}

animate();

// ---------------- Resize ----------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
