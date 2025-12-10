// ornaments.js
// ---------------------------------------------------

const SPRITE_COUNT = 6;
const MIN_DISTANCE = 0.20;

let sprites = [];
let zoomLocked = false;
let lastOk = 0;
const OK_COOLDOWN = 600;

// -------------------------
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

    // 初始位置（靠近中心 → 不會飛走）
    const angle = Math.random() * Math.PI * 2;
    const y = Math.random() * 2 - 1;
    const r = 0.28;

    sp.position.set(Math.cos(angle) * r, y, Math.sin(angle) * r);

    sprites.push(sp);
    group.add(sp);
  }

  scene.add(group);
  return group;
}

// -------------------------
function isOkGesture(hand) {
  if (!hand) return false;

  const now = performance.now();
  if (now - lastOk < OK_COOLDOWN) return false;

  if (Math.abs(hand.x - 0.5) < 0.08 && Math.abs(hand.y - 0.5) < 0.08) {
    lastOk = now;
    return true;
  }

  return false;
}

// -------------------------
function updateOrnaments(explosion, hand, hasHand) {

  // ⭐ 若尚未偵測到手 → 圖片完全不爆散、不動
  if (!hasHand) {
    sprites.forEach(sp => sp.scale.set(0.18, 0.18, 1));
    return;
  }

  // OK 手勢切換放大
  if (isOkGesture(hand)) {
    zoomLocked = !zoomLocked;
  }

  const factor = 1 + explosion * 0.8;

  sprites.forEach(sp => {
    sp.position.multiplyScalar(factor);

    if (zoomLocked) {
      sp.scale.set(0.55, 0.55, 1);
    } else {
      sp.scale.set(0.18, 0.18, 1);
    }
  });

  // 距離分離
  for (let i = 0; i < sprites.length; i++) {
    for (let j = i + 1; j < sprites.length; j++) {
      const A = sprites[i];
      const B = sprites[j];

      const dx = A.position.x - B.position.x;
      const dy = A.position.y - B.position.y;
      const dz = A.position.z - B.position.z;

      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

      if (dist < MIN_DISTANCE) {
        const push = (MIN_DISTANCE - dist) * 0.5;
        const ux = dx / dist;
        const uy = dy / dist;
        const uz = dz / dist;

        A.position.x += ux * push;
        A.position.y += uy * push;
        A.position.z += uz * push;

        B.position.x -= ux * push;
        B.position.y -= uy * push;
        B.position.z -= uz * push;
      }
    }
  }
}

window.createOrnaments = createOrnaments;
window.updateOrnaments = updateOrnaments;
