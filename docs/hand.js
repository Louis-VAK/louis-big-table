// ============================================
// hand.js — HandTrack.js 手勢偵測模組
// ============================================

export let handPos = null;   // 匯出手部中心點 {x, y}

// HandTrack 設定
const modelParams = {
  flipHorizontal: true,
  maxNumBoxes: 1,
  iouThreshold: 0.5,
  scoreThreshold: 0.6,
};

let model = null;
let videoElem = null;

// 啟動手勢偵測
export async function startHandTracking() {

  model = await handTrack.load(modelParams);

  // 建立隱藏 video
  videoElem = document.createElement('video');
  videoElem.setAttribute('playsinline', '');
  videoElem.style.display = "none";
  document.body.appendChild(videoElem);

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElem.srcObject = stream;
  await videoElem.play();

  detectFrame();
}

// 持續偵測手部
async function detectFrame() {

  const predictions = await model.detect(videoElem);

  if (predictions.length > 0) {
    const box = predictions[0].bbox;  // [x, y, w, h]
    handPos = {
      x: box[0] + box[2] / 2,
      y: box[1] + box[3] / 2,
    };
  } else {
    handPos = null;
  }

  requestAnimationFrame(detectFrame);
}
