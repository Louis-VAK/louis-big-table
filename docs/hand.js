window.handData = {
  pos: null,
  gesture: null,
};

function startHandTracking() {
  const video = document.createElement("video");
  video.setAttribute("playsinline", "");
  video.style.display = "none";
  document.body.appendChild(video);

  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.5,
  });

  hands.onResults((res) => {
    if (!res.multiHandLandmarks || res.multiHandLandmarks.length === 0) {
      window.handData.pos = null;
      window.handData.gesture = null;
      return;
    }

    const lm = res.multiHandLandmarks[0];
    // 手掌中心（掌根）
    const palm = lm[0];
    window.handData.pos = { x: palm.x, y: palm.y };

    // 手勢判定
    const thumbTip = lm[4].y;
    const indexTip = lm[8].y;
    const pinkyTip = lm[20].y;

    // Palm Open：所有指尖高於掌心
    if (
      lm[8].y < palm.y &&
      lm[12].y < palm.y &&
      lm[16].y < palm.y &&
      lm[20].y < palm.y
    ) {
      window.handData.gesture = "PALM";
    }
    // Fist：所有指尖低於掌心
    else if (
      lm[8].y > palm.y &&
      lm[12].y > palm.y &&
      lm[16].y > palm.y &&
      lm[20].y > palm.y
    ) {
      window.handData.gesture = "FIST";
    } else {
      window.handData.gesture = null;
    }
  });

  const cam = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 640,
    height: 480,
  });

  cam.start();
}
