// ----------------------------------------------------
// 主控制器：手勢 + 粒子 + 飾品渲染
// ----------------------------------------------------

import { startHandTracking, handPos } from "./hand.js";
import { createParticles, updateParticles } from "./particles.js";
import { createOrnaments, updateOrnaments } from "./ornaments.js";

// Canvas 初始化
const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 建立粒子與飾品
const particles = createParticles(canvas);
const ornaments = createOrnaments(canvas);

// 啟動手勢按鈕
document.getElementById("startBtn").addEventListener("click", async () => {
  await startHandTracking();
  document.getElementById("startBtn").style.display = "none";
});

// ----------------------------------------------------
// 主渲染迴圈
// ----------------------------------------------------
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 將 handPos（0~1）轉換成像素座標
  let hand = null;
  if (handPos) {
    hand = {
      x: handPos.x * canvas.width,
      y: handPos.y * canvas.height,
    };
  }

  // 手勢 → 粒子互動
  updateParticles(ctx, particles, hand);

  // 手勢 → 6 張圖片互動
  updateOrnaments(ctx, ornaments, hand);

  requestAnimationFrame(render);
}

render();
