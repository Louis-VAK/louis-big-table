// =========================================================
//  MediaPipe Hands Local Version (封裝 A 版 API)
//  GitHub Pages 可用，不依賴 CDN、不會 404
//  使用方式：
//     import { HandTracker } from "./lib/mediapipe_hands.js";
//     const tracker = new HandTracker({
//         onResults: (r) => console.log(r.multiHandLandmarks)
//     });
//     tracker.start();
// =========================================================

import { CameraUtils } from "./camera_utils.js";

export class HandTracker {

    constructor(config = {}) {
        this.onResults = config.onResults || function () { };

        this.video = document.createElement("video");
        this.video.style.display = "none";
        document.body.appendChild(this.video);

        this.landmarker = null;
        this.running = false;

        this.init();
    }

    async init() {
        const wasmPath = "./lib/mediapipe_hands.wasm";
        const modelPath = "./lib/mediapipe_hands.task";

        const module = await import("./mediapipe_hands_core.js");

        this.landmarker = await module.createHandLandmarker(
            wasmPath,
            modelPath
        );
    }

    async start() {
        if (this.running) return;
        this.running = true;

        await CameraUtils.initCamera(this.video);

        const loop = async () => {
            if (!this.running) return;

            const results = await this.landmarker.detect(this.video);
            if (results) this.onResults(results);

            requestAnimationFrame(loop);
        };

        loop();
    }

    stop() {
        this.running = false;
    }
}
