import * as THREE from 'three'
import { OrbitControls } from './jsm/controls/OrbitControls.js'
import { OBJLoader } from "./jsm/loaders/OBJLoader.js"
import Stats from './jsm/libs/stats.module.js'
import { GUI } from './jsm/libs/lil-gui.module.min.js'
import { ShapeUtils } from 'three'

let fov = 100;
let aspect = 1;  // the canvas default
let near = 0.1;
let far = 2000;
let camera;
let canvas;
let renderer;
let scene;
let wall = "images/wall.jpg";
let earth = "images/earth.jpg";
let sun = "images/sun.jpg";
let jupiter = "images/jupiter.jpg";
let mars = "images/mars.jpg";
let mercury = "images/mercury.jpg";
let neptune = "images/neptune.jpg";
let uranus = "images/uranus.jpg";
let venus = "images/venus.jpg";
let saturn = "images/saturn.jpg";
let alien = "objects/Alien_Animal.obj";
let controls;
let sky = "images/night_sky.jpg";
let shapes = [];
let animalObj = [];
let gui;
let cameraTarget = [10, 0, 0];

function main() {

    setup();
    makeLabelCanvas(200, 200, "fog room")
    loadObject();
    render();
    // testRender();
    GUImenu();


}

function setup() {

    canvas = document.getElementById('asgn');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderer = new THREE.WebGLRenderer({ canvas });
    gui = new GUI();
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 20, 500);
    scene = new THREE.Scene();
    controls = new OrbitControls(camera, canvas);
    controls.target.set(cameraTarget[0], cameraTarget[1], cameraTarget[2]);
    controls.update();

}

function planet() {
    makeSphere(30, earth, 100, 0, 0);
    makeSphere(30, sun, 200, 0, 0);
    makeSphere(30, mars, 300, 0, 0);
    makeSphere(30, venus, 400, 0, 0);
    makeSphere(30, saturn, 500, 0, 0);
    makeSphere(30, jupiter, 600, 0, 0);
    makeSphere(30, uranus, 700, 0, 0);
    makeSphere(30, neptune, 800, 0, 0);
    makeSphere(30, mercury, 900, 0, 0);
}

function generateCube() {
    for (let i = 0; i < 5; i++) {
        makeCube(40, 40, 40, wall, i * 70, 150, 1)
    }

    for (let j = 0; j < 10; j++) {
        makeCylinder(j * 3, 30, 30, wall, (j * -100) + 300, -200, 0)
    }
}

// function testRender()

// {
//   const renderer = new THREE.WebGLRenderer({canvas});

//   const rtWidth = 512;
//   const rtHeight = 512;
//   const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight);

//   const rtFov = 100;
//   const rtAspect = rtWidth / rtHeight;
//   const rtNear = 0.1;
//   const rtFar = 5;
//   const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
//   rtCamera.position.z = 2;

//   const rtScene = new THREE.Scene();
//   rtScene.background = new THREE.Color('red');

//   {
//     const color = 0xFFFFFF;
//     const intensity = 1;
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(-1, 2, 4);
//     rtScene.add(light);
//   }


//   function makeInstance(color, x) {
//     const boxWidth =  1;
//     const boxHeight = 1;
//     const boxDepth =  1;
//     const tinyGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  
//     const material = new THREE.MeshPhongMaterial({color});

//     const cube = new THREE.Mesh(tinyGeometry, material);
//     rtScene.add(cube);

//     cube.position.x = x;

//     return cube;
//   }

//   const rtCubes = [
//     makeInstance(0x44aa88,  0),
//     makeInstance(0x8844aa, -2),
//     makeInstance(0xaa8844,  2),
//   ];

//   const scene = new THREE.Scene();

//   {
//     const color = 0xFFFFFF;
//     const intensity = 1;
//     const light = new THREE.DirectionalLight(color, intensity);
//     light.position.set(-1, 2, 4);
//     scene.add(light);
//   }

//   const boxWidth = 50;
//   const boxHeight = 50;
//   const boxDepth = 50;
//   const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
//   const material = new THREE.MeshPhongMaterial({
//     map: renderTarget.texture,
//   });
//   const cube = new THREE.Mesh(geometry, material);
//   scene.add(cube);

//   function resizeRendererToDisplaySize(renderer) {
//     const canvas = renderer.domElement;
//     const width = canvas.clientWidth;
//     const height = canvas.clientHeight;
//     const needResize = canvas.width !== width || canvas.height !== height;
//     if (needResize) {
//       renderer.setSize(width, height, false);
//     }
//     return needResize;
//   }

//   function render(time) {
//     time *= 0.001;

