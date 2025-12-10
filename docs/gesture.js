// gesture.js — 手勢判斷統一寫在這裡

function detectGesture(landmarks) {
    if (!landmarks) return "none";

    const wrist = landmarks[0];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const thumbTip = landmarks[4];

    const dx = indexTip.x - thumbTip.x;
    const dy = indexTip.y - thumbTip.y;

    // ■ OK 手勢（拇指尖接近食指尖）
    if (Math.hypot(dx, dy) < 0.05) return "ok";

    // ■ 張開手掌（index 與 middle 距離較大）
    const dx2 = indexTip.x - middleTip.x;
    if (Math.abs(dx2) > 0.07) return "open";

    // ■ 手往前（判斷 z）
    if (indexTip.z < -0.12) return "forward";

    return "none";
}
