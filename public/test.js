function picking() {
    function resizeRendererToDisplaySize(renderer) {
        const ctx = renderer.domElement;
        const width = ctx.clientWidth;
        const height = ctx.clientHeight;
        const needResize = ctx.width !== width || ctx.height !== height;
        if (needResize) {
          renderer.setSize(width, height, false);
        }
        return needResize;
      }
    class PickHelper {
        constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
        }
        pick(normalizedPosition, scene, camera, time) {
            // restore the color if there is a picked object
            if (this.pickedObject) {
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
            }

            // cast a ray through the frustum
            this.raycaster.setFromCamera(normalizedPosition, camera);
            // get the list of objects the ray intersected
            const intersectedObjects = this.raycaster.intersectObjects(scene.children);
            if (intersectedObjects.length) {
                // pick the first object. It's the closest one
                this.pickedObject = intersectedObjects[0].object;
                // save its color
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                // set its emissive color to flashing red/yellow
                this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);
            }
        }
    }

    const pickPosition = { x: 0, y: 0 };
    const pickHelper = new PickHelper();
    clearPickPosition();

    function render(time) {
        time *= 0.001;  // convert to seconds;

        if (resizeRendererToDisplaySize(renderer)) {
            const ctx = renderer.domElement;
            camera.aspect = ctx.clientWidth / ctx.clientHeight;
            camera.updateProjectionMatrix();
        }

        cameraPole.rotation.y = time * .1;

        pickHelper.pick(pickPosition, scene, camera, time);

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function getctxRelativePosition(event) {
        const rect = ctx.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * ctx.width / rect.width,
            y: (event.clientY - rect.top) * ctx.height / rect.height,
        };
    }

    function setPickPosition(event) {
        const pos = getctxRelativePosition(event);
        pickPosition.x = (pos.x / ctx.width) * 2 - 1;
        pickPosition.y = (pos.y / ctx.height) * -2 + 1;  // note we flip Y
    }

    function clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }
    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);

    window.addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
    }, { passive: false });

    window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });

    window.addEventListener('touchend', clearPickPosition);
}