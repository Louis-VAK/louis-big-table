// ornaments.js
// ---------------------------------------------------
// 🎄 聖誕樹飾品系統（圖片 Sprite）
// ---------------------------------------------------

const SPRITE_COUNT = 6;
const MIN_DISTANCE = 0.20;    // Q2：圖片最小間距
let sprites = [];
let zoomLocked = false;
let lastOkTime = 0;
const OK_COOLDOWN = 600;      // 避免 OK 手勢太敏感（0.6 秒）

// ---------------------------------------------------
// 🎨 載入圖片至 Sprites
// ---------------------------------------------------
function createOrnaments(scene) {
  const loader = new THREE.TextureLoader();
  const group = new THREE.Group();

  for (let i = 1; i <= SPRITE_COUNT; i++) {
    const tex = loader.load(`./assets/img${i}.png`);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sp = new THREE.Sprite(mat);

    sp.scale.set(0.18, 0.18, 1); // 小圖大小（保留你現在的設定）

    // 隨機放在樹身上（靠近樹心）
    const angle = Math.random() * Math.PI * 2;
    const y = Math.random() * 2 - 1; 
    const r = 0.3 + Math.random() * 0.2; // 稍微靠近中心

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
// ✋ 偵測 OK 手勢（簡化版：靠近中心即視為 OK）
// ---------------------------------------------------
function isOkGesture(hand) {
  if (!hand) return false;

  const now = performance.now();
  if (now - lastOkTime < OK_COOLDOWN) return false;

  // 檢查手是否非常接近中心（x,y 介於 0.45~0.55）
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
// 🎮 更新飾品（圖片散開 + OK 手勢放大）
// ---------------------------------------------------
function updateOrnaments(explosion, handPos) {
  // explosion 來自 main.js（與粒子同步）
  let scaleSmall = 0.18;
  let scaleBig = 0.55; // 你覺得剛好的放大比例（保留原設定）

  // 1. OK 手勢 → 切換縮放鎖定
  if (isOkGesture(handPos)) {
    zoomLocked = !zoomLocked;
  }

  // 2. 散開基本邏輯（跟粒子同步，但係數 = 0.8）
  const factor = 1 + explosion * 0.8;

  // 3. 更新每張圖片
  sprites.forEach((sp) => {
    sp.position.multiplyScalar(factor);

    // 若正在放大模式
    if (zoomLocked) {
      sp.scale.set(scaleBig, scaleBig, 1);
    } else {
      sp.scale.set(scaleSmall, scaleSmall, 1);
    }
  });

  // ---------------------------------------------------
  // 🧲 圖片避免互相重疊（最小距離 MIN_DISTANCE）
  // ---------------------------------------------------
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

// ---------------------------------------------------
window.createOrnaments = createOrnaments;
window.updateOrnaments = updateOrnaments;
