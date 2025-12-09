window.createTree = function (scene) {
  const particleCount = 3000;
  const geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount; i++) {
    const y = rand(-1, 1);
    const radius = 1.5 * (1 - Math.abs(y));

    const angle = rand(0, Math.PI * 2);
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y * 3;
    positions[i * 3 + 2] = z;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0x00eaff,
    size: 0.03,
  });

  const tree = new THREE.Points(geometry, material);
  scene.add(tree);

  return tree;
};
