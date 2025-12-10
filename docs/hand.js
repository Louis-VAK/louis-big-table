window.handPos = null;
window.okGesture = false;

function startHandTracking() {
  const video = document.createElement("video");
  video.setAttribute("playsinline", "");
  video.style.display = "none";
  document.body.appendChild(video);

  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.5,
  });

  hands.onResults((results) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      window.handPos = null;
      return;
    }

    const lm = results.multiHandLandmarks[0];
    const pt = lm[9]; // rotation use
    window.handPos = { x: pt.x, y: pt.y };

    // -------------------------------------------------
    // 👌 偵測 OK 手勢：拇指指尖靠近食指指尖
    // -------------------------------------------------
    const thumbTip = lm[4];
    const indexTip = lm[8];

    const dx = thumbTip.x - indexTip.x;
    const dy = thumbTip.y - indexTip.y;
    const dz = thumbTip.z - indexTip.z;

    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    // ⭐ 閾值
    if (dist < 0.04) {
      window.okGesture = true;
    }
  });

  const camera = new Camera(video, {
    onFrame: async () => await hands.send({ image: video }),
    width: 640,
    height: 480,
  });

  camera.start();
}

window.startHandTracking = startHandTracking;
