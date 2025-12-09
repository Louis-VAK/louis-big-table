// hand.js
export let handPos = null;

let model = null;
const video = document.createElement("video");
video.setAttribute("playsinline", "");
video.style.display = "none";
document.body.appendChild(video);

const modelParams = {
  flipHorizontal: true,
  maxNumBoxes: 1,
  scoreThreshold: 0.6,
  iouThreshold: 0.5,
};

export async function startHandTracking() {
  model = await handTrack.load(modelParams);

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  await video.play();

  detectLoop();
}

async function detectLoop() {
  const predictions = await model.detect(video);

  if (predictions.length > 0) {
    const { bbox } = predictions[0];
    handPos = {
      x: bbox[0] + bbox[2] / 2,
      y: bbox[1] + bbox[3] / 2,
    };
  } else {
    handPos = null;
  }

  requestAnimationFrame(detectLoop);
}
