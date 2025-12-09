// ============================================
// main.js — 主場景控制（Canvas 版本）
// ============================================

import { startHandTracking, handPos } from "./hand.js";
import { createParticles, updateParticles } from "./particles.js";
import { createOrnaments, updateOrnaments } from "./ornaments.js";

// 取得 canvas
const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 產生粒子（樹）
let particles = createParticles(canvas);

// 產生圖片飾品
let ornaments = await createOrnaments(canvas);

// 開始互動按鈕
document.getElementById("startBtn").addEventListener("click", () => {
  startHandTracking(); // 啟動鏡頭 + 手勢追蹤
  document.getElementById("startBtn").style.display = "none";
});

// --------------------------------------------
// 主渲染迴圈
// --------------------------------------------
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 粒子 → 被手推開
  updateParticles(ctx, particles, handPos);

  // 飾品 → 手靠近會放大
  updateOrnaments(ctx, ornaments, handPos);

  requestAnimationFrame(render);
}

render();
