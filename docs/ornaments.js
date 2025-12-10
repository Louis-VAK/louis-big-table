// ornaments.js
// ⭐ 飾品系統：貼在樹表面、隨樹旋轉、OK 手勢可放大圖片

const ORNAMENT_COUNT = 10; 
const ORNAMENT_IMAGES = [
  "./assets/img1.png",
  "./assets/img2.png",
  "./assets/img3.png",
  "./assets/img4.png",
  "./assets/img5.png",
  "./assets/img6.png"
];

let ornaments = [];
let enlargedIndex = null; // ⭐ 目前放大的飾品

// -------------------------------------------------------
// 🎄 初始化飾品：和樹一起建立（一次性）
// -------------------------------------------------------
function createOrnaments(scene, treeGeometry) {
  const pos = treeGeometry.attributes.position.array;

  for (let i = 0; i < ORNAMENT_COUNT; i++) {
    const spriteMap = new THREE.TextureLoader().load(
      ORNAMENT_IMAGES[i % ORNAMENT_IMAGES.length]
    );

    const mat = new THREE.SpriteMaterial({
      map: spriteMap,
      transparent: true,
      opacity: 0.85
    });

    const sprite = new THREE.Sprite(mat);

    // ⭐ 從樹的粒子中挑一個位置掛上飾品
    const idx = Math.floor(Math.random() * (pos.length / 3)) * 3;

    sprite.position.set(pos[idx], pos[idx + 1], pos[idx + 2]);

    sprite.scale.set(0.15, 0.15, 0.15); // 初始：非常小

    scene.add(sprite);
    ornaments.push(sprite);
  }
}

// -------------------------------------------------------
// 🎁 飾品動畫（隨樹旋轉 + 爆散微放大）
// -------------------------------------------------------
function updateOrnaments(explosionStrength, treeRotationY) {
  ornaments.forEach((sprite, i) => {

    if (enlargedIndex === i) {
      // ⭐ 已進入 OK 手勢放大 → 不受樹動畫影響
      return;
    }

    // 🔄 跟著樹轉
    sprite.parent.rotation.y = treeRotationY;

    // 🎉 爆散時微微放大
    const s = 0.15 + explosionStrength * 0.25;
    sprite.scale.set(s, s, s);
  });
}

// -------------------------------------------------------
// 👌 OK 手勢 → 放大最近的飾品
// -------------------------------------------------------
function enlargeClosestOrnament(camera) {
  if (enlargedIndex !== null) {
    // 若已有放大的 → 還原全部
    ornaments.forEach((o) => o.scale.set(0.15, 0.15, 0.15));
    enlargedIndex = null;
    return;
  }

  let closest = -1;
  let closestDist = Infinity;

  ornaments.forEach((o, idx) => {
    const d = o.position.distanceTo(camera.position);
    if (d < closestDist) {
      closest = idx;
      closestDist = d;
    }
  });

  if (closest >= 0) {
    enlargedIndex = closest;

    const o = ornaments[closest];
    o.scale.set(2.5, 2.5, 2.5); // ⭐ 放大到螢幕一半
  }
}

window.createOrnaments = createOrnaments;
window.updateOrnaments = updateOrnaments;
window.enlargeClosestOrnament = enlargeClosestOrnament;
