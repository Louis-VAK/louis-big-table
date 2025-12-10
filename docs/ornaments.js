// ornaments.js
// ---------------------------------------------------
// 🎄 聖誕樹飾品系統（圖片 Sprite）
// ---------------------------------------------------

const SPRITE_COUNT = 6;
const MIN_DISTANCE = 0.20; // 問題 2：你選的 C 值（0.20）

let sprites = [];
let zoomLocked = false;
let lastOkTime = 0;
const OK_COOLDOWN = 600;

// ---------------------------------------------------
// 🎨 載入圖片
// ---------------------------------------------------
function createOrnaments(scene) {
  const loader = new THREE.TextureLoader();
  const group = new THREE.Group();

  for (let i = 1; i <= SPRITE_COUNT; i++) {
    const tex = loader.load(`./assets/img${i}.png`);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sp = new THREE.Sprite(mat);

    sp.scale.set(0.18, 0.18, 1); // 保留你現在的小圖比例

    // 隨機掛在樹中心附近
    const angle = Math.random() * Math.PI * 2;
    const y = Math.random() * 2 - 1;
    const r = 0.3 + Math.random() * 0.2;

    sp.position.set(
      Math.cos(angle) * r,
      y,
      Math.sin(angle) * r
    );

    group.add(sp);
    sprites.push(sp);
  }

  scene.add(group);
  return group;
}

// ---------------------------------------------------
// ✋ 偵測 OK
// ---------------------------------------------------
function isOkGesture(hand) {
  if (!hand) return false;

  const now = performance.now();
  if (now - lastOkTime < OK_COOLDOWN) return false;

  const nearCenter =
    Math.abs(hand.x - 0.5) < 0.08 &&
    Math.abs(hand.y - 0.5) < 0.08;

  if (nearCenter) {
    lastOkTime = now;
    return true;
  }
  return false;
}

// ---------------------------------------------------
// 🎮 更新飾品（散開 + 距離保持 + 放大）
// ---------------------------------------------------
function updateOrnaments(explosion, handPos, frameCount) {
  let factor = 1;

  // ⭐ 初始幀不散開（防止圖片飛走）
  if (frameCount > 15) {
    factor = 1 + explosion * 0.8; // 問題 1：你選的 B（80%）
  }

  const scaleSmall = 0.18;
  const scaleBig = 0.55; // 你說保持現行效果

  // OK 手勢切換
  if (isOkGesture(handPos)) {
    zoomLocked = !zoomLocked;
  }

  // 1. 散開
  sprites.forEach((sp) => {
    sp.position.multiplyScalar(factor);

    // 放大/縮小
    if (zoomLocked) {
      sp.scale.set(scaleBig, scaleBig, 1);
    } else {
      sp.scale.set(scaleSmall, scaleSmall, 1);
    }
  });

  // 2. 保持圖片距離
  for (let i = 0; i < sprites.length; i++) {
    for (let j = i + 1; j < sprites.length; j++) {
      const A = sprites[i];
      const B = sprites[j];

      const dx = A.position.x - B.position.x;
      const dy = A.position.y - B.position.y;
      const dz = A.position.z - B.position.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < MIN_DISTANCE) {
        const push = (MIN_DISTANCE - dist) * 0.5;

        A.position.x += (dx / dist) * push;
        A.position.y += (dy / dist) * push;
        A.position.z += (dz / dist) * push;

        B.position.x -= (dx / dist) * push;
        B.position.y -= (dy / dist) * push;
        B.position.z -= (dz / dist) * push;
      }
    }
  }
}

window.createOrnaments = createOrnaments;
window.updateOrnaments = updateOrnaments;
