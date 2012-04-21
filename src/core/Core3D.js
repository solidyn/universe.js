var UNIVERSE = UNIVERSE || {};

UNIVERSE.Core3D = function(container) {
    var self = this;

    // Variables used to draw the 3D elements
    var camera, scene, projector, renderer, w, h;
    var vector, animate;
    var light;

    var overRenderer;

    // Constants for zooming, rotation, etc.
    var curZoomSpeed = 0;

    var mouse = {
        x : 0,
        y : 0
    }, mouseOnDown = {
        x : 0,
        y : 0
    };
    var rotation = {
        x : 0,
        y : 0
    }, target = {
        x : Math.PI * 3 / 2,
        y : Math.PI / 6.0
    }, targetOnDown = {
        x : 0,
        y : 0
    };

    // set initial distance
    var distance = 50000;
    var PI_HALF = Math.PI / 2;


    self.distanceTarget = 50000;
    
    this.maxZoom = 500000;
    this.minZoom = 7000;


    var drawnObjects = new Array();

    var resizeTimeout = null;

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

        light = new THREE.DirectionalLight( 0xffffff, 0);
        light.position.set( 0, 0, 0 ).normalize();
        scene.add( light );
        //
        // var ambientLight = new THREE.AmbientLight( 0x000000 );
        // scene.add( ambientLight );

        animate();
    }

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

        container.addEventListener('mouseover', function() {
            overRenderer = true;
        }, false);

        container.addEventListener('mouseout', function() {
            overRenderer = false;
        }, false);

        window.addEventListener("MozGamepadConnected", connectGamepad);
        window.addEventListener("MozGamepadDiconnected", disconnectGamepad);
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
        for(var i in drawnObjects) {
            if(drawnObjects[i].scale == true) {
                var objectPosition = drawnObjects[i].shape.position;
                var distanceFromCamera = MathTools.distanceBetweenTwoPoints(
                    objectPosition.x, objectPosition.y, objectPosition.z,
                    camera.position.x, camera.position.y, camera.position.z);

                var scaleFactor = distanceFromCamera / (6371 * 7);
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

    function onMouseOut(event) {
        container.removeEventListener('mousemove', onMouseMove, false);
        container.removeEventListener('mouseup', onMouseUp, false);
        container.removeEventListener('mouseout', onMouseOut, false);
    }

    function onMouseWheel(event) {
        event.preventDefault();
        if(overRenderer) {
            zoom(event.wheelDeltaY * (10));
        }
        return false;
    }
    
    function onMouseWheelFF(event) {
        event.preventDefault();
        if(overRenderer) {
            var delta = event.detail? event.detail*(-120) : event.wheelDelta
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

    function onWindowResize(event) {
        // so right now this event was fired when the entire window was resized,
        // but the individual dom elements haven't been resized yet. We will wait
        // a bit then execute the actual resize code so we can use the updated
        // element sizes.
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
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
    this.draw = function(id, shape, scale) {
        if(drawnObjects[id] == undefined) {
            if(shape != undefined) {
                scene.add(shape);
            }
            drawnObjects[id] = {
                shape : shape,
                scale : scale
            };
        }
    }

    this.showObject = function(id, isShown) {
        // if object exists in drawnObjects then add back to scene
        if (drawnObjects[id] != undefined) {
            if(isShown) {
                //TODO: Fix so that multiple calls with true don't add the same object over and over'
                scene.add(drawnObjects[id].shape);
            }
            else {
                scene.remove(drawnObjects[id].shape);
            }
        }
    }
    
    this.removeObject = function(id) {
        if(drawnObjects[id] != undefined) {
            if(drawnObjects[id].shape != undefined) {
                scene.remove(drawnObjects[id].shape);
            }
            delete drawnObjects[id];
        }
    }
    
    this.removeAllObjects = function() {
        for(var i in drawnObjects) {
            if(drawnObjects[i].shape != undefined) {
                scene.remove(drawnObjects[i].shape);
            }
        }
        drawnObjects = new Array();
    }

    this.getObjectPosition = function(id) {
        if(drawnObjects[id] == undefined) {
            return undefined;
        }
        else if(drawnObjects[id].shape == undefined) {
            return undefined;
        }
        return drawnObjects[id].shape.position;
    }

    this.moveCameraTo = function(position_vector) {
        // This method converts a position into the rotation coordinate system used to move the camera
        // The target.x parameter is the rotation angle from the positive Z axis
        // target.y is the rotation angle away from the z-x plane

        // copy so we don't stomp on the original
        var cameraVector = new THREE.Vector3();
        cameraVector.copy(position_vector);
        
        // sets the distance from the center of the scene the camera will end up
        distanceTarget = cameraVector.length();

        // unit vectors along the z and y axis
        var zAxisVector = new THREE.Vector3(0,0,1);
        var yAxisVector = new THREE.Vector3(0,1,0);

        // vector that removes the y component of the target vector for purpose of calculating the angle
        // between it the input position_vector and the y-z plane
        var positionY0Vector = new THREE.Vector3();
        positionY0Vector.copy(cameraVector);
        
        // set the y to zero and normalize to unit length
        positionY0Vector.y = 0;
        positionY0Vector.normalize();
        
        //normalize the position_vector to unit length
        cameraVector.normalize();

        // calculates the angle between the positive y axis and the input position vector
        // then subtract this from 90 degrees to shift it to be from the z-x plane
        var y = (Math.PI/2) - Math.acos(yAxisVector.dot(cameraVector));

        // calculate the angle between the input vector projected on the z-x plane and the z-axis
        var x = Math.acos(zAxisVector.dot(positionY0Vector));

        // since the above calculation will return between 0 and 180 degrees, invert it if we're in the
        // negative x direction
        if(positionY0Vector.x < 0) {
            x = -x;
        }

        // set it to zero if NaN
        target.y = isNaN(y) ? 0 : y;
        target.x = isNaN(x) ? 0 : x;
    }
    
    this.getCameraPosition = function() {
        return camera.position;
    }
    
    this.addRotationToCameraTarget = function(xRotation, yRotation) {
        if(xRotation != undefined) {
            target.x += xRotation;
        }
        
        if(yRotation != undefined) {
            target.y += yRotation;
        }
    }

    this.updateLight = function(position, intensity) {
        light.position = position;
        light.intensity = intensity;
    }

    // shim layer with setTimeout fallback
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();

    // the first gamepad connected to the browser
    var gamepad;

    // called to setup a gamepad
    function connectGamepad(e) {
        // get the connected gamepad
        gamepad = new Input.Device(e.gamepad);

        var iter = Object.keys(gamepad.axes);
        for (var i in iter) {
            console.log("Axis [" + iter[i] + "] connected");
        }
        
        window.requestAnimFrame(updateGamepadStatus);
    }

    // called when a gamepad is disconnected
    function disconnectGamepad(e) {
    }

    var GAMEPAD_ZOOM_SCALING_FACTOR = 1500;
    var GAMEPAD_ZOOM_MIN_SENSITIVITY = .1;
    var GAMEPAD_CAMERA_ROTATION_MIN_SCALING_FACTOR = 0.05;
    var GAMEPAD_CAMERA_ROTATION_MAX_SCALING_FACTOR = 0.5;
    var GAMEPAD_CAMERA_ROTATION_DELTA =
        GAMEPAD_CAMERA_ROTATION_MAX_SCALING_FACTOR - GAMEPAD_CAMERA_ROTATION_MIN_SCALING_FACTOR;
    var GAMEPAD_CAMERA_MIN_SENSITIVITY = 0.25;
    var GAMEPAD_PAN_SCALING_FACTOR = 5000;

    function updateGamepadStatus(e) {

        // right stick

        // adjust the rotation scaling factor by how close we are to the earth.
        // when we are far away from the earth, we want to rotate faster than
        // when we are closer to the earth.
        var distanceFromEarth = MathTools.distanceBetweenTwoPoints(0, 0, 0,
            camera.position.x, camera.position.y, camera.position.z);

        var adjustedRotationScalingFactor = GAMEPAD_CAMERA_ROTATION_MIN_SCALING_FACTOR + 
            ((distanceFromEarth / self.maxZoom) * GAMEPAD_CAMERA_ROTATION_DELTA);
        //console.log(distanceFromEarth + ", " + self.maxZoom + ", " + adjustedRotationScalingFactor);

        var xRot = gamepad.axes["Right_Stick_X"];
        xRot = xRot > -GAMEPAD_CAMERA_MIN_SENSITIVITY && xRot < GAMEPAD_CAMERA_MIN_SENSITIVITY
            ? 0 : xRot * adjustedRotationScalingFactor * -1;
        
        var yRot = gamepad.axes["Right_Stick_Y"];
        yRot = yRot > -GAMEPAD_CAMERA_MIN_SENSITIVITY && yRot < GAMEPAD_CAMERA_MIN_SENSITIVITY
            ? 0 : yRot * adjustedRotationScalingFactor;

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
        var zoomInAmount = gamepad.buttons["Right_Trigger_2"];
        if (zoomInAmount > GAMEPAD_ZOOM_MIN_SENSITIVITY) {
            zoom(zoomInAmount * GAMEPAD_ZOOM_SCALING_FACTOR);
        }

        var zoomOutAmount = gamepad.buttons["Left_Trigger_2"];
        if (zoomOutAmount > GAMEPAD_ZOOM_MIN_SENSITIVITY) {
            zoom(zoomOutAmount * -GAMEPAD_ZOOM_SCALING_FACTOR);
        }

        // setup the callback
        window.requestAnimFrame(updateGamepadStatus);
    }

    init();

    return this;

};
