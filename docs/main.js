//--------------------------------------------------------------
// 主 3D 聖誕樹互動控制 + 手勢追蹤（最終版）
//--------------------------------------------------------------

import { HandTracker } from "./lib/mediapipe_hands.js";
import { createParticles, updateParticles } from "./particles.js";
import { createOrnaments, updateOrnaments } from "./ornaments.js";

//--------------------------------------------------------------
// Canvas Scene 初始化
//--------------------------------------------------------------

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = createParticles(canvas);
let ornaments = createOrnaments(canvas);

// 手勢資料（21 個點）
let handLandmarks = null;

//--------------------------------------------------------------
// 啟動手勢追蹤
//--------------------------------------------------------------

const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", async () => {

    // 啟動鏡頭 + 手勢
    const tracker = new HandTracker({
        onResults: (r) => {
            if (!r.multiHandLandmarks) {
                handLandmarks = null;
                return;
            }
            handLandmarks = r.multiHandLandmarks[0];
        }
    });

    await tracker.start();

    startBtn.style.display = "none";
});

//--------------------------------------------------------------
// 主畫面渲染迴圈
//--------------------------------------------------------------

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const handPos = handLandmarks
        ? handLandmarks[9] // 中間最穩的點（食指根部 MCP）
        : null;

    //--------------------------------------------
    // 粒子互動 → 手靠近會推開
    //--------------------------------------------
    updateParticles(ctx, particles, handPos);

    //--------------------------------------------
    // 聖誕樹飾品互動 → 手靠近放大
    //--------------------------------------------
    updateOrnaments(ctx, ornaments, handPos);

    requestAnimationFrame(render);
}

render();
