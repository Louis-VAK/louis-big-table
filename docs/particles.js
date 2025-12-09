export function updateParticles(ctx, particles, hand) {
  particles.forEach(p => {
    // 手勢互動
    if (hand && hand.x && hand.y) {
      const dx = p.x - hand.x;
      const dy = p.y - hand.y;
      const dist = Math.sqrt(dx*dx + dy*dy);

      if (dist < 160) {
        const force = (160 - dist) / 160;
        p.vx += (dx / dist) * force * 6.0; // 噴散強度
        p.vy += (dy / dist) * force * 6.0;
      }
    }

    // 速度衰減 (自然感)
    p.vx *= 0.92;
    p.vy *= 0.92;

    p.x += p.vx;
    p.y += p.vy;

    ctx.fillStyle = "rgba(0,255,255,0.9)";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fill();
  });
}
