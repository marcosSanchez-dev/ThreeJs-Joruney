import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
console.log(dat);
//gui
const gui = new dat.GUI();

/**
    TEXTURAS
 */
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
    console.log('Comenzo a cargase la imagen');
}
loadingManager.onProgress = () => {
    console.log('se está cargando la imagen');
}
loadingManager.onLoaded = () => {
    console.log('Se cargo la imagen');
}
loadingManager.onError = () => {
    console.log('hubo un Error al cargar');
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg');
const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorMetalTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughTexture = textureLoader.load('/textures/door/roughness.jpg');

const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
const gradientTexture = textureLoader.load('/textures/gradients/3.jpg');

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.jpg',
    '/textures/environmentMaps/0/nx.jpg',
    '/textures/environmentMaps/0/py.jpg',
    '/textures/environmentMaps/0/ny.jpg',
    '/textures/environmentMaps/0/pz.jpg',
    '/textures/environmentMaps/0/nz.jpg'
]);

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//OBJETOS
//const material = new THREE.MeshBasicMaterial({map: matcapTexture});
//const material = new THREE.MeshNormalMaterial();
//const material = new THREE.MeshMatcapMaterial();
//const material = new THREE.MeshDepthMaterial();
//const material = new THREE.MeshLambertMaterial();
/*const material = new THREE.MeshPhongMaterial();
material.matcap = matcapTexture;
material.shininess = 10;
material.specular = new THREE.Color('red');*/
/*const material = new THREE.MeshToonMaterial();
material.gradientMap = gradientTexture;
gradientTexture.generateMipmaps = false;
gradientTexture.magFilter = THREE.NearestFilter;*/
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;
/*
material.map = doorColorTexture;
material.aoMap = doorAmbientTexture; // agrega sombras
material.aoMapIntensity = 5;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.5;
//material.wireframe = true;
material.metalnessMap = doorMetalTexture;
material.roughnessMap = doorRoughTexture;
material.normalMap = doorNormalTexture;
material.normalScale.set(0.6,0.6);
material.transparent = true;
material.alphaMap = doorAlphaTexture;*/


//GUI
gui.add(material, 'metalness').min(0).max(1).step(0.0001);
gui.add(material, 'roughness').min(0).max(1).step(0.0001);
/*gui.add(material, 'aoMapIntensity').min(0).max(10).step(0.0001);
gui.add(material, 'displacementScale').min(0).max(1).step(0.0001);*/

const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(0.2,64,64),
    material
);

sphere.geometry.setAttribute('uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2) //el 2 es la cantidad de digitos en el array que forman un vertices
);

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1,1,10,10),
    material
);
plane.position.x = - 1.5

plane.geometry.setAttribute('uv2',
    new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2) //el 2 es la cantidad de digitos en el array que forman un vertices
);

const torus = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.1,0.2,64,128),
    material
)
torus.position.x = 1.5;

torus.geometry.setAttribute('uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2) //el 2 es la cantidad de digitos en el array que forman un vertices
);

scene.add(sphere,plane,torus);

material.transparent = true;
material.opacity = 1;
//material.flatShading = true;
material.side = THREE.DoubleSide;

//LUZ

const ambientLight = new THREE.AmbientLight('white', 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight('white',0.5);
pointLight.position.x = 2;
pointLight.position.y = 0;
pointLight.position.z = 4;
scene.add(pointLight);

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

    //update Objects

    /*sphere.rotation.y = 0.1 * elapsedTime;
    plane.rotation.y = 0.1 * elapsedTime;
    torus.rotation.y = 0.1 * elapsedTime;
    
    sphere.rotation.x = 0.15 * elapsedTime;
    plane.rotation.x = 0.15 * elapsedTime;
    torus.rotation.x = 0.15 * elapsedTime;*/

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()