function createTree(scene) {
  const particleCount = 1800;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const originalPositions = [];
  const colors = [];

  const colorOptions = [
    new THREE.Color(0xff4444), //紅
    new THREE.Color(0x44ff44), //綠
    new THREE.Color(0xffd700), //金
  ];

  for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 1.2 * (1 - i / particleCount);
    const angle = Math.random() * Math.PI * 2;
    const height = (i / particleCount) * 2.5;

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = height - 1;

    positions.push(x, y, z);
    originalPositions.push(x, y, z);

    const c = colorOptions[Math.floor(Math.random() * 3)];
    colors.push(c.r, c.g, c.b);
  }

  geometry.setAttribute("position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("color",
    new THREE.Float32BufferAttribute(colors, 3)
  );

  geometry.userData.originalPositions = originalPositions;

  const material = new THREE.PointsMaterial({
    vertexColors: true,
    size: 0.028,
  });

  const tree = new THREE.Points(geometry, material);
  scene.add(tree);

  return tree;
}
