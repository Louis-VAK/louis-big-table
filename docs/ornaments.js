// ==========================
// 🎄 B 模組：相簿模式 圖片清單
// ==========================
const ornamentsImages = [
  "./assets/img1.png",
  "./assets/img2.png",
  "./assets/img3.png",
  "./assets/img4.png",
  "./assets/img5.png",
  "./assets/img6.png"
];


// ==========================
// 🎄 建立 6 張圖片 Sprite
// ==========================
function createOrnaments(scene) {
  const ornaments = [];

  ornamentsImages.forEach((src, i) => {
    const texture = new THREE.TextureLoader().load(src);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);

    // ⭐ B 模組預設大小（比之前放大 2 倍）
    sprite.scale.set(1.4, 1.4, 1);

    // 暫時先全部放在中心，後續進 B 模組時重新定位
    sprite.position.set(0, 0, 0);

    scene.add(sprite);
    ornaments.push(sprite);
  });

  return ornaments;
}


// ==========================
// 🎄 A 模組：把圖片縮小到樹內 & 隨粒子一起動
// ==========================
function applyAStateOrnaments(ornaments, treeExplosion, treeRotationY) {
  ornaments.forEach((s, i) => {
    // 隨粒子縮放（粒子越炸開，圖片越外擴）
    const baseR = 0.6 + i * 0.12;
    const r = baseR * (1 + treeExplosion * 1.8);

    const ang = (i / ornaments.length) * Math.PI * 2 + treeRotationY * 0.6;

    s.scale.set(0.35, 0.35, 1); // ⭐ A 模組圖片大小（不大）
    s.position.set(
      Math.cos(ang) * r,
      -0.2 + Math.sin(i) * 0.15,
      Math.sin(ang) * r
    );

    s.visible = true;
  });
}


// ==========================
// 🎄 B 模組：相簿模式（橫向 6 張卡片）
// ==========================
function applyBStateOrnaments(ornaments, centerRotationY) {
  const radius = 2.8; // ⭐ B 模組水平旋轉半徑

  ornaments.forEach((s, i) => {
    const angle = centerRotationY + i * (Math.PI * 2 / ornaments.length);

    s.scale.set(2.0, 2.0, 1); // ⭐ 你要求的：比之前放大 2 倍

    s.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );

    s.visible = true;
  });
}


// ==========================
// 🎄 退出 B 模組 → 隱藏圖片
// ==========================
function hideOrnaments(ornaments) {
  ornaments.forEach(s => {
    s.visible = false;
  });
}



// 讓 main.js 可以讀取
window.createOrnaments = createOrnaments;
window.applyAStateOrnaments = applyAStateOrnaments;
window.applyBStateOrnaments = applyBStateOrnaments;
window.hideOrnaments = hideOrnaments;
