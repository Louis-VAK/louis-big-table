// ----------------------------------------------------
// MediaPipe Hands 手勢追蹤模組
// ----------------------------------------------------

export let handPos = null; // 會被 main.js 使用的手部座標

let videoEl = null;
let hands = null;
let camera = null;

// ----------------------------------------------------
// 啟動手勢追蹤（在 main.js 的按鈕點擊後觸發）
// ----------------------------------------------------
export async function startHandTracking() {
  // 建立隱藏影片元素（MediaPipe 要用）
  videoEl = document.createElement("video");
  videoEl.setAttribute("playsinline", "");
  videoEl.style.display = "none";
  document.body.appendChild(videoEl);

  // 初始化 MediaPipe Hands
  hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onResults);

  // 啟動相機
  camera = new Camera(videoEl, {
    onFrame: async () => {
      await hands.send({ image: videoEl });
    },
    width: 640,
    height: 480,
  });

  await camera.start();
}

// ----------------------------------------------------
// MediaPipe 回傳結果 → 抓手部座標
// ----------------------------------------------------
function onResults(results) {
  if (
    !results.multiHandLandmarks ||
    results.multiHandLandmarks.length === 0
  ) {
    handPos = null;
    return;
  }

  // 手部 21 點中的第 9 點（index finger MCP）
  const p = results.multiHandLandmarks[0][9];

  // 正規化座標（0~1）給 main.js 使用
  handPos = { x: p.x, y: p.y };
}
