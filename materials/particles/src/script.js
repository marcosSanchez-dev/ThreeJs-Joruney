import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png');
//Particles
//geometry
/*const particlesGeometry = new THREE.SphereGeometry(1,32,32)
//material
const particlesMaterial = new THREE.PointsMaterial({
    size:0.02,
    sizeAttenuation:true
})
//points
const particles = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add( particles)*/


//buffer Geometry & Material
const particlesGeometry = new THREE.BufferGeometry()
let count = 3000
//const particlesMaterial = new THREE.MeshBasicMaterial({color:'green',wireframe:true})
const particlesMaterial = new THREE.PointsMaterial({
    size:0.3,
    sizeAttenuation:true,
    color:'white',
    transparent:true,
    alphaMap: particleTexture,
    /*alphaTest: 0.001,*/ //Le dice al GPU que renderizar
    /*depthTest: false*/ //ve si una particula esta frente a otra
    depthWrite: false, //si existe otro objeto en la escena, no encima las particulas
    blending: THREE.AdditiveBlending,
    vertexColors: true
})
//vertices del buffer
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
)
particlesGeometry.setAttribute(
    'color', 
    new THREE.BufferAttribute(colors, 3)
)

//Points Mesh
const particles = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add( particles)

/*//TEST CUBE
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial({color:'red'})
)
scene.add(cube)*/

//SOUND
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
scene.add( listener );

// create an Audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( '/music/eclipse.wav', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop(false);
    sound.setVolume(0.1);
    window.addEventListener('click', () => {
        sound.play();
    })
    window.ontouchstart = sound.play();
});

// create an AudioAnalyser, passing in the sound and desired fftSize
const analyser = new THREE.AudioAnalyser( sound, 32 );

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
camera.position.z = 3
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

    // get the average frequency of the sound
    const data = analyser.getAverageFrequency();

    //Update ParticlesMaterial
    particles.rotation.y = elapsedTime * 0.070
    for (let i = 0; i < count; i++) {
        const i3 = i * 3
        const x = particlesGeometry.attributes.color.array[i3]
        particlesGeometry.attributes.color.array[i3+ 1] = Math.sin(elapsedTime + x)
        particlesGeometry.attributes.color.array[i3+2] = Math.cos(elapsedTime + x)
        //particlesGeometry.attributes.position.array[i3] = Math.cos(elapsedTime)
    }
    
    particlesGeometry.attributes.color.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()