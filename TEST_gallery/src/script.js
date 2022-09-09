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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg')
const bricksAmbientOcclusionTexture = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg')
const bricksRoughnessTexture = textureLoader.load('/textures/bricks/roughness.jpg')

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg')
const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg')
const grassRoughnessTexture = textureLoader.load('/textures/grass/roughness.jpg')

const floorAmbientOcclusionTexture = textureLoader.load('/textures/floor/ambientOcclusion.jpg')
const floorHeightTexture = textureLoader.load('/textures/floor/height')
const floorNormalTexture = textureLoader.load('/textures/floor/normal.jpg')
const floorRoughnessTexture = textureLoader.load('/textures/floor/roughness.jpg')
const floorColorTexture = textureLoader.load('/textures/floor/basecolor.jpg')

const cuadro1Texture = textureLoader.load('/textures/cuadros/1.jpg')
const cuadro2Texture = textureLoader.load('/textures/cuadros/2.jpg')
const cuadro3Texture = textureLoader.load('/textures/cuadros/3.jpg')
const cuadro4Texture = textureLoader.load('/textures/cuadros/4.jpg')
cuadro4Texture.generateMipmaps = false;
cuadro4Texture.minFilter = THREE.NearestFilter

const particleTexture = textureLoader.load('/textures/particles/2.png');



/**
 * Gallery OBjects
 */
const gallery = new THREE.Group()
scene.add(gallery)  

const largestWallsGeometry = new THREE.PlaneGeometry(20,3)

const sideWallsGeometry = new THREE.PlaneGeometry(10,3)

const wallsMaterial =  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
    side: THREE.DoubleSide
})

bricksColorTexture.repeat.x = 3
bricksColorTexture.wrapS = THREE.RepeatWrapping
/*bricksColorTexture.repeat.set(4, 4)
bricksAmbientOcclusionTexture.repeat.set(4, 4)
bricksNormalTexture.repeat.set(4, 4)
bricksRoughnessTexture.repeat.set(4, 4)

bricksColorTexture.wrapS = THREE.RepeatWrapping
bricksAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
bricksNormalTexture.wrapS = THREE.RepeatWrapping
bricksRoughnessTexture.wrapS = THREE.RepeatWrapping

bricksColorTexture.wrapT = THREE.RepeatWrapping
bricksAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
bricksNormalTexture.wrapT = THREE.RepeatWrapping
bricksRoughnessTexture.wrapT = THREE.RepeatWrapping*/


const wall1 = new THREE.Mesh(
    largestWallsGeometry,
    wallsMaterial
)
wall1.position.x = -5
wall1.position.y = 1.3
wall1.rotation.y = Math.PI * 0.50    
wall1.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(wall1.geometry.attributes.uv.array, 2))


const wall2 = new THREE.Mesh(
    sideWallsGeometry,
    wallsMaterial
)
wall2.position.z = -10 //azul axis helper
wall2.position.y = 1.3
wall2.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(wall2.geometry.attributes.uv.array, 2))


const wall3 = new THREE.Mesh(
    sideWallsGeometry,
    wallsMaterial
)
wall3.position.y = 1.3
wall3.rotation.y = Math.PI 
wall3.position.z = 10 //azul axis helper
wall3.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(wall3.geometry.attributes.uv.array, 2))


const wall4 = new THREE.Mesh(
    largestWallsGeometry,
    wallsMaterial
)
wall4.position.x = 4.9
wall4.position.y = 1.3
wall4.rotation.y = Math.PI * -0.50
wall4.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(wall4.geometry.attributes.uv.array, 2))



// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.5, 3, 100, 100),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        normalMap: doorNormalTexture,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture
    })
)
door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))
door.position.x = 5
door.position.y = 1.3
door.rotation.y = Math.PI * 0.50
door.position.z = 8

//CUADROS

for (let i = 0; i < 6; i++) {
    const cuadrosWall1 = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 2),
        new THREE.MeshStandardMaterial({
            color:'white',
            map: cuadro1Texture
        })
    )
    cuadrosWall1.position.x = -4.9    
    cuadrosWall1.rotation.y = Math.PI * 0.50
    cuadrosWall1.position.y = 1.5    
    cuadrosWall1.position.z = -6 + i*2.5    
    gallery.add(cuadrosWall1)    
}

for (let i = 0; i < 3; i++) {
    const cuadrosWall2 = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 2),
        new THREE.MeshStandardMaterial({
            color:'white', 
            map: cuadro3Texture
        })
    )
    cuadrosWall2.position.x = -2.5 + i*2.5//rojo axis helper
    cuadrosWall2.rotation.y = Math.PI/0.50
    cuadrosWall2.position.y = 1.5    
    cuadrosWall2.position.z = -9.9    
    gallery.add(cuadrosWall2)    
}

for (let i = 0; i < 3; i++) {
    const cuadrosWall3 = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 2),
        new THREE.MeshStandardMaterial({
            color:'white', 
            map: cuadro4Texture
        })
    )
    cuadrosWall3.position.x = -2.5 + i*2.5//rojo axis helper
    cuadrosWall3.rotation.y = Math.PI * -1
    cuadrosWall3.position.y = 1.5    
    cuadrosWall3.position.z = 9.9    
    gallery.add(cuadrosWall3)    
}

for (let i = 0; i < 6; i++) {
    const cuadrosWall4 = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 2),
        new THREE.MeshStandardMaterial({
            color:'white',
            map: cuadro2Texture
        })
    )
    cuadrosWall4.position.x = 4.8    
    cuadrosWall4.rotation.y = Math.PI * -0.50
    cuadrosWall4.position.y = 1.5    
    cuadrosWall4.position.z = -6 + i*2.5    
    gallery.add(cuadrosWall4)    
}

