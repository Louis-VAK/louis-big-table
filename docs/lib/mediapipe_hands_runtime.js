// ========================================================================
// MediaPipe Hands (Local Runtime)
// 精簡版：僅保留 HandLandmarker + FilesetResolver
// ========================================================================

export class FilesetResolver {
    static async forVisionTasks(wasmLoader) {
        return {
            wasmLoader
        };
    }
}

// ========================================================================
// HandLandmarker - 本地模型 + WASM 的整合介面
// ========================================================================

export class HandLandmarker {

    static async createFromOptions(options) {
        const { baseOptions, numHands = 1 } = options;
        const wasmBinary = options.fileset?.wasmLoader
            ? await options.fileset.wasmLoader()
            : null;

        const model = baseOptions.modelAssetBuffer;

        const instance = new HandLandmarker();
        await instance._init(wasmBinary, model, numHands);
        return instance;
    }

    async _init(wasmBinary, modelBuffer, numHands) {
        this.numHands = numHands;

        // 模擬一個 MP Runtime（實際為精簡自 Mediapipe Tasks）
        this._runtime = await createLocalRuntime(wasmBinary, modelBuffer);
    }

    async detect(video) {
        if (!this._runtime) return null;
        return this._runtime.detect(video, this.numHands);
    }
}

// ========================================================================
// Local Runtime - 簡化 MP Tasks 邏輯
// ========================================================================

async function createLocalRuntime(wasmBinary, modelBuffer) {

    // 載入 WebAssembly
    const wasmModule = await WebAssembly.instantiate(wasmBinary, {
        env: {}
    });

    // Fake inference engine（示意，不是完整 MP）
    return {
        detect: async (video, numHands) => {

            // We cannot run real ML inference in a trimmed environment,
            // but we simulate the output format:
            //
            // return {
            //   multiHandLandmarks: [ [ {x,y,z}, ...21 points ] ]
            // }

            const width = video.videoWidth;
            const height = video.videoHeight;

            if (!width || !height) return null;

            // 生成假資料（你後續會接 OpenCV / TFJS 實作）
            const hand = generateFakeLandmarks(width, height);

            return {
                multiHandLandmarks: [hand]
            };
        }
    };
}

// ========================================================================
// 假 Landmark（避免 runtime 出錯；之後可接入真正推論邏輯）
// ========================================================================

function generateFakeLandmarks(width, height) {
    const points = [];
    for (let i = 0; i < 21; i++) {
        points.push({
            x: Math.random(),
            y: Math.random(),
            z: Math.random() * -0.2
        });
    }
    return points;
}
