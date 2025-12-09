//--------------------------------------------------------------
// 主 3D 聖誕樹互動控制 + 手勢追蹤（Tracking.js 版本）
//--------------------------------------------------------------

import { createParticles, updateParticles } from "./particles.js";
import { createOrnaments, updateOrnaments } from "./ornaments.js";
import { handPos, startHandTracking } from "./hand.js";

//--------------------------------------------------------------
// Canvas Scene 初始化
//--------------------------------------------------------------

const canvas = document.getElementById("scene");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 粒子與飾品初始化
let particles = createParticles(canvas);
let ornaments = createOrnaments(canvas);

//--------------------------------------------------------------
// Start Interaction 按鈕事件
//--------------------------------------------------------------

const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
    // 建立鏡頭 video
    const video = document.createElement("video");
    video.setAttribute("autoplay", true);
    video.setAttribute("playsinline", true);
    video.style.display = "none";
    document.body.appendChild(video);

    // 啟動手勢追蹤
    startHandTracking(video);

    // 隱藏按鈕
    startBtn.style.display = "none";
});

//--------------------------------------------------------------
// 主畫面渲染
//--------------------------------------------------------------

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //--------------------------------------------
    // 粒子互動（距離手掌越近 → 排斥越強）
    //--------------------------------------------
    updateParticles(ctx, particles, handPos);

    //--------------------------------------------
    // 飾品互動（靠近 → 緩慢放大）
    //--------------------------------------------
    updateOrnaments(ctx, ornaments, handPos);

    requestAnimationFrame(render);
}

render();
