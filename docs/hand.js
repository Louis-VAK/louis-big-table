// docs/hand.js
export let handPos = null;

let videoEl = null;
let hands = null;
let camera = null;

export async function startHandTracking() {
  videoEl = document.createElement("video");
  videoEl.setAttribute("playsinline", "");
  videoEl.style.display = "none";
  document.body.appendChild(videoEl);

  // Hands（來自 index.html Script，全域變數）
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

  // Camera（也是全域變數）
  camera = new Camera(videoEl, {
    onFrame: async () => {
      await hands.send({ image: videoEl });
    },
    width: 640,
    height: 480,
  });

  await camera.start();
}

function onResults(results) {
  if (
    !results.multiHandLandmarks ||
    results.multiHandLandmarks.length === 0
  ) {
    handPos = null;
    return;
  }

  const pt = results.multiHandLandmarks[0][9]; // index MCP
  handPos = { x: pt.x, y: pt.y };
}