gallery.add(wall1,wall2,wall3,wall4,door)

//Arbustos

const bushes = new THREE.Group()
gallery.add(bushes)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })
for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2 // Random angle
    const radius = 11.5 + Math.random() * 2// Random radius
    const x = Math.cos(angle) * radius        // Get the x position using cosinus
    const z = Math.sin(angle) * radius        // Get the z position using sinus
    
    const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
    const bushMesh = new THREE.Mesh(bushGeometry, bushMaterial)
    bushMesh.castShadow = true
    bushMesh.position.set(x, 0.3, z) 
    bushes.add(bushMesh)   
}
//bushes.castShadow = true

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(9.9, 20),
    new THREE.MeshStandardMaterial({ 
        map: floorColorTexture,
        aoMap: floorAmbientOcclusionTexture,
        normalMap: floorNormalTexture,
        roughnessMap: floorRoughnessTexture,
        displacementMap: floorHeightTexture
    })
)
floorColorTexture.repeat.x = 3
floorColorTexture.repeat.y = 3
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))

floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.position.x = -0.05

const garden = new THREE.Mesh(
    new THREE.PlaneGeometry(27, 30),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture
    })
)
garden.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(garden.geometry.attributes.uv.array, 2))
garden.rotation.x = - Math.PI * 0.5
garden.position.y = -0.1

grassColorTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8)
grassNormalTexture.repeat.set(8, 8)
grassRoughnessTexture.repeat.set(8, 8)

grassColorTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassColorTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping

//public lights
const lampGeometry = new THREE.CylinderGeometry( 0.2, 0.2, 3, 32 );
const lampMaterial = new THREE.MeshStandardMaterial( {color: 'grey'} );
const lamp1 = new THREE.Mesh( lampGeometry, lampMaterial );
const lamp2 = new THREE.Mesh( lampGeometry, lampMaterial );
const lamp3 = new THREE.Mesh( lampGeometry, lampMaterial );
const lamp4 = new THREE.Mesh( lampGeometry, lampMaterial );
lamp1.position.x = 9
lamp1.position.y = 1.5
lamp1.position.z = 10
lamp2.position.x = 9
lamp2.position.y = 1.5
lamp2.position.z = -10
lamp3.position.x = -9
lamp3.position.y = 1.5
lamp3.position.z = -10
lamp4.position.x = -9
lamp4.position.y = 1.5
lamp4.position.z = 10

gallery.add(floor,garden,lamp1,lamp2,lamp3,lamp4)

//axis helper
const axisHelper = new THREE.AxisHelper(3)
scene.add(axisHelper)

//PARTICLES
const particlesGeometry = new THREE.BufferGeometry()
let count = 1000
const particlesMaterial = new THREE.PointsMaterial({
    size:0.8,
    sizeAttenuation:true,
    color:'white',
    transparent:true,
    alphaMap: particleTexture,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})
const positions = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 100
}

particlesGeometry.setAttribute(
    'position', 
    new THREE.BufferAttribute(positions, 3)
)
//Points Mesh
const particles = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add( particles)   

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

const direcionalLight = new THREE.DirectionalLight('white',0.2)
//scene.add(direcionalLight)

const pointLight = new THREE.PointLight('white', 1, 100 )
pointLight.position.set(0,3,0)
scene.add(pointLight)

// Door light
/*const centerLight = new THREE.RectAreaLight('white',2,10,10)
centerLight.rotation.y = Math.PI * 0.50
centerLight.rotation.x = Math.PI * -0.25 

const rectLightHelper = new RectAreaLightHelper( centerLight );
centerLight.add( rectLightHelper );
window.requestAnimationFrame(() =>
{
    centerLight.position.copy(centerLight.position)
    centerLight.quaternion.copy(centerLight.quaternion)
    //rectAreaLightHelper.update()
})*/

const lamp1Light = new THREE.PointLight('#ff7d46', 2.5, 7)
lamp1Light.position.set(9, 3, 10)


const lamp2Light = new THREE.PointLight('#ff7d46', 2.5, 7)
lamp2Light.position.set(9, 3, -10)


const lamp3Light = new THREE.PointLight('#ff7d46', 2.5, 7)
lamp3Light.position.set(-9, 3, -10)


const lamp4Light = new THREE.PointLight('#ff7d46', 2.5, 7)
lamp4Light.position.set(-9, 3, 10)


gallery.add(lamp1Light,lamp2Light,lamp3Light,lamp4Light)
/*const fog = new THREE.Fog('#262837', 1, 50)
scene.fog = fog*/

// SHADOWS
floor.receiveShadow = true

lamp1Light.castShadow = true
lamp1Light.shadow.mapSize.width = 1024
lamp1Light.shadow.mapSize.height = 1024
lamp1Light.shadow.camera.far = 7

lamp2Light.castShadow = true
lamp2Light.shadow.mapSize.width = 1024
lamp2Light.shadow.mapSize.height = 1024
lamp2Light.shadow.camera.far = 7

lamp3Light.castShadow = true
lamp3Light.shadow.mapSize.width = 1024
lamp3Light.shadow.mapSize.height = 1024
lamp3Light.shadow.camera.far = 7

lamp4Light.castShadow = true
lamp4Light.shadow.mapSize.width = 1024
lamp4Light.shadow.mapSize.height = 1024
lamp4Light.shadow.camera.far = 7

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
camera.position.x = 14
camera.position.y = 12
camera.position.z = 15
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
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
//renderer.setClearColor('#262837')
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    
    //Update ParticlesMaterial
    particles.rotation.y = elapsedTime * -0.070
    //particlesGeometry.attributes.position.needsUpdate = true

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()