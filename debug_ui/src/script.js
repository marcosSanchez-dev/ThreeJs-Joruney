import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

//CHANGE COLOR
const parametersDebug = {
    color: 0xffff00,
    spin: () => {
        gsap.to(mesh.rotation,{
            y: (mesh.rotation.y + Math.PI / 2) * 2,
            duration: 3,
            ease: 'bounce'
        })
    }
}


/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: parametersDebug.color })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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

/*
    Debug
*/
const gui = new dat.GUI({closed: true, width: 400});
gui.add(mesh.position,'x',-3,3,0.01).name('eje X');
gui.add(mesh.position,'y',-2,2,0.01);
gui.add(mesh.position,'z',-4,4,0.01);
gui.add(mesh.rotation,'x',-4,4,0.01).name('rotate X');
gui.add(mesh,'visible');
gui.add(material,'wireframe')
gui.add(parametersDebug,'spin')


gui.addColor(parametersDebug,'color').onChange(() => {
    material.color.set(parametersDebug.color);
});

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()