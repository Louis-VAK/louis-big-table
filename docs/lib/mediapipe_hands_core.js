// ========================================================
// Core Loader for MediaPipe Hands (Local Version)
// ========================================================

export async function createHandLandmarker(wasmPath, modelPath) {

    const wasmBinary = await fetch(wasmPath).then(r => r.arrayBuffer());
    const modelBinary = await fetch(modelPath).then(r => r.arrayBuffer());

    const MPHands = await import("./mediapipe_hands_runtime.js");

    const landmarker = await MPHands.FilesetResolver.forVisionTasks(
        () => wasmBinary
    );

    const detector = await MPHands.HandLandmarker.createFromOptions(
        {
            baseOptions: {
                modelAssetBuffer: modelBinary
            },
            numHands: 1
        }
    );

    return {
        detect: (video) => detector.detect(video)
    };
}
