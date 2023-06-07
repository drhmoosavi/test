import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls";

console.clear();

const PI2 = Math.PI * 2;

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x160016);
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 21, 4);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;

let gu = {
  time: { value: 0 },
};

let sizes = [];
let shift = [];
let pushShift = () => {
  shift.push(
    Math.random() * Math.PI,
    Math.random() * Math.PI * 2,
    (Math.random() * 0.9 + 0.1) * Math.PI * 0.1,
    Math.random() * 0.9 + 0.1
  );
};
let pts = new Array(50000)
  .fill()
  .map((p) => {
    sizes.push(Math.random() * 1.5 + 0.5);
    pushShift();
    return new THREE.Vector3().randomDirection().multiplyScalar(Math.random() * 0.5 + 9.5);
  });
for (let i = 0; i < 100000; i++) {
  let r = 10,
    R = 40;
  let rand = Math.pow(Math.random(), 1.5);
  let radius = Math.sqrt(R * R * rand + (1 - rand) * r * r);
  pts.push(
    new THREE.Vector3().setFromCylindricalCoords(
      radius,
      (Math.random() - 0.5) * 2,
      Math.random() * 2 * Math.PI
    )
  );
  sizes.push(Math.random() * 1.5 + 0.5);
  pushShift();
}

let g = new THREE.BufferGeometry().setFromPoints(pts);
g.setAttribute("sizes", new THREE.Float32BufferAttribute(sizes, 1));
g.setAttribute("shift", new THREE.Float32BufferAttribute(shift, 4));
let m = new THREE.PointsMaterial({
  size: 0.125,
  transparent: true,
  depthTest: false,
  blending: THREE.AdditiveBlending,
  onBeforeCompile: (shader) => {
    shader.uniforms
