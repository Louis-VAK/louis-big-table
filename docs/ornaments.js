// ============================================
// ornaments.js — 聖誕樹上懸掛圖片
// ============================================

const imageList = [
  "./assets/1.png",
  "./assets/2.png",
  "./assets/3.png",
  "./assets/4.png",
  "./assets/5.png",
  "./assets/6.png",
];

export async function createOrnaments(canvas) {
  const items = [];

  const loadImg = src => new Promise(res => {
    const img = new Image();
    img.src = src;
    img.onload = () => res(img);
  });

  const imgs = await Promise.all(imageList.map(loadImg));

  const cx = canvas.width / 2;
  const cy = canvas.height * 0.65;

  imgs.forEach((img, i) => {
    items.push({
      img,
      x: cx + (i - 3) * 120,
      y: cy - 180 - Math.random() * 120,
      size: 120,
    });
  });

  return items;
}

export function updateOrnaments(ctx, items, handPos) {
  items.forEach(o => {

    let scale = 1;

    if (handPos) {
      let dx = o.x - handPos.x;
      let dy = o.y - handPos.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 130) scale = 1.5;
    }

    ctx.drawImage(
      o.img,
      o.x - (o.size * scale) / 2,
      o.y - (o.size * scale) / 2,
      o.size * scale,
      o.size * scale
    );
  });
}
