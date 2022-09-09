import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Lights
 */
/*const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)*/

const ambientLight = new THREE.AmbientLight(/*'white',0.5*/);
ambientLight.color = new THREE.Color('white');
ambientLight.intensity = 0.5;
//scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight('cyan',0.3);
//scene.add(directionalLight)

const hemisphereLight = new THREE.HemisphereLight('red','green',0.8);
//scene.add(hemisphereLight)

const pointLight = new THREE.PointLight('blue',0.8);
//scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight('pink',2,1,1);
//rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight('red', 0.5, 10, Math.PI * 0.1, 0.25, 1)
spotLight.position.set(0, 2, 3)
scene.add(spotLight,spotLight.target);

const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
scene.add(rectAreaLightHelper)

//HELPER Lights

const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphereLight, 0.2)
scene.add(hemisphereLightHelper)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
scene.add(pointLightHelper)

const spotLightHelper = new THREE.SpotLightHelper(spotLight)
scene.add(spotLightHelper)

window.requestAnimationFrame(() =>
{
    spotLightHelper.update()
})

/*const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight)
window.requestAnimationFrame(() =>
{
    rectAreaLightHelper.position.copy(rectAreaLight.position)
    rectAreaLightHelper.quaternion.copy(rectAreaLight.quaternion)
    rectAreaLightHelper.update()
})
scene.add(rectAreaLightHelper)*/

//GUI
const pointFolder = gui.addFolder('PointLight'); 
const directionalFolder = gui.addFolder('DirectionalLight'); 
const ambientFolder = gui.addFolder('AmbientLight'); 
const rectFolder = gui.addFolder('RectAreaLight'); 
const spotFolder = gui.addFolder('spotLight'); 

ambientFolder.add(ambientLight,'intensity').min(0).max(1).step(0.001);
directionalFolder.add(directionalLight.position,'x').min(0).max(10).step(0.001).name('directionalLight x');
directionalFolder.add(directionalLight.position,'z').min(0).max(10).step(0.001).name('directionalLight z');
pointFolder.add(pointLight.position,'x').min(-10).max(10).step(0.001).name('pointLight x');
pointFolder.add(pointLight.position,'z').min(-10).max(10).step(0.001).name('pointLight z');
pointFolder.add(pointLight,'distance').min(0.1).max(5).step(0.001);
rectFolder.add(rectAreaLight,'intensity').min(0).max(10).step(0.001);
rectFolder.add(rectAreaLight,'width').min(0).max(10).step(0.001);
rectFolder.add(rectAreaLight,'height').min(0).max(10).step(0.001);
spotFolder.add(spotLight.position,'x').min(-10).max(10).step(0.001).name('spotLight x');
spotFolder.add(spotLight.position,'z').min(-10).max(10).step(0.001).name('spotLight z');
spotFolder.add(spotLight.target.position,'z').min(-1).max(1).step(0.0001).name('target z');
spotFolder.add(spotLight.target.position,'x').min(-1).max(1).step(0.0001).name('target x');


/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()