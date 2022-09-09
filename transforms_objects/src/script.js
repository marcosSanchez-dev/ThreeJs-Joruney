import './style.css'
import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
mesh.position.set(0,0,0);
scene.add(mesh);

//Group
const group = new THREE.Group();
scene.add(group);

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: 'green'})
)
cube1.position.x = 1
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 1),
    new THREE.MeshBasicMaterial({color: 'cyan'})
)
cube1.position.x = 1
group.add(cube2)

group.position.x = 0.9
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth / 2.2,
    height: window.innerHeight
}
//Scale
mesh.scale.set(0.5,0.1,0.2);

//Rotation
mesh.rotation.reorder('XYZ');
mesh.rotation.x = Math.PI / 2;
mesh.rotation.y = Math.PI / 2;
mesh.rotation.z = Math.PI / 4;

//AxesHelper
const axesHelper = new THREE.AxesHelper();
//hay que agregarlo a la escena
scene.add(axesHelper);
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(95, sizes.width / sizes.height)
camera.position.set(-1,0,0);
camera.lookAt(group.position);
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

//Linea de codigo final, que muestra lo que existe dentro de la "foto"
renderer.render(scene, camera)