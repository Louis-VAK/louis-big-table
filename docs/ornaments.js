export function updateOrnaments(ctx, ornaments, hand) {
  ornaments.forEach(o => {
    // 基礎座標、尺寸
    const cx = o.x;
    const cy = o.y;
    const w = o.width;
    const h = o.height;

    // 預設 scale = 1
    let targetScale = 1;

    if (hand && hand.x && hand.y) {
      const dx = hand.x - cx;
      const dy = hand.y - cy;
      const dist = Math.sqrt(dx*dx + dy*dy);

      // 半徑 180px 內放大
      if (dist < 180) {
        targetScale = 1.6 - (dist / 180) * 0.6; 
      }
    }

    // 緩動 (easing)
    o.scale += (targetScale - o.scale) * 0.15;

    // 套用繪製
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(o.scale, o.scale);
    ctx.drawImage(o.img, -w/2, -h/2, w, h);
    ctx.restore();
  });
}
