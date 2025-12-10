const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#000");

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 5);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

// --------------------- Tree ---------------------
const tree = createTree(scene);
const geom = tree.geometry;
const pos = geom.attributes.position.array;
const original = geom.userData.originalPositions;

// --------------------- Decorations ---------------------
const { group: ornamentGroup, ornaments, ornamentOriginal } = createOrnaments(scene);

// --------------------- State ---------------------
let MODE = "TREE"; // TREE / GALLERY
let lockUntil = 0;

let palmCount = 0;
let forwardCount = 0;

// ---------------------
document.getElementById("startBtn").onclick = () => {
    startHandTracking();
    lockUntil = performance.now() + 1200; // 啟動保護
};

// =====================================================
//                     ANIMATION
// =====================================================
function animate() {
    requestAnimationFrame(animate);

    const now = performance.now();
    const hd = window.handData;
    const hand = hd?.pos;
    const isPalm = hd?.gesture === "PALM";
    const zVal = hd?.z ?? 0; // index finger Z

    // ---------------------------
    // 手勢統計（穩定偵測）
    // ---------------------------
    if (isPalm) {
        palmCount++;
    } else {
        palmCount = 0;
    }

    if (zVal < -0.25) { // 手往前推（接近相機）
        forwardCount++;
    } else {
        forwardCount = 0;
    }

    const PALM_STABLE = palmCount >= 18;     // Palm open ~0.45秒
    const FORWARD_STABLE = forwardCount >= 10; // Forward ~0.25秒


    // =====================================================
    //                    A 模組（TREE）
    // =====================================================
    if (MODE === "TREE") {

        // Palm → 切到 B
        if (PALM_STABLE && now > lockUntil) {
            MODE = "GALLERY";
            lockUntil = now + 800;

            layoutGallery(ornaments, 2.3, 1.8);
            tree.material.transparent = true;
            tree.material.opacity = 0.12;
        }

        // ------ 手勢左右旋轉 ------
        if (hand) {
            const rot = (hand.x - 0.5) * 3;
            tree.rotation.y = rot;
            ornamentGroup.rotation.y = rot;
        }

        // ------ 粒子爆散 ------
        let dist = hand ? 1 - hand.y : 0;
        let explosion = Math.pow(dist, 2.2) * 3.0;

        // 粒子更新
        for (let i = 0; i < pos.length; i += 3) {
            pos[i]     = original[i]     * (1 + explosion);
            pos[i + 1] = original[i + 1] * (1 + explosion);
            pos[i + 2] = original[i + 2] * (1 + explosion);
        }
        geom.attributes.position.needsUpdate = true;

        // ------ 小圖片跟著爆散 ------
        for (let i = 0; i < ornaments.length; i++) {
            const sp = ornaments[i];
            const base = ornamentOriginal[i];

            sp.position.set(
                base.x * (1 + explosion * 1.3),
                base.y * (1 + explosion * 1.3),
                base.z * (1 + explosion * 1.3)
            );
        }
    }


    // =====================================================
    //                    B 模組（GALLERY）
    // =====================================================
    else if (MODE === "GALLERY") {

        // 手左右 → 相簿旋轉
        if (hand) {
            const spin = (hand.x - 0.5) * 2;
            ornamentGroup.rotation.y += spin * 0.02;
        }

        // 手往前推 → 回 A 模組
        if (FORWARD_STABLE && now > lockUntil) {
            MODE = "TREE";
            lockUntil = now + 800;

            layoutNormal(ornaments, ornamentOriginal);
            tree.material.opacity = 1.0;
        }
    }

    renderer.render(scene, camera);
}

animate();
