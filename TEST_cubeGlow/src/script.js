import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

//loaders
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Base
 */
// Debug
const gui = new dat.GUI()
const debugObject = {}
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//models
gltfLoader.load(
    '/models/animationSphere2.glb',
    (gltf) => {
        console.log(gltf);
        gltf.scene.scale.set(5, 5, 5)
        gltf.scene.position.set(19, 0, 0)
        gltf.scene.rotation.y = Math.PI * 0.5
        scene.add(gltf.scene)
    }
)

const sphereGeometry = new THREE.SphereGeometry( 5, 5, 5);
const sphereMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const sphere = new THREE.Mesh( sphereGeometry, sphereMaterial );
sphere.position.set(-13,0,0)
sphereMaterial.wireframe = true
scene.add( sphere );

const cubeGeometry = new THREE.BoxGeometry(5,5,5)
const cubeMaterial = new THREE.MeshBasicMaterial({color:'#FF5558'})
cubeMaterial.wireframe = false
const cube = new THREE.Mesh(cubeGeometry,cubeMaterial)
scene.add(cube)

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
camera.position.set(4, 1, -37)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

//ligths
const ambientLight = new THREE.AmbientLight( 0xffffff);
//pointLight.position.set( 10, 10, 10 );
scene.add( ambientLight );

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.type = THREE.PCFSoftShadowMap

//Post processing

const effectComposer = new EffectComposer(renderer)
effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
effectComposer.setSize(sizes.width, sizes.height)

const renderPass = new RenderPass(scene, camera)
effectComposer.addPass(renderPass)

const unrealBloomPass = new UnrealBloomPass()
unrealBloomPass.enabled = false 
effectComposer.addPass(unrealBloomPass)

/**
 * Animate
 */
const tick = () =>
{
    // Update controls
    controls.update()

    // Render
    //renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()