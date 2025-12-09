import { startHandTracking, handPos } from "./hand.js";
import { createParticles, updateParticles } from "./particles.js";
import { createOrnaments, updateOrnaments } from "./ornaments.js";

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = createParticles(canvas);
let ornaments = createOrnaments(canvas);

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("startBtn").style.display = "none";
  startHandTracking();
});

// 主渲染迴圈
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let hx = null;
  let hy = null;

  if (handPos) {
    // Mediapipe 是 0~1 座標 → 換成 canvas 座標
    hx = handPos.x * canvas.width;
    hy = handPos.y * canvas.height;
  }

  updateParticles(ctx, particles, { x: hx, y: hy });
  updateOrnaments(ctx, ornaments, { x: hx, y: hy });

  requestAnimationFrame(render);
}

render();
