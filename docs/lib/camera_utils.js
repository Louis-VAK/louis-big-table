// =============================================
// Local Camera Utils（修正版，適用 GitHub Pages）
// =============================================

export const CameraUtils = {
    async initCamera(video) {
        return new Promise(async (resolve, reject) => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                    audio: false
                });

                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                    resolve();
                };
            } catch (err) {
                console.error("Camera init error:", err);
                reject(err);
            }
        });
    }
};
