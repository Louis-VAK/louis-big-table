import * as THREE from "https://unpkg.com/three@0.152.2/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.152.2/examples/jsm/controls/OrbitControls.js";

// Canvas
const canvas = document.getElementById("three-canvas");

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Scene
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.2);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1.5, 5);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

// Particle Tree
const NUM = 2500;
const base = new Float32Array(NUM * 3);
const pos = new Float32Array(NUM * 3);
const vel = new Float32Array(NUM * 3);

function treePoint() {
    const h = 3.0;
    const r0 = 1.4;

    const y = Math.random() * h;
    const r = r0 * (1 - y / h) * (0.6 + Math.random() * 0.4);
    const a = Math.random() * Math.PI * 2;

    return { x: r * Math.cos(a), y: y - h / 2, z: r * Math.sin(a) };
}

for (let i = 0; i < NUM; i++) {
    const p = treePoint();
    const idx = i * 3;

    base[idx] = p.x;
    base[idx + 1] = p.y;
    base[idx + 2] = p.z;

    pos[idx] = p.x + (Math.random() - 0.5) * 2;
    pos[idx + 1] = p.y + (Math.random() - 0.5) * 2;
    pos[idx + 2] = p.z + (Math.random() - 0.5) * 2;
}

const geo = new THREE.BufferGeometry();
geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

const mat = new THREE.PointsMaterial({
    color: 0x88ffcc,
    size: 0.05,
    transparent: true,
    opacity: 0.9
});

const particles = new THREE.Points(geo, mat);
scene.add(particles);

// Load Images
const loader = new THREE.TextureLoader();
const imgs = [
    "assets/pic1.png",
    "assets/pic2.png",
    "assets/pic3.png",
    "assets/pic4.png",
    "assets/pic5.png",
    "assets/logo.png"
];
const sprites = [];

imgs.forEach(src => {
    const tex = loader.load(src);
    const sm = new THREE.SpriteMaterial({ map: tex });
    const sp = new THREE.Sprite(sm);
    sp.scale.set(1.2, 1.2, 1.2);
    sprites.push(sp);
    scene.add(sp);
});

// Pointer
const pointer = new THREE.Vector3();
window.addEventListener("pointermove", e => {
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const ray = new THREE.Raycaster();
    ray.setFromCamera({ x, y }, camera);

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    ray.ray.intersectPlane(plane, pointer);
});

// Animation
function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < NUM; i++) {
        const idx = i * 3;

        const dx = base[idx] - pos[idx];
        const dy = base[idx + 1] - pos[idx + 1];
        const dz = base[idx + 2] - pos[idx + 2];

        vel[idx] += dx * 0.02;
        vel[idx + 1] += dy * 0.02;
        vel[idx + 2] += dz * 0.02;

        const px = pos[idx] - pointer.x;
        const py = pos[idx + 1] - pointer.y;
        const pz = pos[idx + 2] - pointer.z;

        const dist = Math.sqrt(px * px + py * py + pz * pz);
        if (dist < 1.2) {
            const f = (1.2 - dist) * 0.4;
            vel[idx] += (px / dist) * f;
            vel[idx + 1] += (py / dist) * f;
            vel[idx + 2] += (pz / dist) * f;
        }

        vel[idx] *= 0.9;
        vel[idx + 1] *= 0.9;
        vel[idx + 2] *= 0.9;

        pos[idx] += vel[idx];
        pos[idx + 1] += vel[idx + 1];
        pos[idx + 2] += vel[idx + 2];
    }

    geo.attributes.position.needsUpdate = true;

    const t = Date.now() * 0.0005;
    const r = 2.3;
    sprites.forEach((s, i) => {
        const ang = (i / sprites.length) * Math.PI * 2 + t;
        s.position.set(Math.cos(ang) * r, 0, Math.sin(ang) * r);
        s.lookAt(camera.position);
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();
