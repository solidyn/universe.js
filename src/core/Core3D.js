var UNIVERSE = UNIVERSE || {};

UNIVERSE.Core3D = function(container) {
    // Variables used to draw the 3D elements
    var camera, projector, renderer, w, h;
	this.scene = null;
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
    var distance = 50000, distanceTarget = 50000;
    var PI_HALF = Math.PI / 2;

    var maxZoom = 500000;
    var minZoom = 10000;

    var drawnObjects = new Array();

    var resizeTimeout = null;
	var controls;

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

		// Use the controller to control the camera, but only when over the container
		controls = new THREE.TrackballControls( camera, container );

		controls.rotateSpeed = 1.0;
		controls.zoomSpeed = 1.5;
		controls.panSpeed = 0.2;

		controls.noZoom = false;
		controls.noPan = false;

		// This controls how much inertia the movement has.  Set Damping to higher to
		// stop the movement sooner.  Setting staticMoving to TRUE turns off all inertia
		controls.staticMoving = false;
		controls.dynamicDampingFactor = 0.10;

		controls.minDistance = minZoom;
		controls.maxDistance = maxZoom;

		controls.keys = [ 65, 83, 68 ];

		
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

        //container.addEventListener('mousedown', onMouseDown, false);

        container.addEventListener('mousewheel', onMouseWheel, false);
        container.addEventListener('DOMMouseScroll', onMouseWheelFF, false);
        
        //document.addEventListener('keydown', onDocumentKeyDown, false);

        window.addEventListener('resize', onWindowResize, false);
		
        container.addEventListener('mouseover', function() {
            overRenderer = true;
        }, false);

        container.addEventListener('mouseout', function() {
            overRenderer = false;
        }, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
		
		
        //zoom(curZoomSpeed);
		/*
        //console.log("target: " + JSON.stringify(target));
        rotation.x += (target.x - rotation.x) * 0.1;
        rotation.y += (target.y - rotation.y) * 0.1;
        distance += (distanceTarget - distance) * 0.3;

        camera.position.x = distance * Math.sin(rotation.x) * Math.cos(rotation.y);
        camera.position.y = distance * Math.sin(rotation.y);
        camera.position.z = distance * Math.cos(rotation.x) * Math.cos(rotation.y);
        camera.lookAt(scene.position);

        vector.copy(camera.position);
*/
        scaleDrawnObjects();
		
		controls.update();
        renderer.clear();
        renderer.render(scene, camera);
    }

    function scaleDrawnObjects() {
        for(var i in drawnObjects) {
            if(drawnObjects[i].scale == true) {
                var objectPosition = drawnObjects[i].shape.position;
                var xDiff = objectPosition.x - camera.position.x;
                var yDiff = objectPosition.y - camera.position.y;
                var zDiff = objectPosition.z - camera.position.z;
                var distanceFromCamera = Math.sqrt(xDiff * xDiff + yDiff * yDiff + zDiff * zDiff);
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
		console.log("in onMouseWheel");
        if(overRenderer) {
            zoom(event.wheelDeltaY * (10));
        }
        return false;
    }
    
    function onMouseWheelFF(event) {
		console.log("in onMouseWheelFF");
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
		controls.screen.width = w;
		controls.screen.height = h;
    }

    function zoom(delta) {
		// Extend the THREE.TrackballControls functionality by setting internal zoom variables
		// Remember that this is called in the context of the window and not the UNIVERSE object, so 
		// we have to provide the context to the controls object
		console.log("In Zoom: "+delta);
		//controls._zoomStart.y = 0;
		//controls._zoomEnd.y = delta;
		controls.setZoom(delta);
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
			if(drawnObject[id].shape != undefined) {
				scene.remove(drawnObjects[i].shape);
			}
        }
        drawnObjects = new Array();
    }
	
    this.getObjectPosition = function(id) {
        if(drawnObjects[id] == undefined) {
            return undefined;
        }
        return drawnObjects[id].shape.position;
    }
	
    this.moveCameraTo = function(position_vector) {
        // This method converts a position into the rotation coordinate system used to move the camera
        // The target.x parameter is the rotation angle from the positive Z axis
        // target.y is the rotation angle away from the z-x plane
	    
        // sets the distance from the center of the scene the camera will end up
        distanceTarget = position_vector.length();
	    
        // unit vectors along the z and y axis
        var zAxisVector = new THREE.Vector3(0,0,1);
        var yAxisVector = new THREE.Vector3(0,1,0);
	    
        // vector that removes the y component of the target vector for purpose of calculating the angle
        // between it the input position_vector and the y-z plane
        var positionY0Vector = new THREE.Vector3();
        positionY0Vector.copy(position_vector);
        
        // set the y to zero and normalize to unit length
        positionY0Vector.y = 0;
        positionY0Vector.normalize();
        
        //normalize the position_vector to unit length
        position_vector.normalize();
	    
        // calculates the angle between the positive y axis and the input position vector
        // then subtract this from 90 degrees to shift it to be from the z-x plane
        var y = (Math.PI/2) - Math.acos(yAxisVector.dot(position_vector));
	    
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
	
    init();

    return this;

};
