const canvas = document.getElementById("scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#000");

const camera = new THREE.PerspectiveCamera(60,
  window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.8, 5);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

const tree = createTree(scene);
const geom = tree.geometry;
const pos = geom.attributes.position.array;
const original = geom.userData.originalPositions;

const { group: ornamentGroup, ornaments } = createOrnaments(scene);

let mode = "A";  
let bRotation = 0;

document.getElementById("startBtn").onclick = () => startHandTracking();

function animate() {
  requestAnimationFrame(animate);

  const H = window.handData;

  if (mode === "A") {
    if (H.palmOpenFrames > 20) mode = "B";

    const rotY = (H.x - 0.5) * 2;
    tree.rotation.y = rotY * 2.2;
    ornamentGroup.rotation.y = rotY * 2.2;

    const dist = 1 - H.y;
    const explosion = Math.pow(dist, 2.2) * 2.6;

    for (let i = 0; i < pos.length; i += 3) {
      pos[i]     = original[i]     * (1 + explosion);
      pos[i + 1] = original[i + 1] * (1 + explosion);
      pos[i + 2] = original[i + 2] * (1 + explosion);
    }
    geom.attributes.position.needsUpdate = true;

    updateOrnamentsA(ornaments, explosion);
  }

  else if (mode === "B") {
    if (H.pushFrames > 10) mode = "A";

    bRotation += (H.x - 0.5) * 0.1;
    updateOrnamentsB(ornaments, bRotation);
  }

  renderer.render(scene, camera);
}

animate();
