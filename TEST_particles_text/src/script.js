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
//text texture
const matcapTexture=  textureLoader.load("/textures/matcaps/8.png")

//TEXTO
const fontLoader = new THREE.FontLoader();
fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new THREE.TextGeometry(
            'GRID', {
                font: font,
                size:1,
                height:0.2,
                curveSegment: 5,
                bevelEnabled : true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 4
            }
        );
        textGeometry.center();

        const material = new THREE.MeshStandardMaterial({color:'white'});
        //material.matcap = matcapTexture;
        //material.wireframe = true;
        const text = new THREE.Mesh(textGeometry,material);
        scene.add(text);
    }
);

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
    depthWrite: false,
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

//SOUND
// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
scene.add( listener );

// create an Audio source
const sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
audioLoader.load( '/music/Tiempo_SNIPPET.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop(false);
    sound.setVolume(0.5);
    window.addEventListener('click', () => {
        sound.play();
    })
    window.ontouchstart = sound.play();
});

// create an AudioAnalyser, passing in the sound and desired fftSize
const analyser = new THREE.AudioAnalyser( sound, 32 );

//lights
const pointLight = new THREE.PointLight()
pointLight.color = new THREE.Color('cyan')
pointLight.intensity = 2
//pointLight.distance = 5
pointLight.position.set(0,0,1)
scene.add(pointLight)

const rectAreaLight = new THREE.RectAreaLight();
rectAreaLight.intensity =  10
rectAreaLight.color.set('cyan')
scene.add(rectAreaLight);
/*const hemisphereLight = new THREE.HemisphereLight('cyan','black');
scene.add(hemisphereLight); */

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

//FULL SCREEN
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
});

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
    }
    particlesGeometry.attributes.color.needsUpdate = true

    //update lights
    pointLight.position.x = Math.sin(elapsedTime) * 5
    //pointLight.position.z = Math.cos(elapsedTime) * 2
    pointLight.distance = 1 * data/15

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()