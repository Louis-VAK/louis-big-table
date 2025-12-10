function createOrnaments(scene) {
  const loader = new THREE.TextureLoader();

  const images = [
    "./assets/img1.png",
    "./assets/img2.png",
    "./assets/img3.png",
    "./assets/img4.png",
    "./assets/img5.png",
    "./assets/img6.png",
  ];

  const group = new THREE.Group();
  scene.add(group);

  const ornaments = [];

  images.forEach((img, i) => {
    const tex = loader.load(img);
    const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
    const sprite = new THREE.Sprite(mat);

    // A 模式：自然分布位置
    sprite.position.set(
      (Math.random() - 0.5) * 1.6, 
      Math.random() * 1.8 - 0.2,
      Math.random() * 0.8 - 0.4
    );

    sprite.scale.set(0.25, 0.25, 1);
    group.add(sprite);

    ornaments.push(sprite);
  });

  return { group, ornaments };
}

// ----------------- 相簿模式（水平圓環排列） -----------------
function layoutGallery(ornaments, R = 2.3, scale = 1.0) {
  const N = ornaments.length;

  ornaments.forEach((sp, i) => {
    const angle = (i / N) * Math.PI * 2;

    sp.position.set(Math.cos(angle) * R, 0, Math.sin(angle) * R);
    sp.scale.set(scale, scale, 1);
  });
}
