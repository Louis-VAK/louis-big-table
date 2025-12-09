// particles.js
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";
import { handPosition3D } from "./hand-tracking.js";

export let particleTree, particleGeometry, basePositions;

export function createParticleTree(scene) {
  const particleCount = 3500;
  particleGeometry = new THREE.BufferGeometry();
  const pos = new Float32Array(particleCount * 3);

  function treeRadius(h) {
    return (2.5 - h) * 0.4;
  }

  for (let i = 0; i < particleCount; i++) {
    const h = Math.random() * 2.8;
    const r = treeRadius(h);
    const a = Math.random() * Math.PI * 2;

    pos[i * 3] = Math.cos(a) * r;
    pos[i * 3 + 1] = h;
    pos[i * 3 + 2] = Math.sin(a) * r;
  }

  basePositions = pos.slice();

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));

  const material = new THREE.PointsMaterial({
    color: 0x66ffee,
    size: 0.025
  });

  particleTree = new THREE.Points(particleGeometry, material);
  scene.add(particleTree);
}

let t = 0;

// Z2 中度深度影響
const DEPTH_MULTIPLIER = 2.2;

export function updateParticles() {
  if (!particleGeometry) return;

  t += 0.01;
  const arr = particleGeometry.attributes.position;

  const tmp = new THREE.Vector3();
  const hand3D = new THREE.Vector3();

  if (handPosition3D) {
    hand3D.set(handPosition3D.x, handPosition3D.y, handPosition3D.z * DEPTH_MULTIPLIER);
  }

  for (let i = 0; i < arr.count; i++) {
    const ix = i * 3;
    const x0 = basePositions[ix];
    const y0 = basePositions[ix + 1];
    const z0 = basePositions[ix + 2];

    // 呼吸動態
    const wave = Math.sin(t + x0 * 2 + z0 * 2) * 0.005;

    let x = x0;
    let y = y0 + wave;
    let z = z0;

    // 手勢力場
    if (handPosition3D) {
      tmp.set(x, y, z);

      const dist = tmp.distanceTo(hand3D);

      if (dist < 0.6) {
        const force = tmp.clone()
          .sub(hand3D)
          .normalize()
          .multiplyScalar((0.6 - dist) * 0.05);

        x += force.x;
        y += force.y;
        z += force.z;
      }
    }

    arr.setXYZ(i, x, y, z);
  }

  arr.needsUpdate = true;
}
