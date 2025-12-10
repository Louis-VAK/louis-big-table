window.handData = {
  palmOpenFrames: 0,
  pushFrames: 0,
  x: 0,
  y: 0,
  z: -0.5,
};

function startHandTracking() {
  const video = document.createElement("video");
  video.setAttribute("playsinline", "");
  video.style.display = "none";
  document.body.appendChild(video);

  const hands = new Hands({
    locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.6,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(onHandResults);

  const camera = new Camera(video, {
    onFrame: async () => {
      await hands.send({ image: video });
    },
    width: 640, height: 480,
  });

  camera.start();
}

function onHandResults(results) {
  if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
    window.handData.palmOpenFrames = 0;
    window.handData.pushFrames = 0;
    return;
  }

  const pts = results.multiHandLandmarks[0];
  const mcp = pts[9];
  const z = pts[9].z;

  window.handData.x = mcp.x;
  window.handData.y = mcp.y;
  window.handData.z = z;

  const dist1 = distance(pts[4], pts[8]);
  const dist2 = distance(pts[12], pts[0]);

  const palmOpen = dist1 > 0.13 && dist2 > 0.25;
  const pushing = z > -0.1;

  if (palmOpen) window.handData.palmOpenFrames++;
  else window.handData.palmOpenFrames = 0;

  if (pushing) window.handData.pushFrames++;
  else window.handData.pushFrames = 0;
}

function distance(a, b) {
  return Math.sqrt((a.x-b.x)**2 + (a.y-b.y)**2 + (a.z-b.z)**2);
}
