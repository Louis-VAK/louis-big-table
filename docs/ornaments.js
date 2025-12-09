// ornaments.js
export async function createOrnaments(canvas) {
  const imgPaths = [
    "./assets/img1.png",
    "./assets/img2.png",
    "./assets/img3.png",
    "./assets/img4.png",
    "./assets/img5.png",
    "./assets/img6.png",
  ];

  const images = await Promise.all(imgPaths.map(loadImage));

  const ornaments = images.map((img, i) => {
    return {
      img,
      x: canvas.width / 2 + (i % 2 === 0 ? -220 : 220),
      y: canvas.height / 2 - 150 + i * 80,
      baseSize: 120,
    };
  });

  return ornaments;
}

export function updateOrnaments(ctx, ornaments, handPos) {
  ornaments.forEach(o => {
    let scale = 1;

    if (handPos) {
      const dx = o.x - handPos.x;
      const dy = o.y - handPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 180) scale = 1.4;
    }

    const size = o.baseSize * scale;
    ctx.drawImage(o.img, o.x - size / 2, o.y - size / 2, size, size);
  });
}

function loadImage(src) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => res(img);
    img.src = src;
  });
}
