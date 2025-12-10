// hand.js — MediaPipe Hands 偵測

window.handPos = null;
window.handGesture = "none";

function initHandTracking(videoElement) {
    const hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });

    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    hands.onResults(results => {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
            window.handPos = null;
            window.handGesture = "none";
            return;
        }

        const lm = results.multiHandLandmarks[0][9]; // index knuckle

        window.handPos = { x: lm.x, y: lm.y, z: lm.z };

        // 手勢判斷交給 gesture.js
        window.handGesture = detectGesture(results.multiHandLandmarks[0]);
    });

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await hands.send({ image: videoElement });
        }
    });

    camera.start();
}
