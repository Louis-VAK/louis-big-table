function createTree(scene) {
  const particleCount = 1800;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const originalPositions = []; // ⭐ 重要：記錄原始位置，用來做爆散後回復

  for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 1.2 * (1 - i / particleCount);
    const angle = Math.random() * Math.PI * 2;
    const height = (i / particleCount) * 2.5;

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = height - 1;

    positions.push(x, y, z);
    originalPositions.push(x, y, z); // ⭐ 保存原始樹形
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  // ⭐ 把原始位置掛在 geometry 上給 main.js 用
  geometry.userData.originalPositions = originalPositions;

  const material = new THREE.PointsMaterial({
    color: 0x66ccff,
    size: 0.025,
  });

  const tree = new THREE.Points(geometry, material);
  scene.add(tree);
  return tree;
}
