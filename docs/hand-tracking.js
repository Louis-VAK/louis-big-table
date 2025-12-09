// 🔥 MediaPipe Hands — 正確可用版本（必須指定 @0.4）
import { Hands } from "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/hands.js";
import { Camera } from "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.4/camera_utils.js";

// 將手掌座標輸出給 main.js / particles.js / ornaments.js
export let handPosition3D = null;

// 啟動手勢追蹤
export function initHandTracking(videoElement) {

  const hands = new Hands({
    locateFile: (file) =>
      // 🔥 必須指定版本，否則 jsDelivr 在 GitHub Pages 會回 404
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`
  });

  hands.setOptions({
    selfieMode: true,
    maxNumHands: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
    modelComplexity: 1
  });

  // 接收 MediaPipe 的追蹤結果
  hands.onResults((results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      handPosition3D = null;
      return;
    }

    // 🔥 使用 landmark #9（手掌中心附近）最穩定
    const lm = results.multiHandLandmarks[0][9];

    handPosition3D = {
      x: lm.x * 2 - 1,          // 轉成 Three.js 的 NDC 座標
      y: -(lm.y * 2 - 1),
      z: lm.z                   // MediaPipe 的 z-depth（Z2 會在粒子程式內放大）
    };
  });

  // 啟動鏡頭
  const camera = new Camera(videoElement, {
    async onFrame() {
      await hands.send({ image: videoElement });
    },
    width: 640,
    height: 480
  });

  camera.start();
}
