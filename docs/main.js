// ===============================================================
//  GitHub Pages 可直接執行版 main.js（無 import）
// ===============================================================

const THREE_JS = window.THREE;

// Renderer & Scene
const canvas = document.getElementById("three-canvas");
const renderer = new THREE_JS.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE_JS.Scene();
scene.fog = new THREE_JS.FogExp2(0x000000, 0.2);

// Camera
const camera = new THREE_JS.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1.5, 5);

// Controls（非 module 版本）
const controls = new THREE_JS.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 10;

// =====================================================
// 粒子聖誕樹
// =====================================================
const NUM = 2500;
const basePositions = new Float32Array(NUM * 3);
const positions = new Float32Array(NUM * 3);
const velocities = new Float32Array(NUM * 3);

function treePoint() {
    const height = 3.0;
    const radius = 1.4;

    const y = Math.random() * height;
    const r = radius * (1 - y / height) * (0.6 + Math.random() * 0.4);
    const angle = Math.random() * Math.PI * 2;

    return {
        x: r * Math.cos(angle),
        y: y - height / 2,
        z: r * Math.sin(angle)
    };
}

// 初始化粒子
for (let i = 0; i < NUM; i++) {
    const p = treePoint();

    const index = i * 3;
    basePositions[index] = p.x;
    basePositions[index + 1] = p.y;
    basePositions[index + 2] = p.z;

    positions[index] = p.x + (Math.random() - 0.5) * 2;
    positions[index + 1] = p.y + (Math.random() - 0.5) * 2;
    positions[index + 2] = p.z + (Math.random() - 0.5) * 2;

    velocities[index] = 0;
    velocities[index + 1] = 0;
    velocities[index + 2] = 0;
}

const geometry = new THREE_JS.BufferGeometry();
geometry.setAttribute("position", new THREE_JS.BufferAttribute(positions, 3));

const material = new THREE_JS.PointsMaterial({
    color: 0x88ffcc,
    size: 0.05,
    transparent: true,
    opacity: 0.9
});

const particles = new THREE_JS.Points(geometry, material);
scene.add(particles);

// =====================================================
// 相片 Sprite（環繞聖誕樹）
// =====================================================
const loader = new THREE_JS.TextureLoader();
const imgs = [
    "assets/pic1.png",
    "assets/pic2.png",
    "assets/pic3.png",
    "assets/pic4.png",
    "assets/pic5.png",
    "assets/logo.png"
];

const sprites = [];

imgs.forEach((src) => {
    const texture = loader.load(src);
    const mat = new THREE_JS.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE_JS.Sprite(mat);
    sprite.scale.set(1, 1, 1);
    scene.add(sprite);
    sprites.push(sprite);
});

// =====================================================
// 指標（互動用）
// =====================================================
const pointer = new THREE_JS.Vector3();
const pointer2D = new THREE_JS.Vector2();

function updatePointer(evt) {
    const rect = canvas.getBoundingClientRect();
    const x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;

    pointer2D.set(x, y);

    const ray = new THREE_JS.Raycaster();
    ray.setFromCamera(pointer2D, camera);

    const plane = new THREE_JS.Plane(new THREE_JS.Vector3(0, 1, 0), 0);
    const hit = new THREE_JS.Vector3();

    ray.ray.intersectPlane(plane, hit);
    pointer.copy(hit);
}

window.addEventListener("pointermove", updatePointer);

// =====================================================
// 動畫
// =====================================================
function animate() {
    requestAnimationFrame(animate);

    // ================= 粒子回到形狀 ==================
    for (let i = 0; i < NUM; i++) {
        const idx = i * 3;

        const dx = basePositions[idx] - positions[idx];
        const dy = basePositions[idx + 1] - positions[idx + 1];
        const dz = basePositions[idx + 2] - positions[idx + 2];

        velocities[idx] += dx * 0.02;
        velocities[idx + 1] += dy * 0.02;
        velocities[idx + 2] += dz * 0.02;

        // ================= 互動推開效果 ==================
        const px = positions[idx] - pointer.x;
        const py = positions[idx + 1] - pointer.y;
        const pz = positions[idx + 2] - pointer.z;

        const dist = px * px + py * py + pz * pz;
        if (dist < 1.2) {
            const d = Math.sqrt(dist);
            const force = (1.2 - d) * 0.4;
            velocities[idx] += (px / d) * force;
            velocities[idx + 1] += (py / d) * force;
            velocities[idx + 2] += (pz / d) * force;
        }

        velocities[idx] *= 0.9;
        velocities[idx + 1] *= 0.9;
        velocities[idx + 2] *= 0.9;

        positions[idx] += velocities[idx];
        positions[idx + 1] += velocities[idx + 1];
        positions[idx + 2] += velocities[idx + 2];
    }

    geometry.attributes.position.needsUpdate = true;

    // ====================== 相片環繞 ======================
    const t = Date.now() * 0.0004;
    const radius = 2.3;

    sprites.forEach((s, i) => {
        const angle = (i / sprites.length) * Math.PI * 2 + t;
        s.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius);
        s.lookAt(camera.position);
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();

// resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
