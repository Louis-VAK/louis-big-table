// ornaments.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";
import { handPosition3D } from "./hand-tracking.js";

export let ornamentGroup;

export function createOrnaments(scene) {
  ornamentGroup = new THREE.Group();
  scene.add(ornamentGroup);

  const loader = new THREE.TextureLoader();

  const imgs = [
    "./assets/img1.png",
    "./assets/img2.png",
    "./assets/img3.png",
    "./assets/img4.png",
    "./assets/img5.png",
    "./assets/img6.png"
  ];

  function treeRadius(h) {
    return (2.5 - h) * 0.4;
  }

  function randomPoint() {
    let h = Math.random() * 2.6 + 0.1;
    let r = treeRadius(h);
    let a = Math.random() * Math.PI * 2;

    return new THREE.Vector3(
      Math.cos(a) * r,
      h,
      Math.sin(a) * r
    );
  }

  let used = [];

  function noOverlap(p) {
    return used.every(u => u.distanceTo(p) > 0.9);
  }

  imgs.forEach((src) => {
    let p;
    do {
      p = randomPoint();
    } while (!noOverlap(p));

    used.push(p);

    const tex = loader.load(src);
    const sm = new THREE.SpriteMaterial({ map: tex });
    const sp = new THREE.Sprite(sm);

    sp.position.copy(p);
    sp.scale.set(1, 1, 1);
    sp.userData.base = 1;

    ornamentGroup.add(sp);
  });
}

export function updateOrnaments() {
  if (!ornamentGroup) return;
  if (!handPosition3D) {
    ornamentGroup.children.forEach(s => s.scale.set(1, 1, 1));
    return;
  }

  const hand = new THREE.Vector3(
    handPosition3D.x,
    handPosition3D.y,
    handPosition3D.z * 2.2
  );

  ornamentGroup.children.forEach(s => {
    const dist = s.position.distanceTo(hand);

    if (dist < 0.7) {
      s.scale.set(1.6, 1.6, 1);
    } else {
      s.scale.set(1, 1, 1);
    }
  });
}
