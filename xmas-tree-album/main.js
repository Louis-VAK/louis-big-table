/*
 * main.js
 *
 * This module sets up a Three.js scene with a particle Christmas tree and
 * floating photo sprites.  Particles are attracted back to their base
 * positions to form a tree shape.  When the pointer (mouse or touch) comes
 * close, particles and sprites are repelled, creating an interactive,
 * gesture‑like effect.  The code avoids external build steps by loading
 * dependencies from public CDNs at runtime.
 */

import * as THREE from 'https://unpkg.com/three@0.152.2/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js';

// Grab the canvas element where our renderer will draw
const canvas = document.getElementById('three-canvas');

// Create the core Three.js objects
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 5);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Add a soft exponential fog to fade particles into the background
scene.fog = new THREE.FogExp2(0x0a0a1a, 0.25);

// Add orbit controls to allow the user to rotate the view
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 10;

// === Particle System Setup ===
// Define how many particles to spawn; higher counts look smoother but cost more
const NUM_PARTICLES = 2500;
// Define the approximate height and radius of the tree
const treeHeight = 3.0;
const treeRadius = 1.4;

// Arrays to store base (target) positions, current positions and velocities
const basePositions = new Float32Array(NUM_PARTICLES * 3);
const positions = new Float32Array(NUM_PARTICLES * 3);
const velocities = new Float32Array(NUM_PARTICLES * 3);

// Helper function to generate a random point on a circular layer of the tree
function createTreePoint() {
  // Pick a random height along the tree
  const y = Math.random() * treeHeight;
  // Radius linearly decreases from the base to the top
  const maxR = treeRadius * (1 - y / treeHeight);
  // Add some randomness so the tree looks fluffy
  const r = maxR * (0.6 + 0.4 * Math.random());
  const angle = Math.random() * Math.PI * 2;
  const x = r * Math.cos(angle);
  const z = r * Math.sin(angle);
  return { x, y: y - treeHeight / 2, z };
}

// Populate the particles
for (let i = 0; i < NUM_PARTICLES; i++) {
  const point = createTreePoint();
  basePositions[i * 3] = point.x;
  basePositions[i * 3 + 1] = point.y;
  basePositions[i * 3 + 2] = point.z;
  // Start particles slightly displaced so they fall into place
  positions[i * 3] = point.x + (Math.random() - 0.5) * 2;
  positions[i * 3 + 1] = point.y + (Math.random() - 0.5) * 2;
  positions[i * 3 + 2] = point.z + (Math.random() - 0.5) * 2;
  velocities[i * 3] = velocities[i * 3 + 1] = velocities[i * 3 + 2] = 0;
}

// Create buffer geometry and assign initial positions
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// Create a material for the particles
const particleMaterial = new THREE.PointsMaterial({
  color: 0x88ffcc,
  size: 0.05,
  transparent: true,
  opacity: 0.8,
  depthWrite: false
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// === Sprite (Photo) Setup ===
const spriteTextures = [];
const sprites = [];
const textureLoader = new THREE.TextureLoader();

// List of user images – update the names here if you add/remove photos
const photoPaths = [
  'assets/pic1.png',
  'assets/pic2.png',
  'assets/pic3.png',
  'assets/pic4.png',
  'assets/pic5.png',
  'assets/logo.png'
];

for (const path of photoPaths) {
  const texture = textureLoader.load(path);
  spriteTextures.push(texture);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(mat);
  // Set a default size for each sprite; actual scale will be adjusted in render loop
  sprite.scale.set(0.8, 0.8, 0.8);
  scene.add(sprite);
  sprites.push(sprite);
}

// Function to distribute sprites evenly around the tree and rotate them over time
function updateSpritePositions(time) {
  const orbitRadius = 2.2;
  sprites.forEach((sprite, i) => {
    const angle = (i / sprites.length) * Math.PI * 2 + time * 0.0003;
    sprite.position.set(
      Math.cos(angle) * orbitRadius,
      0,
      Math.sin(angle) * orbitRadius
    );
    // Ensure the photo always faces the camera
    sprite.lookAt(camera.position);
  });
}

// Vector for pointer tracking in 3D world coordinates
const pointer = new THREE.Vector3();
const pointer2D = new THREE.Vector2();

// Convert screen coordinates to a point on the ground plane (y=0)
function updatePointerFromEvent(evt) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
  const y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;
  pointer2D.set(x, y);
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(pointer2D, camera);
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersect = new THREE.Vector3();
  raycaster.ray.intersectPlane(plane, intersect);
  pointer.copy(intersect);
}

// Event listeners for mouse and touch
window.addEventListener('pointermove', (evt) => updatePointerFromEvent(evt));
window.addEventListener('touchmove', (evt) => {
  if (evt.touches && evt.touches.length > 0) {
    updatePointerFromEvent({ clientX: evt.touches[0].clientX, clientY: evt.touches[0].clientY });
  }
});

// === Animation Loop ===
function animate() {
  requestAnimationFrame(animate);
  const dt = 1 / 60; // approximate fixed time step

  // Particle physics: move particles towards their base positions
  for (let i = 0; i < NUM_PARTICLES; i++) {
    const idx = i * 3;
    // Attraction back to base (spring behavior)
    const dx = basePositions[idx] - positions[idx];
    const dy = basePositions[idx + 1] - positions[idx + 1];
    const dz = basePositions[idx + 2] - positions[idx + 2];
    velocities[idx] += dx * 0.02;
    velocities[idx + 1] += dy * 0.02;
    velocities[idx + 2] += dz * 0.02;

    // Repulsion from the pointer; stronger when closer
    const px = positions[idx] - pointer.x;
    const py = positions[idx + 1] - pointer.y;
    const pz = positions[idx + 2] - pointer.z;
    const distSq = px * px + py * py + pz * pz;
    const influence = 0.8;
    const maxDist = influence;
    if (distSq < maxDist * maxDist) {
      const dist = Math.sqrt(distSq) + 1e-6;
      const strength = (maxDist - dist) / maxDist;
      velocities[idx] += (px / dist) * strength * 0.5;
      velocities[idx + 1] += (py / dist) * strength * 0.5;
      velocities[idx + 2] += (pz / dist) * strength * 0.5;
    }

    // Damping to avoid infinite oscillation
    velocities[idx] *= 0.90;
    velocities[idx + 1] *= 0.90;
    velocities[idx + 2] *= 0.90;

    // Integrate velocities
    positions[idx] += velocities[idx] * dt * 60;
    positions[idx + 1] += velocities[idx + 1] * dt * 60;
    positions[idx + 2] += velocities[idx + 2] * dt * 60;
  }
  particleGeometry.attributes.position.needsUpdate = true;

  // Update sprite positions and scales
  const time = performance.now();
  updateSpritePositions(time);

  sprites.forEach((sprite) => {
    const d = sprite.position.distanceTo(pointer);
    const minScale = 0.7;
    const maxScale = 1.4;
    const factor = Math.max(0, 1 - d / 2.5);
    const scale = minScale + (maxScale - minScale) * factor;
    sprite.scale.set(scale, scale, scale);
  });

  controls.update();
  renderer.render(scene, camera);
}

// Handle window resizes
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Kick off the animation loop
animate();