import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js";

import { handPos } from "./hand.js";

let scene, camera, renderer, controls;
let treePoints, treeMaterial;

init();
animate();

function init() {
  const canvas = document.getElementById("scene");

  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  scene = new THREE.Scene();
  scene.background = new THREE.Color("black");

  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(0, 0, 60);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // ----------------------------
  // 建立粒子樹
  // ----------------------------

  const count = 6000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const radius = Math.random() * 10;
    const height = Math.random() * 25 - 10;

    positions[i * 3] = Math.sin((height / 25) * Math.PI) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.cos((height / 25) * Math.PI) * radius;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  treeMaterial = new THREE.ShaderMaterial({
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uHand: { value: new THREE.Vector2(-1, -1) },
      uExplode: { value: 0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uExplode;
      uniform vec2 uHand;

      attribute vec3 position;

      void main() {

        vec3 pos = position;

        // 手勢爆散力
        float dx = pos.x - (uHand.x * 20.0);
        float dy = pos.y - (uHand.y * 20.0);
        float dist = sqrt(dx*dx + dy*dy);

        float force = uExplode * smoothstep(6.0, 0.0, dist);

        pos.x += dx * force * 0.15;
        pos.y += dy * force * 0.15;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = 3.0;
      }
    `,
    fragmentShader: `
      void main() {
        float d = length(gl_PointCoord - vec2(0.5));
        if (d > 0.5) discard;
        gl_FragColor = vec4(0.2, 1.0, 1.0, 1.0);
      }
    `,
  });

  treePoints = new THREE.Points(geometry, treeMaterial);
  scene.add(treePoints);

  window.addEventListener("resize", onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  treeMaterial.uniforms.uTime.value += 0.02;

  // ----------------------------
  // 手勢 → 3D 爆散控制
  // ----------------------------
  if (handPos) {
    treeMaterial.uniforms.uHand.value.set(
      (handPos.x - 0.5) * 2,     // 映射到 -1 ~ 1
      -(handPos.y - 0.5) * 2
    );

    // 手靠近 → 爆散啟動
    treeMaterial.uniforms.uExplode.value += 0.05;
    if (treeMaterial.uniforms.uExplode.value > 1) {
      treeMaterial.uniforms.uExplode.value = 1;
    }
  } else {
    // 手離開 → 慢慢復原
    treeMaterial.uniforms.uExplode.value -= 0.03;
    if (treeMaterial.uniforms.uExplode.value < 0) {
      treeMaterial.uniforms.uExplode.value = 0;
    }
  }

  renderer.render(scene, camera);
}
