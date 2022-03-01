import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { OBJLoader } from "./jsm/loaders/OBJLoader.js"
import Stats from './jsm/libs/stats.module.js'
import { GUI } from './jsm/libs/lil-gui.module.min.js'
import { ShapeUtils } from 'three'

let fov = 140;
let aspect = 1;  // the canvas default
let near = 0.1;
let far = 200;
let camera;
let canvas;
let renderer;
let scene;
let wall = "images/wall.jpg";
let earth = "images/earth.jpg";
let alien = "objects/Alien_Animal.obj";
let controls;
let sky = "images/night_sky.jpg";
let shapes = [];
let animalObj = [];

function main() {

    setup();
    lighting();
    loadObject();
    render();

}

function setup() {
    canvas = document.getElementById('asgn');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({ canvas });
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 20, 40);
    scene = new THREE.Scene();
    controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();

}

function render() {
    makeCube(10, 10, 10, wall, 0,0,0);
    makeSphere(10, earth, 30,0,0);
    makeCylinder(0.1, 15, 10, wall, -30, 0,0);
    loadObject(0, 20);
    loadSkyBox(sky);
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

        shapes.forEach((shape, ndx) => {
            const speed = .5 + ndx * .1;
            const rot = time * speed;
            shape.rotation.x = rot;
            shape.rotation.y = rot;
        });

        animalObj.forEach((animal, ndx) => {
            const speed = .5 + ndx * .1;
            const rot = time * speed;
            animal.rotation.y = rot;
        });
        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}

function makeCylinder(radiusTop, radiusBottom, height, image, locX, locY, locZ) {
    const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 30)

    if (image != "") {
        const loader = new THREE.TextureLoader();
        loader.load(image, (texture) => {
            const material = new THREE.MeshBasicMaterial({
                map: texture,
            });
            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.translateX(locX);
            cylinder.translateY(locY);
            cylinder.translateX(locZ);
            shapes.push(cylinder);
            scene.add(cylinder);
        });
    }
    else {
        const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 })
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.translateX(locX);
        cylinder.translateY(locY);
        cylinder.translateX(locZ);
        shapes.push(cylinder);
        scene.add(cylinder);
    }
}

function lighting() {
    // {
    //     const skyColor = 0xB1E1FF;  // light blue
    //     const groundColor = 0xB97A20;  // brownish orange
    //     const intensity = 1;
    //     const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    //     scene.add(light);
    // }

    {
        const color = 0xFFFFFF;
        const intensity = 0.8;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        light.target.position.set(0, 0, 0);
        scene.add(light);
        scene.add(light.target);
    }
}

function loadObject(locX, locY) {
    const objLoader = new OBJLoader();
    objLoader.load(alien, (root) => {
        scene.add(root);
        root.translateX(locX);
        root.translateY(locY);
        animalObj.push(root);
    });
}

function makeCube(boxWidth = 1, boxHeight = 1, boxDepth = 1, image = "", locX, locY, locZ) {
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    if (image != "") {
        const loader = new THREE.TextureLoader();
        loader.load(image, (texture) => {
            const material = new THREE.MeshBasicMaterial({
                map: texture,
            });
            var cube = new THREE.Mesh(geometry, material);
            cube.translateX(locX);
            cube.translateY(locY);
            cube.translateX(locZ);
            shapes.push(cube);
            scene.add(cube);
        });
    }
    else {
        const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 })
        var cube = new THREE.Mesh(geometry, material);
        cube.translateX(locX);
        cube.translateY(locY);
        cube.translateX(locZ);
        shapes.push(cube);
        scene.add(cube);

    }
}

function makeSphere(radius = 1, image = "", locX, locY, locZ) {
    const geometry = new THREE.SphereGeometry(radius)

    if (image != "") {
        const loader = new THREE.TextureLoader();
        loader.load(image, (texture) => {
            const material = new THREE.MeshBasicMaterial({
                map: texture,
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.translateX(locX);
            sphere.translateY(locY);
            sphere.translateX(locZ);
            shapes.push(sphere);
            scene.add(sphere);
        });
    }
    else {
        const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 })
        const sphere = new THREE.Mesh(geometry, material);
        sphere.translateX(locX);
        sphere.translateY(locY);
        sphere.translateX(locZ);
        shapes.push(sphere);
        scene.add(sphere);
    }
}

function loadSkyBox(image)
{
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
      image,
      () => {
        const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
        rt.fromEquirectangularTexture(renderer, texture);
        scene.background = rt.texture;
      });
}

function spotlight()
{
    console.log("spotlight");
}

main();
spotlight();

