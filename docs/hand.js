import {
  Hands,
  HAND_CONNECTIONS
} from "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js";

export let handPos = null;

// 初始化 Mediapipe Hands
const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});

hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.6,
  minTrackingConfidence: 0.5
});

// Hands 回調事件
hands.onResults(results => {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    handPos = null;
    return;
  }

  const lm = results.multiHandLandmarks[0];

  // 取 landmark #9 (Index MCP) 當作手勢的中心點
  handPos = {
    x: lm[9].x,
    y: lm[9].y
  };
});

// 啟動鏡頭 + Mediapipe
export async function startHandTracking() {
  const video = document.createElement("video");
  video.autoplay = true;
  video.playsInline = true;
  video.style.display = "none";
  document.body.appendChild(video);

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;

  function tick() {
    hands.send({ image: video });
    requestAnimationFrame(tick);
  }

  tick();
}
