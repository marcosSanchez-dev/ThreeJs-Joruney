import "./stlye.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

/*
class Test {
  constructor(num1, num2) {
    this.num1 = num1;
    this.num2 = num2;
  }

  suma() {
    console.log(this.num1 + this.num2);
  }
}

const Suma1 = new Test(5, 5);
Suma1.suma();

console.log(Suma1);
*/

class Figure {
  constructor(params) {
    this.params = {
      x: 0,
      y: 0,
      z: 0,
      ry: 0,
      ...params,
    };

    this.group = new THREE.Group();
    scene.add(this.group);
  }

  createBody() {
    const geometry = new THREE.BoxGeometry(1, 1.5, 1);
    const material = new THREE.MeshLambertMaterial();
    const body = new THREE.Mesh(geometry, material);
    this.group.add(body);
  }

  createHead() {
    const geometry = new THREE.BoxGeometry(1.4, 1.4, 1.4);
    const material = new THREE.MeshLambertMaterial();
    const head = new THREE.Mesh(geometry, material);
    this.group.add(head);

    head.position.y = 1.65;
  }

  createArms() {
    for (let i = 0; i < 2; i++) {
      const geometry = new THREE.BoxGeometry(0.25, 1, 0.25);
      const material = new THREE.MeshLambertMaterial();
      const arm = new THREE.Mesh(geometry, material);
      const m = i % 2 === 0 ? 1 : -1;

      const armGroup = new THREE.Group();
      armGroup.add(arm);


      armGroup.position.x = m * 0.8;
      armGroup.position.y = 0.1;
      armGroup.rotation.z = degreesToRadians(30 * m);

      this.group.add(armGroup);

      const boxHelper = new THREE.BoxHelper(armGroup, 'white');
      this.group.add(boxHelper);
  }

  init() {
    this.createBody();
    this.createHead();
    this.createArms();
  }
}

const figure = new Figure(1, 2, 3);
figure.init();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 5;
scene.add(camera);

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// Lights

const directionalLight = new THREE.DirectionalLight("white", 0.5);
directionalLight.position.x = 5;
directionalLight.position.y = 5;
directionalLight.position.z = 5;
scene.add(directionalLight);

const helper = new THREE.DirectionalLightHelper(directionalLight, 3);
scene.add(helper);

const ambientLight = new THREE.AmbientLight("white", 0.2);
scene.add(ambientLight);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(0x000000, 0);

//Resize

window.addEventListener("resize", () => {
  //update sizes
  sizes.height = window.innerHeight;
  sizes.width = window.innerWidth;

  //update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//degrees To Radians

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/*
    Animaciones
*/

const clock = new THREE.Clock();

function tick() {
  //time
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

tick();
