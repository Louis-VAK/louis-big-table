// utils.js — 供手勢追蹤使用的工具函式

// 正規化座標（0~1）
export function normalizeLandmark(landmark) {
  return {
    x: landmark.x,
    y: landmark.y,
    z: landmark.z,
  };
}

// 計算兩點距離
export function distance(a, b) {
  return Math.sqrt(
    (a.x - b.x) ** 2 +
    (a.y - b.y) ** 2 +
    (a.z - b.z) ** 2
  );
}
