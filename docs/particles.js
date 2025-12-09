// particles.js
export function createParticles(canvas) {
  const particles = [];
  const num = 500;

  for (let i = 0; i < num; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 200;

    particles.push({
      x: canvas.width / 2 + Math.cos(angle) * radius,
      y: canvas.height / 2 - radius * 0.7,
      baseX: 0,
      baseY: 0,
      size: 2 + Math.random() * 2,
    });
  }
  return particles;
}

export function updateParticles(ctx, particles, handPos) {
  particles.forEach(p => {
    if (handPos) {
      const dx = p.x - handPos.x;
      const dy = p.y - handPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        const force = (120 - dist) / 5;
        p.x += dx / dist * force;
        p.y += dy / dist * force;
      }
    }

    ctx.fillStyle = "#55ffff";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
}
