// main.js
import { startHandTracking, handPos } from "./hand.js";
import { createParticles, updateParticles } from "./particles.js";
import { createOrnaments, updateOrnaments } from "./ornaments.js";

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = createParticles(canvas);
let ornaments = await createOrnaments(canvas);

document.getElementById("startBtn").addEventListener("click", () => {
  startHandTracking();
  document.getElementById("startBtn").style.display = "none";
});

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateParticles(ctx, particles, handPos);
  updateOrnaments(ctx, ornaments, handPos);

  requestAnimationFrame(render);
}
render();
