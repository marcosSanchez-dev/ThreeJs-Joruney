import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'
import sphereMaterial from '../static/textura_2.jpg' //not compressed
import cubeMaterial from '../static/texture_3.png' //compressed
import matcapMaterial from '../static/8.png' 
import gradientMapTexture from '../static/textures/gradients/5.jpg'

//TEXTURAS
const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const matcapTexture = textureLoader.load(matcapMaterial,
    () => { 
        console.log('loading finished')
    },
    () => {
        console.log('loading progressing')
    },
    () => {
        console.log('loading ERROR')
});

const gradientTexture = textureLoader.load(gradientMapTexture);

const sphereTexture = textureLoader.load(sphereMaterial);

const cube1Texture = textureLoader.load(cubeMaterial);

const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '../static/textures/environmentMaps/0/px.jpg',
    '../static/textures/environmentMaps/0/nx.jpg',
    '../static/textures/environmentMaps/0/py.jpg',
    '../static/textures/environmentMaps/0/ny.jpg',
    '../static/textures/environmentMaps/0/pz.jpg',
    '../static/textures/environmentMaps/0/nz.jpg'
])

//FILTROS de Magnificacion y Minificacion
/*sphereTexture.generateMipmaps = false
sphereTexture.minFilter = THREE.NearestFilter;*/

cube1Texture.generateMipmaps = false;
cube1Texture.minFilter = THREE.NearestFilter;

//Escena
const scene = new THREE.Scene();

//canvas
const canvas = document.querySelector('.webGL');

//GUI parameters
let buttonToggle = false;

const guiParameters = {
    cube1Color: "#ffae23",
    cube2Color: 0x00ff00,
    sphere1Color: 0x0000ff,
    sphere3Specular: 0x0000ff,
    ambientLight: 0x0000ff,
    wireframe: () => {
        if(!buttonToggle){
            cube1.material.wireframe = true;
            cube2.material.wireframe = true;
            sphere1.material.wireframe = true;
            buttonToggle = true;
        }else if(buttonToggle){
            cube1.material.wireframe = false;
            cube2.material.wireframe = false;
            sphere1.material.wireframe = false;
            buttonToggle = false;
        }

    },
    fullScreen : () => {
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
    }
}
//MESH
const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1,2,2,2),
    new THREE.MeshBasicMaterial({map:cube1Texture})
);
cube1.position.x = -1.5;

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1,5,5,5),
    new THREE.MeshMatcapMaterial() //VERDE
);
cube2.position.x = 1;   
cube2.matcap = matcapTexture;

const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry( 0.5,32,32),
    new THREE.MeshBasicMaterial({map: sphereTexture })
);
sphere1.position.y = -2;

const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry( 0.5,32,32),
    new THREE.MeshDepthMaterial()
);
sphere2.position.y = 2;
sphere2.position.x = 1;

const sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry( 0.5,32,32),
    new THREE.MeshPhongMaterial()
);
sphere3.position.y = 0;
sphere3.position.x = -6;
sphere3.material.shininess = 100;

const sphere4 = new THREE.Mesh(
    new THREE.SphereGeometry( 0.5,32,32),
    new THREE.MeshStandardMaterial()
);
sphere4.position.y = -1;
sphere4.position.x = -5.5;
sphere4.material.envMap = environmentMapTexture;

const torus1 = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.5, 0.5, 16, 100 ),
    new THREE.MeshNormalMaterial()
);
torus1.position.y = 1;
torus1.position.x = -1;
torus1.position.z = -2;
torus1.material.flatShading = true;

const torus2 = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.5, 0.5, 16, 100 ),
    new THREE.MeshLambertMaterial()
);
torus2.position.y = 0;
torus2.position.x = -4;

const torus3 = new THREE.Mesh(
    new THREE.TorusBufferGeometry(0.5, 0.5, 16, 100 ),
    new THREE.MeshToonMaterial()
);
torus3.position.x = 3.5; 
torus3.material.gradientMap = gradientTexture;
gradientTexture.magFilter =  THREE.NearestFilter;
//gradientTexture.generateMipmaps  = false;

