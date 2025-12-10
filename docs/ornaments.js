function createOrnaments(scene) {
  const group = new THREE.Group();
  scene.add(group);

  const textureLoader = new THREE.TextureLoader();

  const textures = [
    "assets/1.jpg", "assets/2.jpg", "assets/3.jpg",
    "assets/4.jpg", "assets/5.jpg", "assets/6.jpg",
  ].map(src => textureLoader.load(src));

  const ornaments = textures.map(tex => {
    const geo = new THREE.PlaneGeometry(0.22, 0.22);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    return mesh;
  });

  return { group, ornaments };
}

function updateOrnamentsA(ornaments, explosionLevel) {
  ornaments.forEach((m, i) => {
    const angle = (i / ornaments.length) * Math.PI * 2;
    const r = 0.8 + explosionLevel * 0.4;

    m.position.set(
      Math.cos(angle) * r,
      -0.4 + Math.sin(angle * 2) * 0.25,
      Math.sin(angle) * r
    );

    m.scale.set(
      1 + explosionLevel * 0.5,
      1 + explosionLevel * 0.5,
      1
    );
  });
}

function updateOrnamentsB(ornaments, rotationY) {
  const radius = 1.8;
  ornaments.forEach((m, i) => {
    const angle = rotationY + (i / ornaments.length) * Math.PI * 2;

    m.position.set(
      Math.cos(angle) * radius,
      0,
      Math.sin(angle) * radius
    );

    m.scale.set(0.55, 0.55, 1); // B 模組圖片放大 ×2
  });
}
