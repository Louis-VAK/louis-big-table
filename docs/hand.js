export let handPos = null;

import { Hands } from "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";
import { Camera } from "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";

let videoEl = null;

export async function startHandTracking() {
  videoEl = document.createElement("video");
  videoEl.setAttribute("playsinline", "");
  videoEl.style.display = "none";
  document.body.appendChild(videoEl);

  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });

  hands.onResults(onResults);

  const camera = new Camera(videoEl, {
    onFrame: async () => {
      await hands.send({ image: videoEl });
    },
    width: 640,
    height: 480,
  });

  camera.start();
}

function onResults(results) {
  if (!results.multiHandLandmarks?.length) {
    handPos = null;
    return;
  }

  const pt = results.multiHandLandmarks[0][9]; // index-finger MCP
  handPos = { x: pt.x, y: pt.y };
}
