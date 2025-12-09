window.handPos = null;

let videoEl = null;
let hands = null;

// 啟動手勢追蹤
window.startHandTracking = async function () {
  videoEl = document.createElement("video");
  videoEl.setAttribute("playsinline", "");
  videoEl.style.display = "none";
  document.body.appendChild(videoEl);

  hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResults);

  const camera = new Camera(videoEl, {
    onFrame: async () => {
      await hands.send({ image: videoEl });
    },
    width: 640,
    height: 480,
  });

  await camera.start();
};

function onResults(results) {
  if (!results.multiHandLandmarks?.length) {
    handPos = null;
    return;
  }

  // 取食指 MCP（穩定）
  const pt = results.multiHandLandmarks[0][9];
  handPos = { x: pt.x, y: pt.y };
}
