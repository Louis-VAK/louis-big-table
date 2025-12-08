// ===============================================================
//  GitHub Pages 可直接執行版 main.js（無 import）
// ===============================================================

// Renderer & Scene
const canvas = document.getElementById("three-canvas");
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x000000, 0.18);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1.5, 5);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 10;

// =====================================================
// 粒子聖誕樹
// =====================================================
const NUM = 2400;
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

for (let i = 0; i < NUM; i++) {
    const p = treePoint();
    const idx = i * 3;

    basePositions[idx] = p.x;
    basePositions[idx + 1] = p.y;
    basePositions[idx + 2] = p.z;

    positions[idx] = p.x + (Math.random() - 0.5) * 2;
    positions[idx + 1] = p.y + (Math.random() - 0.5) * 2;
    positions[idx + 2] = p.z + (Math.random() - 0.5) * 2;

    velocities[idx] = velocities[idx + 1] = velocities[idx + 2] = 0;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const material = new THREE.PointsMaterial({
    color: 0x88ffcc,
    size: 0.05,
    transparent: true,
    opacity: 0.9
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// =====================================================
// 相片環繞
// =====================================================
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
    const texture = loader.load(src);
    const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(1, 1, 1);
    scene.add(sprite);
    sprites.push(sprite);
});

// =====================================================
// 指標互動
// =====================================================
const pointer = new THREE.Vector3();
const pointerNDC = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

function updatePointer(evt) {
    const rect = canvas.getBoundingClientRect();

    pointerNDC.x = ((evt.clientX - rect.left) / rect.width) * 2 - 1;
    pointerNDC.y = -((evt.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(pointerNDC, camera);
    const hit = new THREE.Vector3();
    raycaster.ray.intersectPlane(groundPlane, hit);
    pointer.copy(hit);
}

window.addEventListener("pointermove", updatePointer);

// =====================================================
// 動畫主迴圈
// =====================================================
function animate() {
    requestAnimationFrame(animate);

    // 粒子回到樹形狀 + 推開互動
    for (let i = 0; i < NUM; i++) {
        const idx = i * 3;

        const dx = basePositions[idx] - positions[idx];
        const dy = basePositions[idx + 1] - positions[idx + 1];
        const dz = basePositions[idx + 2] - positions[idx + 2];

        velocities[idx] += dx * 0.02;
        velocities[idx + 1] += dy * 0.02;
        velocities[idx + 2] += dz * 0.02;

        const px = positions[idx] - pointer.x;
        const py = positions[idx + 1] - pointer.y;
        const pz = positions[idx + 2] - pointer.z;

        const dist = px * px + py * py + pz * pz;
        if (dist < 1.4) {
            const d = Math.sqrt(dist);
            const force = (1.4 - d) * 0.4;
            velocities[idx] += (px / d) * force;
            velocities[idx + 1] += (py / d) * force;
            velocities[idx + 2] += (pz / d) * force;
        }

        velocities[idx] *= 0.88;
        velocities[idx + 1] *= 0.88;
        velocities[idx + 2] *= 0.88;

        positions[idx] += velocities[idx];
        positions[idx + 1] += velocities[idx + 1];
        positions[idx + 2] += velocities[idx + 2];
    }

    geometry.attributes.position.needsUpdate = true;

    // 圖片旋轉
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

// Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
