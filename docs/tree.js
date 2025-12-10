function createTree(scene) {
  const particleCount = 1800;
  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const original = [];

  for (let i = 0; i < particleCount; i++) {
    const radius = Math.random() * 1.2 * (1 - i / particleCount);
    const angle = Math.random() * Math.PI * 2;
    const height = (i / particleCount) * 2.5;

    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = height - 1;

    positions.push(x, y, z);
    original.push(x, y, z);
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.userData.originalPositions = original;

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.03,
    vertexColors: false,
  });

  const tree = new THREE.Points(geometry, material);
  scene.add(tree);
  return tree;
}