//     if (resizeRendererToDisplaySize(renderer)) {
//       const canvas = renderer.domElement;
//       camera.aspect = canvas.clientWidth / canvas.clientHeight;
//       camera.updateProjectionMatrix();
//     }

//     // rotate all the cubes in the render target scene
//     rtCubes.forEach((cube, ndx) => {
//       const speed = 1 + ndx * .1;
//       const rot = time * speed;
//       cube.rotation.x = rot;
//       cube.rotation.y = rot;
//     });

//     // draw render target scene to render target
//     renderer.setRenderTarget(renderTarget);
//     renderer.render(rtScene, rtCamera);
//     renderer.setRenderTarget(null);

//     // rotate the cube in the scene
//     cube.rotation.x = time;
//     cube.rotation.y = time * 1.1;

//     // render the scene to the canvas
//     renderer.render(scene, camera);

//     requestAnimationFrame(render);
//   }

//   requestAnimationFrame(render);
// }


function render() {

    planet();
    loadObject(0, 20);
    loadSkyBox(sky);
    makeLightingSphere(20, -30, 0);
    generateCube();
    room();

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

function room() {
    const backGeometry = new THREE.BoxGeometry(80, 80, 1);
    const leftGeometry = new THREE.BoxGeometry(1, 80, 80);
    const bottomGeometry = new THREE.BoxGeometry(80, 1, 80);
    const material = new THREE.MeshBasicMaterial({ color: 0xADD8E6 })
    var back = new THREE.Mesh(backGeometry, material);
    var left = new THREE.Mesh(leftGeometry, material);
    var right = new THREE.Mesh(leftGeometry, material);
    var bottom = new THREE.Mesh(bottomGeometry, material);
    var top = new THREE.Mesh(bottomGeometry, material);
    right.translateX(40);
    left.translateX(-40);
    back.translateZ(-40);
    bottom.translateY(-40);
    top.translateY(40);
    scene.add(back);
    scene.add(left);
    scene.add(right);
    scene.add(bottom);
    scene.add(top);
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

function makeLightingSphere(locX, locY, locZ) {
    const sphereRadius = 20;
    const sphereWidthDivisions = 32;
    const sphereHeightDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-sphereRadius - 1, sphereRadius + 2, 0);
    mesh.translateX(locX);
    mesh.translateY(locY);
    mesh.translateZ(locZ);
    scene.add(mesh);
}

function loadSkyBox(image) {
    const loader = new THREE.TextureLoader();
    const texture = loader.load(
        image,
        () => {
            const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
            rt.fromEquirectangularTexture(renderer, texture);
            scene.background = rt.texture;
        });
}

function GUImenu() {

    CameraGUIControl();
    SpotLightGUIControl();
    DirectionalGUIControl();
    PointLightGUIControl();
    effectToggle();
}

function SpotLightGUIControl() {

    const spotLightIntensity = 1;
    const spotlight = new THREE.SpotLight(0xFFFFFF, spotLightIntensity);
    spotlight.position.set(0, 10, 0);
    spotlight.target.position.set(-5, 0, 0);
    scene.add(spotlight);
    scene.add(spotlight.target);
    const spotHelper = new THREE.SpotLightHelper(spotlight);
    scene.add(spotHelper);



    function updateLight() {
        spotlight.target.updateMatrixWorld();
        spotHelper.update();
    }
    updateLight();

    class DegRadHelper {
        constructor(obj, prop) {
            this.obj = obj;
            this.prop = prop;
        }
        get value() {
            return THREE.MathUtils.radToDeg(this.obj[this.prop]);
        }
        set value(v) {
            this.obj[this.prop] = THREE.MathUtils.degToRad(v);
        }
    }


    let folderSpot = gui.addFolder("spot light")
    function makeXYZGUI(vector3, onChangeFn, type) {
        folderSpot.add(vector3, 'x', -50, 50).name(type + " x").onChange(onChangeFn);
        folderSpot.add(vector3, 'y', -50, 50).name(type + " y").onChange(onChangeFn);
        folderSpot.add(vector3, 'z', -50, 50).name(type + " z").onChange(onChangeFn);
        folderSpot.open();
    }

    makeXYZGUI(spotlight.position, updateLight, "position");
    makeXYZGUI(spotlight.target.position, updateLight, "target");
    gui.add(spotlight, 'intensity', 0, 2, 0.01);
    folderSpot.add(spotlight, 'distance', 0, 40).onChange(updateLight);
    folderSpot.add(new DegRadHelper(spotlight, 'angle'), 'value', 0, 90).name('angle').onChange(updateLight);
    folderSpot.add(spotlight, 'penumbra', 0, 1, 0.01);


}

function CameraGUIControl() {

    function updateCamera() {
        controls.update();
    }

    let folderSpot = gui.addFolder("camera")
    function makeXYZGUI(vector3, onChangeFn, type) {
        folderSpot.add(vector3, 'x', -500, 500).name(type + " x").onChange(onChangeFn);
        folderSpot.add(vector3, 'y', -500, 500).name(type + " y").onChange(onChangeFn);
        folderSpot.add(vector3, 'z', -500, 500).name(type + " z").onChange(onChangeFn);
        folderSpot.open();
    }

    makeXYZGUI(camera.position, updateCamera, "position");
    makeXYZGUI(controls.target, updateCamera, "target");
}

function DirectionalGUIControl() {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light);
    scene.add(light.target);

    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    function updateLight() {
        light.target.updateMatrixWorld();
        helper.update();
    }

    updateLight();
    let folder = gui.addFolder("directional light")
    function makeXYZGUI(vector3, onChangeFn, type) {
        folder.add(vector3, 'x', -50, 50).name(type + " x").onChange(onChangeFn);
        folder.add(vector3, 'y', -50, 50).name(type + " y").onChange(onChangeFn);
        folder.add(vector3, 'z', -50, 50).name(type + " z").onChange(onChangeFn);
        folder.open();
    }

    makeXYZGUI(light.position, updateLight, "position");
    makeXYZGUI(light.target.position, updateLight, "target");
    gui.add(light, 'intensity', 0, 2, 0.01);
}

