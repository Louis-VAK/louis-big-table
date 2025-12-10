function createTree(scene) {
  const particleCount = 1800;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const originalPositions = [];

  const colors = [];
  const color = new THREE.Color();

  for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 1.2 * (1 - i / particleCount);
    const angle = Math.random() * Math.PI * 2;
    const height = (i / particleCount) * 2.5;

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = height - 1;

    positions.push(x, y, z);
    originalPositions.push(x, y, z);

    // ⭐ 顏色：聖誕風格（紅 / 綠 / 金）
    if (Math.random() < 0.3) color.set(0xff4444);   // 紅
    else if (Math.random() < 0.6) color.set(0x44ff44); // 綠
    else color.set(0xffdd55); // 金

    colors.push(color.r, color.g, color.b);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );

  geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  geometry.userData.originalPositions = originalPositions;

  const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.03
  });

  const tree = new THREE.Points(geometry, material);
  scene.add(tree);
  return tree;
}
