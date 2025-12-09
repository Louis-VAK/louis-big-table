window.handPos = null;

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

    const pt = results.multiHandLandmarks[0][9];
    window.handPos = { x: pt.x, y: pt.y };
  });

  const camera = new Camera(video, {
    onFrame: async () => await hands.send({ image: video }),
    width: 640,
    height: 480,
  });

  camera.start();
}

window.startHandTracking = startHandTracking;
