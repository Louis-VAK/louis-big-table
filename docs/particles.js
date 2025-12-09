// ----------------------------------------------------
// 粒子聖誕樹 + 手勢推開互動
// ----------------------------------------------------

export function createParticles(canvas) {
  const particles = [];
  const cx = canvas.width / 2;
  const cy = canvas.height / 2 + 80;

  const total = 500; // 粒子數量

  for (let i = 0; i < total; i++) {
    // 讓粒子形成「聖誕樹錐形」
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 200;

    const x = cx + Math.cos(angle) * (radius * (1 - radius / 300));
    const y = cy - radius * 1.2; // 從下往上 taper

    particles.push({
      x,
      y,
      size: 2,
    });
  }

  return particles;
}

// ----------------------------------------------------
// 粒子更新（手靠近 → 推開）
// ----------------------------------------------------
export function updateParticles(ctx, particles, hand) {
  particles.forEach((p) => {
    if (hand) {
      const dx = p.x - hand.x;
      const dy = p.y - hand.y;
      const dist = Math.hypot(dx, dy);

      // 手在 120px 範圍內 → 粒子被推開
      if (dist < 120) {
        const force = (120 - dist) * 0.08;
        p.x += (dx / dist) * force;
        p.y += (dy / dist) * force;
      }
    }

    // 畫粒子
    ctx.fillStyle = "#55ffff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}
