// ornaments.js — 建立相簿（不負責動畫）

function createOrnaments(scene) {
    const group = new THREE.Group();
    const loader = new THREE.TextureLoader();

    const numImages = 8;
    const radius = 4;

    for (let i = 1; i <= numImages; i++) {
        const tex = loader.load(`assets/${i}.png`);
        const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        const geo = new THREE.PlaneGeometry(2, 2);

        const mesh = new THREE.Mesh(geo, mat);

        const angle = (i / numImages) * Math.PI * 2;
        mesh.position.set(Math.cos(angle) * radius, 2.5, Math.sin(angle) * radius);
        mesh.lookAt(0, 2.5, 0);

        group.add(mesh);
    }

    group.visible = false; // 預設不顯示
    scene.add(group);

    return group;
}
