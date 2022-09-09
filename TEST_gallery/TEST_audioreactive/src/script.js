import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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

// Object
const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45);
const material = new THREE.MeshBasicMaterial({color: 'red'});

for(let i = 0; i < 100; i++){
    const donut = new THREE.Mesh(donutGeometry, material)
    donut.position.x = (Math.random() - 0.5) * 10
    donut.position.y = (Math.random() - 0.5) * 10
    donut.position.z = (Math.random() - 0.5) * 10
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI
    const scale = Math.random()
    donut.scale.set(scale, scale, scale)
    scene.add(donut)
}

const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry( 0.5,15,15),
    new THREE.MeshBasicMaterial({wireframe:true})
);
scene.add(sphere1);

function audioReactive() {
    
    // get the average frequency of the sound
    const data = analyser.getAverageFrequency();

    sphere1.scale.x = Math.PI * (data / 255 * 5)
    sphere1.scale.y = Math.PI * (data / 255 * 5)
    sphere1.scale.z = Math.PI * (data / 255 * 5)
    console.log(sphere1.rotation.x);
    

    window.requestAnimationFrame(audioReactive)
}
audioReactive()

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    // get the average frequency of the sound
    //const data = analyser.getAverageFrequency();

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()