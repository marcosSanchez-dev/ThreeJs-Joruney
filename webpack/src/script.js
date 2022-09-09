import './style.css';
import * as THREE from 'three';

console.log(THREE);

//creamos la escena
const scene = new THREE.Scene();

//creamos nuestro MESH
const geometry = new THREE.BoxGeometry(1,1,1); 
const material = new THREE.MeshBasicMaterial({color : 'red'});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);    

//sizes
const sizes = {
    width : 800,
    height : 600
};

// camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 3;
scene.add(camera);

//Renderer
const canvas = document.querySelector('.webGL');
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene,camera);