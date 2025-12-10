// main.js — 控制模式、動畫、旋轉、爆散、相簿切換

let scene, camera, renderer, controls;
let tree, album;

let mode = "tree"; // "tree" | "album"
let explode = 0;   // 爆散係數

init();
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 3, 12);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    tree = createTree(scene);
    album = createOrnaments(scene);

    const video = document.getElementById("video");
    initHandTracking(video);

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

    if (mode === "tree") {
        animateTree();
    } else if (mode === "album") {
        animateAlbum();
    }

    checkGestureSwitch();
    renderer.render(scene, camera);
}

// ---------------------------------------------
// Tree Mode Animation
// ---------------------------------------------
function animateTree() {
    album.visible = false;
    tree.group.visible = true;

    const pos = tree.geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const o = tree.originalPositions[i];
        pos.setXYZ(
            i,
            o.x + (Math.random() - 0.5) * explode,
            o.y + (Math.random() - 0.5) * explode,
            o.z + (Math.random() - 0.5) * explode
        );
    }
    pos.needsUpdate = true;

    if (explode > 0) explode *= 0.92; // 自動回收
}

// ---------------------------------------------
// Album Mode Animation
// ---------------------------------------------
function animateAlbum() {
    tree.group.visible = false;
    album.visible = true;

    album.rotation.y += 0.01;
}

// ---------------------------------------------
// Gesture-based Mode Switching
// ---------------------------------------------
function checkGestureSwitch() {
    if (!window.handGesture) return;

    if (mode === "tree" && handGesture === "open") {
        mode = "album";
        explode = 15; // 進入時爆散特效
    }

    if (mode === "album" && handGesture === "forward") {
        mode = "tree";
    }
}
