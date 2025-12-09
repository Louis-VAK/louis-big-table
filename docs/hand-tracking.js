// hand-tracking.js
// Mediapipe Hands (CDN)
import {
  Hands
} from "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
import {
  Camera
} from "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";

export let handPosition3D = null; // {x, y, z}

// 啟動手勢追蹤
export function initHandTracking(videoElement) {

  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    selfieMode: true,
    maxNumHands: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.6,
    modelComplexity: 1
  });

  hands.onResults((results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      handPosition3D = null;
      return;
    }

    const lm = results.multiHandLandmarks[0][9]; // 手掌中心附近
    // Mediapipe 給的是螢幕座標 0~1，要轉成 Three.js NDC -1~1
    handPosition3D = {
      x: lm.x * 2 - 1,
      y: -(lm.y * 2 - 1),
      z: lm.z // z 越小代表越靠近鏡頭
    };
  });

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await hands.send({
        image: videoElement
      });
    },
    width: 640,
    height: 480
  });

  camera.start();
}
