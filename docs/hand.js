window.handPos = null;

function startHandTracking() {

  console.log("🚀 Hand tracking start");

  const video = document.createElement("video");
  video.setAttribute("playsinline", "");
  video.style.display = "none";
  document.body.appendChild(video);

  // 🔥 使用可用版本的 Mediapipe Hands
  const hands = new Hands({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.5,
  });

  hands.onResults((results) => {
    console.log("📷 callback → ", results.multiHandLandmarks);

    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
      window.handPos = null;
      return;
    }

    const pt = results.multiHandLandmarks[0][9];
    window.handPos = { x: pt.x, y: pt.y };

    console.log("👉 handPos:", window.handPos);
  });

  const camera = new Camera(video, {
    onFrame: async () => await hands.send({ image: video }),
    width: 640,
    height: 480,
  });

  camera.start();

  console.log("📸 Camera started");
}

window.startHandTracking = startHandTracking;
