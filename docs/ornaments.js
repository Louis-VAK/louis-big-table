// ----------------------------------------------------
// 聖誕樹飾品（6 張圖片）+ 手靠近放大效果
// ----------------------------------------------------

export function createOrnaments(canvas) {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const files = [
    "img1.png",
    "img2.png",
    "img3.png",
    "img4.png",
    "img5.png",
    "img6.png",
  ];

  const ornaments = [];

  // 飾品固定位置（環繞聖誕樹但不旋轉）
  const positions = [
    { x: cx - 80, y: cy - 120 },
    { x: cx + 90, y: cy - 100 },
    { x: cx - 140, y: cy - 20 },
    { x: cx + 140, y: cy + 10 },
    { x: cx - 60, y: cy + 120 },
    { x: cx + 70, y: cy + 140 },
  ];

  files.forEach((file, i) => {
    const img = new Image();
    img.src = `./assets/${file}`;

    ornaments.push({
      img,
      x: positions[i].x,
      y: positions[i].y,
      baseSize: 90,   // 原始大小
      scale: 1,       // 當手靠近會變成 1.5～2 倍
    });
  });

  return ornaments;
}

// ----------------------------------------------------
// 更新飾品大小（手靠近 → 放大）
// ----------------------------------------------------
export function updateOrnaments(ctx, ornaments, hand) {
  ornaments.forEach((o) => {
    let size = o.baseSize;

    if (hand) {
      const dx = o.x - hand.x;
      const dy = o.y - hand.y;
      const dist = Math.hypot(dx, dy);

      // 距離 150px 內 → 放大
      if (dist < 150) {
        o.scale += 0.06;
      } else {
        o.scale -= 0.04;
      }
    }

    // 限制縮放倍率（不會過大或過小）
    o.scale = Math.max(1, Math.min(o.scale, 2));

    const finalSize = size * o.scale;

    ctx.drawImage(
      o.img,
      o.x - finalSize / 2,
      o.y - finalSize / 2,
      finalSize,
      finalSize
    );
  });
}
