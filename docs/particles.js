// ============================================
// particles.js — 2D 聖誕樹粒子
// ============================================

export function createParticles(canvas) {
  const particles = [];
  const cx = canvas.width / 2;
  const cy = canvas.height * 0.65;

  for (let i = 0; i < 900; i++) {
    let angle = Math.random() * Math.PI * 2;
    let radius = Math.random() * 150;
    let height = Math.random() * 300;

    particles.push({
      x: cx + Math.cos(angle) * (radius * (height / 300)),
      y: cy - height,
      baseX: 0,
      baseY: 0,
      size: 2 + Math.random() * 2,
    });
  }
  return particles;
}

export function updateParticles(ctx, particles, handPos) {
  particles.forEach(p => {

    // 推開效果
    if (handPos) {
      let dx = p.x - handPos.x;
      let dy = p.y - handPos.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 80) {
        p.x += dx * 0.1;
        p.y += dy * 0.1;
      }
    }

    ctx.fillStyle = "#66e0ff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}