function PointLightGUIControl() {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.position.set(0, 10, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    function updateLight() {
        helper.update();
    }

    let folder = gui.addFolder("point light")
    function makeXYZGUI(vector3, onChangeFn, type) {
        folder.add(vector3, 'x', -50, 50).name(type + " x").onChange(onChangeFn);
        folder.add(vector3, 'y', -50, 50).name(type + " y").onChange(onChangeFn);
        folder.add(vector3, 'z', -50, 50).name(type + " z").onChange(onChangeFn);
        folder.open();
    }

    makeXYZGUI(light.position, updateLight, "position");
    gui.add(light, 'intensity', 0, 2, 0.01);
    folder.add(light, 'distance', 0, 40).onChange(updateLight);
}

function makeLabelCanvas(baseWidth, size, name = "fog room") {

    var spritey = makeTextSprite(name,
        { fontsize: 44, textColor: { r: 220, g: 11, b: 11, a: 1.0 } });
    spritey.position.set(0, 50, 0);
    scene.add(spritey);
}

function makeTextSprite(message) {
    let multiplier = 3;
    var fontface = "Courier New";
    var fontsize = 50;
    var borderThickness = 4;
    var borderColor = { r: 0, g: 0, b: 0, a: 1.0 };
    var backgroundColor = { r: 0, g: 0, b: 255, a: 1.0 };
    var textColor = { r: 0, g: 0, b: 0, a: 1.0 };

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.font = "Bold " + fontsize + "px " + fontface;
    var metrics = context.measureText(message);
    var textWidth = metrics.width;

    context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
    context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
    context.fillStyle = "rgba(" + textColor.r + ", " + textColor.g + ", " + textColor.b + ", 1.0)";
    context.fillText(message, borderThickness, fontsize + borderThickness);

    var texture = new THREE.Texture(canvas)
    texture.needsUpdate = true;
    var spriteMaterial = new THREE.SpriteMaterial({ map: texture, useScreenCoordinates: false });
    var sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(multiplier * fontsize, multiplier * fontsize, multiplier * fontsize);
    return sprite;
}


function effectToggle() {
    class FogGUIHelper {
        constructor(fog) {
            this.fog = fog;
        }
        get near() {
            return this.fog.near;
        }
        set near(v) {
            this.fog.near = v;
            this.fog.far = Math.max(this.fog.far, v);
        }
        get far() {
            return this.fog.far;
        }
        set far(v) {
            this.fog.far = v;
            this.fog.near = Math.min(this.fog.near, v);
        }
        get color() {
            return `#${this.fog.color.getHexString()}`;
        }
        set color(hexString) {
            this.fog.color.set(hexString);
        }
    }
    const color = "lightblue";
    let fogNear = 2000;
    let fogFar = 2000;
    scene.fog = new THREE.Fog(color, fogNear, fogFar);
    let folder = gui.addFolder("fog")
    const fogGUIHelper = new FogGUIHelper(scene.fog);
    folder.add(fogGUIHelper, 'near', near, far).listen();
    folder.add(fogGUIHelper, 'far', near, far).listen();
    folder.addColor(fogGUIHelper, 'color');
}

main();