//Group
const group = new THREE.Group();
scene.add(group,);
group.add(cube1);
group.add(cube2);
group.add(sphere1);
group.add(sphere2);
group.add(sphere3);
group.add(sphere4);
group.add(torus1);
group.add(torus2);
group.add(torus3);

//LUZ
const ambientLight = new THREE.AmbientLight('blue',0.5)
scene.add(ambientLight)
const pointLight = new THREE.PointLight('red',0.5);
pointLight.position.x = -4;
pointLight.position.y = 0;
pointLight.position.z = 3;
const pointLight2 = new THREE.PointLight('green');
pointLight2.position.x = 3.5;
pointLight2.position.z = 3;
//pointLight2.distance = 50;
scene.add(pointLight,pointLight2);  

//Rotation
//group.rotation.y = Math.PI / 2;
//group.rotation.z = Math.PI / 2;
//group.rotation.x = Math.PI / 4;

const axesHelper = new THREE.AxesHelper(1.2);
scene.add(axesHelper);
group.position.set(0,1,0);

//SIZES    
const sizes = {
    height: window.innerHeight,
    width: window.innerWidth
}

window.addEventListener('resize', (e) => {
    //Update Sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //Update Camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    //Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

});


//CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
camera.position.z = 4 //Zoom out
//camera.position.y = 1 //Zoom out
scene.add(camera);
//camera.lookAt(group.position);

//FULL SCREEN
/*window.addEventListener('dblclick', () =>
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
});*/


//CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//GUI 
const gui = new dat.GUI({closed:false});

gui.add(sphere4.material,'roughness').min(0).max(1).step(0.001).name('s4 Roughness');
gui.add(sphere4.material,'metalness').min(0).max(1).step(0.001).name('s4 Roughness');

gui.add(sphere3.material,'shininess').min(0).max(100).step(0.01).name('sphere3 Shininess');
gui.addColor(guiParameters,'sphere3Specular').onChange(() => {
    sphere3.material.specular.set(guiParameters.sphere3Specular); 
});

gui.add(guiParameters,'ambientLight').onChange(() => {
    ambientLight.color.set(guiParameters.ambientLight);
});

gui.add(pointLight2,'distance').min(0.1).max(100).step(0.001);

gui.addColor(guiParameters,'cube1Color').onChange(() => {
    cube1.material.color.set(guiParameters.cube1Color);
});
gui.addColor(guiParameters,'cube2Color').onChange(() => {
    cube2.material.color.set(guiParameters.cube2Color);
});
gui.addColor(guiParameters,'sphere1Color').onChange(() => {
    sphere1.material.color.set(guiParameters.sphere1Color);
});

gui.add(guiParameters,'wireframe').name('wireframe GROUP');
gui.add(guiParameters,'fullScreen').name('FULL SCREEN');


//Carpeta en GUI

/*const folder1 = gui.addFolder('COLORES');
folder1.add(guiParameters,'cube1Color');
folder1.add(guiParameters,'cube2Color');
folder1.add(guiParameters,'sphere1Color');*/

//Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

//ANIMATION
gsap.from(cube1.position,{
    duration: 2 ,
    y: 2,
    delay: 0
});
gsap.to(cube1.position,{
    duration: 2,    
    y: -2,
    delay: 2,
    ease: 'bounce',
    yoyo: true
});

let test = gsap.to(cube2.position, {
    z: -2,
    duration: 2,
    ease: 'elastic',
    delay: 3,
    yoyo: true,
    repeat: -1
})
//test.repeat(1)

gsap.to(sphere1.position,{
    x: 2,
    duration: 2,
    ease: 'slowMo',
    delay: 2,
    yoyo: true
})


//UPDATE CONTROLS
const updateVisual = () => {
    controls.update();
    renderer.render(scene, camera)

    window.requestAnimationFrame(updateVisual);
}

updateVisual();