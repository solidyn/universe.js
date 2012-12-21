/*jslint browser: true, undef: true, sloppy: true */
/*global THREE */

var UNIVERSE = UNIVERSE || {};

UNIVERSE.Core3D = function (container) {
    var self = this,
        camera, // Variables used to draw the 3D elements
        scene,
        projector,
        renderer,
        w,
        h,
        vector,
        animate,
        light,
        overRenderer,
        curZoomSpeed = 0, // Constants for zooming, rotation, etc.
        mouse = {
            x : 0,
            y : 0
        },
        mouseOnDown = {
            x : 0,
            y : 0
        },
        rotation = {
            x : 0,
            y : 0
        },
        target = {
            x : Math.PI * 3 / 2,
            y : Math.PI / 6.0
        },
        targetOnDown = {
            x : 0,
            y : 0
        },
        distance = 50000, // set initial distance
        PI_HALF = Math.PI / 2,
		drawnObjects = [],
        resizeTimeout = null,
        gamepad, // the first gamepad connected to the browser
	    GAMEPAD_ZOOM_SCALING_FACTOR = 1500,
	    GAMEPAD_ZOOM_MIN_SENSITIVITY = 0.1,
	    GAMEPAD_CAMERA_ROTATION_MIN_SCALING_FACTOR = 0.05,
	    GAMEPAD_CAMERA_ROTATION_MAX_SCALING_FACTOR = 0.5,
	    GAMEPAD_CAMERA_ROTATION_DELTA =
	        GAMEPAD_CAMERA_ROTATION_MAX_SCALING_FACTOR - GAMEPAD_CAMERA_ROTATION_MIN_SCALING_FACTOR,
	    GAMEPAD_CAMERA_MIN_SENSITIVITY = 0.25;
	    //GAMEPAD_PAN_SCALING_FACTOR = 5000;

    self.distanceTarget = 50000;

    this.maxZoom = 500000;
    this.minZoom = 7000;

    function setupRenderer() {
        projector = new THREE.Projector();
        renderer = new THREE.WebGLRenderer({
            antialias : true
        });
        renderer.autoClear = false;
        renderer.setClearColorHex(0x000000, 0.0);
        renderer.setSize(w, h);

        renderer.domElement.style.position = 'absolute';

        container.appendChild(renderer.domElement);
    }

    function addEventListeners() {
        // Add event listeners for rotating, zooming, etc.
        container.addEventListener('mousedown', onMouseDown, false);
        container.addEventListener('mousewheel', onMouseWheel, false);
        container.addEventListener('DOMMouseScroll', onMouseWheelFF, false);

        document.addEventListener('keydown', onDocumentKeyDown, false);

        window.addEventListener('resize', onWindowResize, false);

        container.addEventListener('mouseover', function () {
            overRenderer = true;
        }, false);

        container.addEventListener('mouseout', function () {
            overRenderer = false;
        }, false);

        window.addEventListener("MozGamepadConnected", connectGamepad);
        window.addEventListener("MozGamepadDiconnected", disconnectGamepad);
    }

    function init() {
        w = container.offsetWidth || window.innerWidth;
        h = container.offsetHeight || window.innerHeight;

        setupRenderer();

        // Field of View (View Angle)
        // Ratio between width and height, has to match aspect of CanvasRenderer
        // Near, Far
        camera = new THREE.PerspectiveCamera(30, w / h, 1, 1000000);

        camera.position.z = distance;
        vector = new THREE.Vector3();

        // Scene into which the earth and other objects are displayed
        scene = new THREE.Scene();

        addEventListeners();

        light = new THREE.DirectionalLight(0xffffff, 0);
        light.position.set(0, 0, 0).normalize();
        scene.add(light);
        //
        // var ambientLight = new THREE.AmbientLight( 0x000000 );
        // scene.add(ambientLight);

        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        zoom(curZoomSpeed);

        //console.log("target: " + JSON.stringify(target));
        rotation.x += (target.x - rotation.x) * 0.1;
        rotation.y += (target.y - rotation.y) * 0.1;
        distance += (self.distanceTarget - distance) * 0.3;

        camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
        camera.position.y = distance * Math.sin(rotation.y);
        camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);
        camera.lookAt(scene.position);

        vector.copy(camera.position);

        scaleDrawnObjects();

        renderer.clear();
        renderer.render(scene, camera);
    }

    function scaleDrawnObjects() {
	    var i,
	        objectPosition,
	        distanceFromCamera,
	        scaleFactor;
        for (i in drawnObjects) {
            if (drawnObjects[i].scale === true) {
                objectPosition = drawnObjects[i].shape.position;
                distanceFromCamera = objectPosition.distanceTo(camera.position);
                scaleFactor = distanceFromCamera / (6371 * 7);
                drawnObjects[i].shape.scale.x = drawnObjects[i].shape.scale.y = drawnObjects[i].shape.scale.z = scaleFactor;
            }
        }
    }

    // Stock Behaviors like rotating and zooming
    function onMouseDown(event) {
        event.preventDefault();

        container.addEventListener('mousemove', onMouseMove, false);
        container.addEventListener('mouseup', onMouseUp, false);
        container.addEventListener('mouseout', onMouseOut, false);

        mouseOnDown.x = -event.clientX;
        mouseOnDown.y = event.clientY;

        targetOnDown.x = target.x;
        targetOnDown.y = target.y;

        container.style.cursor = 'move';
    }

    function onMouseMove(event) {
        mouse.x = -event.clientX;
        mouse.y = event.clientY;

        var zoomDamp = distance / (35000);

        target.x = targetOnDown.x + (mouse.x - mouseOnDown.x) * 0.005 * zoomDamp;
        target.y = targetOnDown.y + (mouse.y - mouseOnDown.y) * 0.005 * zoomDamp;

        target.y = target.y > PI_HALF ? PI_HALF : target.y;
        target.y = target.y < -PI_HALF ? -PI_HALF : target.y;
    }

    function onMouseUp(event) {
        event.preventDefault();

        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
        container.style.cursor = 'auto';
    }

    function onMouseOut() {
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
    }

    function onMouseWheel(event) {
        event.preventDefault();
        if (overRenderer) {
            zoom(event.wheelDeltaY * (10));
        }
        return false;
    }

    function onMouseWheelFF(event) {
        event.preventDefault();
        if (overRenderer) {
            var delta = event.detail ? event.detail * (-120) : event.wheelDelta;
            zoom(delta * (10));
        }
        return false;
    }

    function onDocumentKeyDown(event) {
        switch (event.keyCode) {
        case 38:
            zoom(3200);
            event.preventDefault();
            break;
        case 40:
            zoom(-3200);
            event.preventDefault();
            break;
        }
    }

    function onWindowResize() {
        // so right now this event was fired when the entire window was resized,
        // but the individual dom elements haven't been resized yet. We will wait
        // a bit then execute the actual resize code so we can use the updated
        // element sizes.
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            resize();
        }, 250);
    }

    function resize() {
        w = container.offsetWidth || window.innerWidth;
        h = container.offsetHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    function zoom(delta) {
        self.distanceTarget -= delta;
        self.distanceTarget = self.distanceTarget > self.maxZoom ? self.maxZoom : self.distanceTarget;
        self.distanceTarget = self.distanceTarget < self.minZoom ? self.minZoom : self.distanceTarget;
    }

    // Priviledged Methods
    this.draw = function (id, shape, scale) {
        if (!drawnObjects[id]) {
            if (shape) {
                scene.add(shape);
            }
            drawnObjects[id] = {
                shape : shape,
                scale : scale
            };
        }
    };

    this.showObject = function (id, isShown) {
        // if object exists in drawnObjects then add back to scene
        if (drawnObjects[id]) {
            if (isShown) {
                //TODO: Fix so that multiple calls with true don't add the same object over and over'
                scene.add(drawnObjects[id].shape);
            } else {
                scene.remove(drawnObjects[id].shape);
            }
        }
    };

    this.removeObject = function (id) {
        if (drawnObjects[id]) {
            if (drawnObjects[id].shape) {
                scene.remove(drawnObjects[id].shape);
            }
            delete drawnObjects[id];
        }
    };

    this.removeAllObjects = function () {
        var i;
        for (i in drawnObjects) {
            if (drawnObjects[i].shape) {
                scene.remove(drawnObjects[i].shape);
            }
        }
        drawnObjects = [];
    };

    this.getObjectPosition = function (id) {
        var ret;
        if (drawnObjects[id] !== undefined && drawnObjects[id].shape !== undefined) {
	        ret = drawnObjects[id].shape.position;
        }
        return ret;
    };

    this.moveCameraTo = function (position_vector) {
        // This method converts a position into the rotation coordinate system used to move the camera
        // The target.x parameter is the rotation angle from the positive Z axis
        // target.y is the rotation angle away from the z-x plane


        var cameraVector = new THREE.Vector3(),
            zAxisVector = new THREE.Vector3(0, 0, 1), // unit vector along the z axis
            yAxisVector = new THREE.Vector3(0, 1, 0), // unit vector along the y axis
            positionY0Vector = new THREE.Vector3(),
            y, // The angle between the positive y axis and the input position vector
            x; // the angle between the input vector projected on the z-x plane and the z-axis

        // copy so we don't stomp on the original
        cameraVector.copy(position_vector);

        // sets the distance from the center of the scene the camera will end up
        distanceTarget = cameraVector.length();

        // vector that removes the y component of the target vector for purpose of calculating the angle
        // between it the input position_vector and the y-z plane
        positionY0Vector.copy(cameraVector);

        // set the y to zero and normalize to unit length
        positionY0Vector.y = 0;
        positionY0Vector.normalize();

        //normalize the position_vector to unit length
        cameraVector.normalize();

        // calculates the angle between the positive y axis and the input position vector
        // then subtract this from 90 degrees to shift it to be from the z-x plane
        y = (Math.PI / 2) - Math.acos(yAxisVector.dot(cameraVector));

        // calculate the angle between the input vector projected on the z-x plane and the z-axis
        x = Math.acos(zAxisVector.dot(positionY0Vector));

        // since the above calculation will return between 0 and 180 degrees, invert it if we're in the
        // negative x direction
        if (positionY0Vector.x < 0) {
            x = -x;
        }

        // set it to zero if NaN
        target.y = isNaN(y) ? 0 : y;
        target.x = isNaN(x) ? 0 : x;
    };

    this.getCameraPosition = function () {
        return camera.position;
    };

    this.addRotationToCameraTarget = function (xRotation, yRotation) {
        if (xRotation) {
            target.x += xRotation;
        }

        if (yRotation) {
            target.y += yRotation;
        }
    };

    this.updateLight = function (position, intensity) {
        light.position = position;
        light.intensity = intensity;
    };

    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());

    // called to setup a gamepad
    function connectGamepad(e) {
        // get the connected gamepad
        gamepad = new Input.Device(e.gamepad);

        var iter = Object.keys(gamepad.axes),
            i;
        for (i in iter) {
            console.log("Axis [" + iter[i] + "] connected");
        }

        window.requestAnimFrame(updateGamepadStatus);
    }

    // called when a gamepad is disconnected
    function disconnectGamepad() {
    }

    function updateGamepadStatus() {

        // right stick

        // adjust the rotation scaling factor by how close we are to the earth.
        // when we are far away from the earth, we want to rotate faster than
        // when we are closer to the earth.
        var centerPoint = new THREE.Vector3(0, 0, 0),
            distanceFromEarth = centerPoint.distanceTo(camera.position),
            adjustedRotationScalingFactor = GAMEPAD_CAMERA_ROTATION_MIN_SCALING_FACTOR +
                ((distanceFromEarth / self.maxZoom) * GAMEPAD_CAMERA_ROTATION_DELTA),
            xRot = gamepad.axes.Right_Stick_X,
            yRot = gamepad.axes.Right_Stick_Y,
            zoomInAmount,
            zoomOutAmount;

        xRot = xRot > -GAMEPAD_CAMERA_MIN_SENSITIVITY && xRot < GAMEPAD_CAMERA_MIN_SENSITIVITY ?
                0 : xRot * adjustedRotationScalingFactor * -1;

        yRot = yRot > -GAMEPAD_CAMERA_MIN_SENSITIVITY && yRot < GAMEPAD_CAMERA_MIN_SENSITIVITY ?
                0 : yRot * adjustedRotationScalingFactor;

        self.addRotationToCameraTarget(xRot, yRot);

        // TODO: left stick
        /*
        var xPan = gamepad.axes["Left_Stick_X"];
        xPan = xPan > -GAMEPAD_CAMERA_MIN_SENSITIVITY && xPan < GAMEPAD_CAMERA_MIN_SENSITIVITY
            ? 0 : xPan * GAMEPAD_PAN_SCALING_FACTOR;

        var yPan = gamepad.axes["Left_Stick_Y"];
        yPan = yPan > -GAMEPAD_CAMERA_MIN_SENSITIVITY && yPan < GAMEPAD_CAMERA_MIN_SENSITIVITY
            ? 0 : yPan * GAMEPAD_PAN_SCALING_FACTOR;

        camera.position.x += xPan;
        camera.position.y += yPan;
        //console.log("cam: " + JSON.stringify(camera.position) + " mv " + xPan + ", " + yPan);
        */

        // zoom in / out
        zoomInAmount = gamepad.buttons.Right_Trigger_2;
        if (zoomInAmount > GAMEPAD_ZOOM_MIN_SENSITIVITY) {
            zoom(zoomInAmount * GAMEPAD_ZOOM_SCALING_FACTOR);
        }

        zoomOutAmount = gamepad.buttons.Left_Trigger_2;
        if (zoomOutAmount > GAMEPAD_ZOOM_MIN_SENSITIVITY) {
            zoom(zoomOutAmount * -GAMEPAD_ZOOM_SCALING_FACTOR);
        }

        // setup the callback
        window.requestAnimFrame(updateGamepadStatus);
    }

    init();

    return this;

};