// tree.js — 建立 3D 粒子樹（不負責動畫）

function createTree(scene) {
    const group = new THREE.Group();
    const geometry = new THREE.BufferGeometry();

    const count = 2500;
    const positions = new Float32Array(count * 3);
    const originalPositions = [];

    for (let i = 0; i < count; i++) {
        const level = Math.random();
        const radius = (1 - level) * 3;

        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius * (Math.random() * 0.3 + 0.7);
        const y = level * 6;
        const z = Math.sin(angle) * radius * (Math.random() * 0.3 + 0.7);

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        originalPositions.push({ x, y, z });
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        size: 0.06,
        color: 0x00ff88
    });

    const pointCloud = new THREE.Points(geometry, material);
    group.add(pointCloud);

    scene.add(group);

    return {
        group,
        geometry,
        originalPositions
    };
}
