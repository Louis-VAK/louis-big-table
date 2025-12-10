// ornaments.js
// ---------------------------------------------------

const SPRITE_COUNT = 6;
const MIN_DISTANCE = 0.20;

let sprites = [];
let zoomLocked = false;
let lastOk = 0;
const OK_COOLDOWN = 600;

let lockedSprite = null;

// ---------------------------------------------------
function createOrnaments(scene) {
  const loader = new THREE.TextureLoader();
  const group = new THREE.Group();

  for (let i = 1; i <= SPRITE_COUNT; i++) {
    const tex = loader.load(`./assets/img${i}.png`);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex,
      transparent: true
    }));

    sp.scale.set(0.18, 0.18, 1);

    // ⭐ 初始位置（靠近中心）
    const angle = Math.random() * Math.PI * 2;
    const y = Math.random() * 2 - 1;
    const r = 0.28;

    const basePos = new THREE.Vector3(
      Math.cos(angle) * r,
      y,
      Math.sin(angle) * r
    );

    sp.userData.basePos = basePos.clone();
    sp.position.copy(basePos);

    sprites.push(sp);
    group.add(sp);
  }

  scene.add(group);
  return group;
}

// ---------------------------------------------------
function isOkGesture(hand) {
  if (!hand) return false;

  const now = performance.now();
  if (now - lastOk < OK_COOLDOWN) return false;

  const nearCenter =
    Math.abs(hand.x - 0.5) < 0.08 &&
    Math.abs(hand.y - 0.5) < 0.08;

  if (nearCenter) {
    lastOk = now;
    return true;
  }

  return false;
}

// ---------------------------------------------------
function updateOrnaments(explosion, hand, hasHand, tree) {
  // ⭐ 無手 → 完全不動
  if (!hasHand) {
    sprites.forEach(sp => sp.scale.set(0.18, 0.18, 1));
    return;
  }

  // ⭐ OK → 切換鎖定模式
  if (isOkGesture(hand)) {
    zoomLocked = !zoomLocked;
    lockedSprite = null; // 重置，之後再重新選
  }

  // ⭐ 計算爆散係數
  const factor = 1 + explosion * 0.8;

  // ⭐ 若未鎖定 → 正常「相簿模式」
  if (!zoomLocked) {
    tree.material.transparent = true;
    tree.material.opacity = 1.0;

    sprites.forEach(sp => {
      const explodedPos = sp.userData.basePos.clone().multiplyScalar(factor);
      sp.position.copy(explodedPos);
      sp.scale.set(0.18, 0.18, 1);
    });

    return;
  }

  // ⭐ 鎖定模式（檢視照片）

  // 樹淡出
  tree.material.transparent = true;
  tree.material.opacity = 0.3;

  // 若還沒選到圖片 → 選距離樹 Z 軸最近的那一張
  if (!lockedSprite) {
    let minDist = Infinity;

    sprites.forEach(sp => {
      const d = Math.sqrt(
        sp.position.x * sp.position.x +
        sp.position.z * sp.position.z
      );

      if (d < minDist) {
        minDist = d;
        lockedSprite = sp;
      }
    });
  }

  // ⭐ 放大選中的圖片並移到鏡頭前
  lockedSprite.scale.set(0.55, 0.55, 1);
  lockedSprite.position.set(0, 0, 1.8);

  // ⭐ 其他圖片縮回樹上
  sprites.forEach(sp => {
    if (sp !== lockedSprite) {
      const explodedPos = sp.userData.basePos.clone().multiplyScalar(factor);
      sp.position.copy(explodedPos);
      sp.scale.set(0.18, 0.18, 1);
    }
  });
}

window.createOrnaments = createOrnaments;
window.updateOrnaments = updateOrnaments;
