import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { OBJLoader } from "./jsm/loaders/OBJLoader.js"
import Stats from './jsm/libs/stats.module.js'
import { GUI } from './jsm/libs/lil-gui.module.min.js'
import { ShapeUtils } from 'three'

let fov = 100;
let aspect = 1;  // the canvas default
let near = 0.1;
let far = 200;
let camera;
let canvas;
let renderer;
let scene;
let earth = "images/wall.jpg";
let alien = "objects/Alien_Animal.obj";
let controls;

function main() {

    setup();
    renderCube(10,10,10, true, earth);
    lighting();
    // loadObject();

}

function setup() {
    canvas = document.getElementById('asgn');
    renderer = new THREE.WebGLRenderer({ canvas });
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 20, 40);
    scene = new THREE.Scene();
    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

}

function renderCube(boxWidth = 1, boxHeight = 1, boxDepth = 1, rotate = true, image = "") {
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

    let cubes = [];
    if (image != "") {
        const loader = new THREE.TextureLoader();
        loader.load(image, (texture) => {
            const material = new THREE.MeshBasicMaterial({
                map: texture,
            });
            const cube = new THREE.Mesh(geometry, material);
            cubes.push(cube);
            scene.add(cube);
        });
    }
    else {
        const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 })
        const cube = new THREE.Mesh(geometry, material);
        cubes.push(cube);
        scene.add(cube);
    }


    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function render(time) {
        time *= 0.001;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        cubes.forEach((cube, ndx) => {
            const speed = .2 + ndx * .1;
            const rot = time * speed;
            cube.rotation.x = rot;
            cube.rotation.y = rot;
        });
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function lighting()
{
    {
        const skyColor = 0xB1E1FF;  // light blue
        const groundColor = 0xB97A20;  // brownish orange
        const intensity = 1;
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
        scene.add(light);
    }

    {
    const color = 0xFFFFFF;
    const intensity = 0.8;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(0, 0, 0);
    scene.add(light);
    scene.add(light.target);
    }
}

function loadObject() {
    const objLoader = new OBJLoader();
    objLoader.load(alien, (root) => {
        scene.add(root);
    });

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }
    
      function render() {
    
        if (resizeRendererToDisplaySize(renderer)) {
          const canvas = renderer.domElement;
          camera.aspect = canvas.clientWidth / canvas.clientHeight;
          camera.updateProjectionMatrix();
        }
    
        renderer.render(scene, camera);
    
        requestAnimationFrame(render);
      }
    
      requestAnimationFrame(render);
}

main();

