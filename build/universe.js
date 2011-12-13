
var SSI = SSI || {};

SSI.Core3D = function(container) {
    // Variables used to draw the 3D elements
    var camera, scene, projector, renderer, w, h;
    var vector, animate;

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
        distance += (distanceTarget - distance) * 0.3;

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
        logger.debug('resize');
        w = container.offsetWidth || window.innerWidth;
        h = container.offsetHeight || window.innerHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    function zoom(delta) {
        distanceTarget -= delta;
        distanceTarget = distanceTarget > maxZoom ? maxZoom : distanceTarget;
        distanceTarget = distanceTarget < minZoom ? minZoom : distanceTarget;
    }

    // Priviledged Methods
    this.draw = function(id, shape, scale) {
        if(drawnObjects[id] == undefined) {
            logger.debug(" adding and drawing: " + id);
            scene.add(shape);
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
                logger.debug("adding shape back to scene for id " + id);
                scene.add(drawnObjects[id].shape);
            }
            else {
                logger.debug("removing object from scene with id: " + id);
                scene.remove(drawnObjects[id].shape);
            }
        }
    }
    
    this.removeObject = function(id) {
        if(drawnObjects[id] != undefined) {
            scene.remove(drawnObjects[id].shape);
            delete drawnObjects[id];
        }
    }
    
    this.removeAllObjects = function() {
        for(var i in drawnObjects) {
            scene.remove(drawnObjects[i].shape);
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
        logger.debug("Moving camera to: " + JSON.stringify(position_vector));
	    
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
	    
        logger.debug("target: " + JSON.stringify(target));
    }
	
    init();

    return this;

};

var SSI = SSI || {};

SSI.ObjectLibrary = function() {
    var objects = new Array();
    var numberOfElements = 0;

    // adds a mesh object to the object library
    // id -> unique id of the object
    // url -> url used to retrieve the json of the model
    // material -> material to apply to the model's geometry
    this.addGeometryObjectFromUrl = function(id, url, callback) {
        logger.debug("Adding mesh object to library; id: [" + id + "] url: [" + 
            url + "]");
        // if we have already loaded an onject with this id, return
        if (objects[id] != undefined) {
            logger.debug("Object with id [" + id + "] already exists so not adding");
            callback();
            return;
        }
        
        // Have to do this to avoid a race condition and avoid requesting it every time
        objects[id] = "loading";

        // use a JSON loader to load the mesh from JSON
        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.load({
            model : url,
            callback : function(geometry) {
                //var mesh = new THREE.Mesh(geometry, material);
                
                // add the object to our list of objects
                objects[id] = geometry;
                //numberOfElements++;
                //console.log("objects after add: " + JSON.stringify(objects));
                //console.log("numberOfElements after add: " + JSON.stringify(numberOfElements))

                // execute the callback
                callback();
            }
        });
        
    }

    // gets an object from the library based on the given id
    this.getObjectById = function(id, callback) {
        logger.debug("Retrieving object with id [" + id + "] from library");
        //console.log("number of elements: " + numberOfElements);
        var object = objects[id];
        var objectLib = this;
        if(object == "loading") {
            setTimeout(function() {objectLib.getObjectById(id, callback)}, 1000)
        }
        else if (object == null)
            throw "Tried to retrieve object [" + id + "] from object library but didn't exist";
        else
            callback(object);
    }
    
    this.setObject = function(id, object) {
        objects[id] = object;
    }
}

var SSI = SSI || {};

SSI.UniverseController = function(options) {
    var graphicsObjects = new Array();

    // Timeout that runs the animation, will be cleared when paused
    var refreshTimeout;

    // number of milliseconds between calls to update() (frame rate / refresh rate)
    var refreshRate = options.refreshRate || 30;

    // the last time we called update() in ms since jsDate epoch
    var lastUpdateMs = 0;

    function update() {
        // determine how much time has elapsed since update has last been called
        var nowMs = (new Date()).getTime();
        var elapsedTime = nowMs - lastUpdateMs;
        // save now as the last time we've updated
        lastUpdateMs = nowMs;
        // causes terrible performance... only enable if needed for debugging!
        // logger.debug("now [" + nowMs + "] elapsed ms [" + elapsedTime + "]");

        // update and draw all graphics objects
        for(var i in graphicsObjects) {
            graphicsObjects[i].update(elapsedTime);
            graphicsObjects[i].draw();
        }

        // call update() again in a certain number of milliseconds
        refreshTimeout = setTimeout(function() {
            update();
        }, refreshRate);
    }

    this.updateOnce =function() {
        for(var i in graphicsObjects) {
            graphicsObjects[i].update(null);
            graphicsObjects[i].draw();
        }
    }

    // id
    // objectName
    // updateFunction
    this.addGraphicsObject = function(graphicsObject) {
        graphicsObjects[graphicsObject.id] = graphicsObject;
        this.updateOnce();
    }
    
    this.removeGraphicsObject = function(id) {
        delete graphicsObjects[id];
    }

    this.play = function() {
        // set our last update time to now since this is the first update
        lastUpdateMs = (new Date()).getTime();
        update();
    };

    this.pause = function() {
        clearTimeout(refreshTimeout);
    };
    
    this.removeAllGraphicsObjects = function () {
        graphicsObjects = new Array();
    }
    
    this.getGraphicsObjects = function() {
        return graphicsObjects;
    }
};

SSI.UniverseController.prototype.changeRefreshRate = function(rateInMilliseconds) {
    this.refreshRate = rateInMilliseconds;
}

var SSI = SSI || {};

SSI.EarthExtensions = function(universe) {
	var earthExtensions = this;
	
	// constants
    var earthSphereRadius = 6371;

	var centerPoint = new THREE.Vector3(0,0,0);
	
	// have to do this this way since the decision of whether to show or hide it has to be made at draw time
    var enableControlLines = undefined;

    universe.setObjectInLibrary("default_ground_object_geometry", new THREE.SphereGeometry(300, 20, 10));
    universe.setObjectInLibrary("default_ground_object_material", new THREE.MeshLambertMaterial({color : 0x00CC00}));

    universe.setObjectInLibrary("default_ground_track_material", new THREE.MeshBasicMaterial({
        color : 0xCC0000,
        transparent:true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    }));

    universe.setObjectInLibrary("default_sensor_projection_material",new THREE.MeshBasicMaterial({
         color: 0xffaa00,
         transparent: true,
         blending: THREE.AdditiveBlending,
         overdraw: true,
         opacity: 0.15
            }));

    universe.setObjectInLibrary("default_orbit_line_material", new THREE.LineBasicMaterial({
                color : 0x990000,
                opacity : 1
            }));
            
    universe.setObjectInLibrary("default_ground_object_tracing_line_material", new THREE.LineBasicMaterial({
                color : 0x009900,
                opacity : 1
            }));

	// earthOptions:
    // image
    //
    this.addEarth = function(earthOptions) {
        var earthSphereSegments = 40, earthSphereRings = 30;

        // Create the sphere
        var geometry = new THREE.SphereGeometry(earthSphereRadius, earthSphereSegments, earthSphereRings);

        // Define the material to be used for the sphere surface by pulling the image and wrapping it around the sphere
        var shader = {
            uniforms : {
                'texture' : {
                    type : 't',
                    value : 0,
                    texture : null
                }
            },
            vertexShader : ['varying vec3 vNormal;', 'varying vec2 vUv;', 'void main() {', 'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', 'vNormal = normalize( normalMatrix * normal );', 'vUv = uv;', '}'].join('\n'),
            fragmentShader : ['uniform sampler2D texture;', 'varying vec3 vNormal;', 'varying vec2 vUv;', 'void main() {', 'vec3 diffuse = texture2D( texture, vUv ).xyz;', 'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );', 'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );', 'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );', '}'].join('\n')
        };
        var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        uniforms['texture'].texture = THREE.ImageUtils.loadTexture(earthOptions.image);

        var material = new THREE.ShaderMaterial({
            uniforms : uniforms,
            vertexShader : shader.vertexShader,
            fragmentShader : shader.fragmentShader
        });

        var earthMesh = new THREE.Mesh(geometry, material);

        universe.addObject({
            id : "earth",
            objectName : "earth",
            update : function(elapsedTime) {
                var rotationAngle = CoordinateConversionTools.convertTimeToGMST(universe.getCurrentUniverseTime());
                earthMesh.rotation.y = rotationAngle * (2 * Math.PI / 360);
            },
            draw : function() {
                universe.draw(this.id, earthMesh, false);
            }
        });
    };
    
    this.addMoon = function(moonOptions) {
        var moonSphereSegments = 40, moonSphereRings = 30;
        var moonSphereRadius = 1737.1;
        var initialStateVector = {x: -360680.9359251, y: -42332.8629642, z: -30945.6526294, x_dot: 0.1634206, y_dot: -1.0634127, z_dot:  0.0412856, epoch: moonOptions.epoch};

        // Create the sphere
        var geometry = new THREE.SphereGeometry(moonSphereRadius, moonSphereSegments, moonSphereRings);

        // Define the material to be used for the sphere surface by pulling the image and wrapping it around the sphere
        var shader = {
            uniforms : {
                'texture' : {
                    type : 't',
                    value : 0,
                    texture : null
                }
            },
            vertexShader : ['varying vec3 vNormal;', 'varying vec2 vUv;', 'void main() {', 'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );', 'vNormal = normalize( normalMatrix * normal );', 'vUv = uv;', '}'].join('\n'),
            fragmentShader : ['uniform sampler2D texture;', 'varying vec3 vNormal;', 'varying vec2 vUv;', 'void main() {', 'vec3 diffuse = texture2D( texture, vUv ).xyz;', 'float intensity = 1.05 - dot( vNormal, vec3( 0.0, 0.0, 1.0 ) );', 'vec3 atmosphere = vec3( 1.0, 1.0, 1.0 ) * pow( intensity, 3.0 );', 'gl_FragColor = vec4( diffuse + atmosphere, 1.0 );', '}'].join('\n')
        };
        var uniforms = THREE.UniformsUtils.clone(shader.uniforms);

        uniforms['texture'].texture = THREE.ImageUtils.loadTexture(moonOptions.image);

        var material = new THREE.ShaderMaterial({
            uniforms : uniforms,
            vertexShader : shader.vertexShader,
            fragmentShader : shader.fragmentShader
        });

        var moonMesh = new THREE.Mesh(geometry, material);

        universe.addObject({
            id : "moon",
            objectName : "moon",
            stateVector: initialStateVector,
            update : function(elapsedTime) {
                var eci = new ECICoordinates(
                        this.stateVector.x,
                        this.stateVector.y,
                        this.stateVector.z,
                        this.stateVector.x_dot,
                        this.stateVector.y_dot,
                        this.stateVector.z_dot
                    );
                    
                    var time = new Date(universe.getCurrentUniverseTime());
                    var elapsedTime = (time.getTime() - this.stateVector.epoch.getTime())/1000; // seconds
                   
                    var propagatedValue = OrbitPropagator.propagateOrbit(eci, elapsedTime, 100, this.stateVector.epoch);
                    var convertedLocation = eciTo3DCoordinates({x: propagatedValue.x, y: propagatedValue.y, z: propagatedValue.z });
                    //console.log("propagatedValue: " + JSON.stringify(propagatedValue) + " elapsedTime: " + elapsedTime);
                    moonMesh.position = {x: convertedLocation.x, y: convertedLocation.y, z: convertedLocation.z }
                    
            },
            draw : function() {
                universe.draw(this.id, moonMesh, false);
            }
        });
    }

	// spaceObject:
    // id
    // stateVector
    //   time
    //   x, y, z
    // objectName
    // propagator
    // modelId
    // showPropogationLine
    // showGroundTrackPoint
    this.addSpaceObject = function(spaceObject) {
        var objectGeometry, material;
        universe.getObjectFromLibraryById(spaceObject.modelId, function(retrieved_geometry) {
            objectGeometry = retrieved_geometry;
            universe.getObjectFromLibraryById("default_material", function(retrieved_material) {
                material = retrieved_material;

                //objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( 0, 0, 0 ) ));
                var objectModel = new THREE.Mesh(objectGeometry, material);

                universe.addObject({
                    id : spaceObject.id,
                    objectName : spaceObject.objectName,
                    update : function(elapsedTime) {
                        // need to pass a time to the propagator
                        var convertedLocation = eciTo3DCoordinates(spaceObject.propagator());
                        if(convertedLocation != undefined) {
                            objectModel.position.set(convertedLocation.x, convertedLocation.y, convertedLocation.z);

                            //http://mrdoob.github.com/three.js/examples/misc_lookat.html
                            objectModel.lookAt(centerPoint);
                        }

                    },
                    draw : function() {
                        universe.draw(this.id, objectModel, false);
                        earthExtensions.showModelForId(spaceObject.showVehicle, this.id);
                    }
                });

                earthExtensions.addPropogationLineForObject(spaceObject);
                earthExtensions.showOrbitLineForObject(spaceObject.showPropogationLine, spaceObject.id);

                earthExtensions.addGroundTrackPointForObject(spaceObject);
                earthExtensions.showGroundTrackForId(spaceObject.showGroundTrackPoint, spaceObject.id);

                earthExtensions.addSensorProjection(spaceObject);
                earthExtensions.showSensorProjectionForId(spaceObject.showSensorProjections, spaceObject.id);
                
                earthExtensions.addClosestGroundObjectTracingLine(spaceObject);
                // Have to do the below on draw for the control line since it creates a new line every draw
                // earthExtensions.showControlLineForId(spaceObject.showControlLine, spaceObject.id);
            });
        });
    };
    // groundObject:
    // id
    // propagator
    // object
    this.addGroundObject = function(groundObject) {
        var objectGeometry, objectMaterial, material;
        if(!groundObject.modelId) {
            groundObject.modelId = "default_ground_object_geometry";
            material = "default_ground_object_material";
        }
        else {
            material = "default_material";
        }
        universe.getObjectFromLibraryById(groundObject.modelId, function(retrieved_geometry) {
            objectGeometry = retrieved_geometry;
            universe.getObjectFromLibraryById(material, function(retrieved_material) {
                objectMaterial = retrieved_material;
                objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( Math.PI / 2, Math.PI, 0 ) ));
                var groundObjectMesh = new THREE.Mesh(objectGeometry, objectMaterial);

                universe.addObject({
                    id : groundObject.id,
                    objectName : groundObject.objectName,
                    currentLocation: undefined,
                    update : function(elapsedTime) {
                        // check earth rotation and update location
                        var position = eciTo3DCoordinates(groundObject.propagator());
                        groundObjectMesh.position.set(position.x, position.y, position.z);
                        this.currentLocation = {x: position.x, y: position.y, z: position.z};

                        //http://mrdoob.github.com/three.js/examples/misc_lookat.html
                        var scaled_position_vector = new THREE.Vector3(position.x, position.y, position.z);

                        // arbitrary size, just a point along the position vector further out for the object to lookAt
                        scaled_position_vector.multiplyScalar(1.4);

                        groundObjectMesh.lookAt(scaled_position_vector);
                    },
                    draw : function() {
                        universe.draw(this.id, groundObjectMesh, true);
                    }
                });
            });
        });
    };

	this.addGroundTrackPointForObject = function(object) {
        var objectGeometry, objectMaterial;
        universe.getObjectFromLibraryById("default_ground_object_geometry", function(retrieved_geometry) {
            objectGeometry = retrieved_geometry;
            universe.getObjectFromLibraryById("default_ground_track_material", function(retrieved_material) {
                objectMaterial = retrieved_material;


                var groundObjectMesh = new THREE.Mesh(objectGeometry, objectMaterial);

                universe.addObject({
                    id : object.id + "_groundPoint",
                    objectName : object.objectName,
                    update : function(elapsedTime) {
                        var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));
                        if(objectLocation != undefined) {
                            var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);

                            // move the vector to the surface of the earth
                            vector.multiplyScalar(earthSphereRadius / vector.length())

                            groundObjectMesh.position.copy(vector);
                        }
                    },
                    draw : function() {
                        universe.draw(this.id, groundObjectMesh, true);
                    }
                });
            });
        });
    }

    // method to add an orbit line
    this.addPropogationLineForObject = function(object) {
        var objectGeometry, objectMaterial;
        objectGeometry = new THREE.Geometry();
        universe.getObjectFromLibraryById("default_orbit_line_material", function(retrieved_material) {
            objectMaterial = retrieved_material;
            var timeToPropogate = new Date(universe.getCurrentUniverseTime());
            var loopCount = 1440;

            // draw a vertex for each minute in a 24 hour period
            // dropped this to a vertex for every 5 minutes.  This seems to be about the max that you can use for a LEO
            // and still look decent.  HEOs and GEOs look fine with much greater spans.  For performance reasons, may want
            // to make this a param that can be set per vehicle
            for(var j = 0; j < loopCount; j += 5) {
                var convertedLocation = eciTo3DCoordinates(object.propagator(timeToPropogate, false));
                if(convertedLocation != undefined) {
                    var vector = new THREE.Vector3(convertedLocation.x, convertedLocation.y, convertedLocation.z);
                    objectGeometry.vertices.push(new THREE.Vertex(vector));
                }

                timeToPropogate.setMinutes(timeToPropogate.getMinutes() + 5);
            }

            var lineS = new THREE.Line(objectGeometry, objectMaterial);

            universe.addObject({
                id : object.id + "_propogation",
                objectName : object.objectName,
                update : function(elapsedTime) {
                // add points onto the end of the track?
                },
                draw : function() {
                    universe.draw(this.id, lineS, false);
                }
            });
        });
    }

    this.addSensorProjection = function(object) {

        var objectGeometry, objectMaterial;

        // Determine the object's location in 3D space
        var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));
        if(objectLocation != undefined) {
            // Create a SensorPattern
            var sensor_size = 1;
            objectGeometry = new SensorPatternGeometry(sensor_size);

            // TODO: this code is pretty bad;  the beam size will stay the same based on initial distance
            // from the earth.  so it's really wrong
            var initial_pos = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);
            var base_length = initial_pos.length() - earthSphereRadius;
            var cone_width_scale = 0.15;

            //17431
            
            // if the vehicle starts too close to the earth, make it a nominal length instead (i.e. a Molniya orbit)

            universe.getObjectFromLibraryById("default_sensor_projection_material", function(retrieved_material) {
                objectMaterial = retrieved_material;

                var sensorProjection = new THREE.Mesh(objectGeometry, objectMaterial);

                sensorProjection.doubleSided=true;

                universe.addObject({
                    id : object.id + "_sensorProjection",
                    objectName : object.objectName,
                    update : function(elapsedTime) {

                        var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));

                        if(objectLocation != undefined) {
                            var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);

                            // Move the tip of the sensor projection to the vehicle's location
                            sensorProjection.position.copy(vector);

                            // the sensor projections are along the z axis and a length of 1, so scaling it
                            // arbitarily along z will extend the length
                            sensorProjection.scale.z = vector.length() - earthSphereRadius + 200;
                            
                            // sensor_size is the projection dimension at the earth's surface (or at least the end of the cone)
                            // the projection length of the vector is 1
                            //sensorProjection.scale.x = sensorProjection.scale.y = sensorProjection.scale.z * (1 / base_length) ;
                            sensorProjection.scale.x = sensorProjection.scale.y = sensorProjection.scale.z * cone_width_scale ;
                            //logger.debug("vec length:" + vector.length() +"    base_length:" + base_length + "   sensor scale: " + sensorProjection.scale.x);

                            var sensor_boresite = new THREE.Vector3(0,0,0);
                            sensorProjection.lookAt(sensor_boresite);


                        }
                    },
                    draw : function() {
                        universe.draw(this.id, sensorProjection, false);
                    }
                });
            });
        }
    }
    
    this.addClosestGroundObjectTracingLine = function(object) {
        var objectGeometry, objectMaterial;
        
        
        universe.getObjectFromLibraryById("default_ground_object_tracing_line_material", function(retrieved_material) {
            objectMaterial = retrieved_material;

            var line = undefined;
            universe.addObject({
                id : object.id + "_controlLine",
                objectName : object.objectName,
                update : function(elapsedTime) {
                    
                    var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));
                    
                    var closestGroundObject = findClosestGroundObject(objectLocation);
                         
                    if(closestGroundObject != undefined) {
                        objectGeometry = new THREE.Geometry();
                        var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);
                        objectGeometry.vertices.push(new THREE.Vertex(vector));
                        
                        var vector2 = new THREE.Vector3(closestGroundObject.currentLocation.x, closestGroundObject.currentLocation.y, closestGroundObject.currentLocation.z);
                        objectGeometry.vertices.push(new THREE.Vertex(vector2));
                        
                        line = new THREE.Line(objectGeometry, objectMaterial);
                    }
                },
                draw : function() {
                    universe.unDraw(this.id);
                    if(line != undefined) {
                        universe.draw(this.id, line, false);
                        
                        //TODO: this is not perfect.  It does not allow the vehicle to override the global setting as the other settings do
                        if(enableControlLines != undefined) {
                            earthExtensions.showControlLineForId(enableControlLines, object.id);
                        }
                        else {
                            earthExtensions.showControlLineForId(object.showControlLine, object.id);                            
                        }

                    }
                }
            });
        });
    }
    
    function findClosestGroundObject(location) {
		if(location != undefined) {
			var location_vector = new THREE.Vector3(location.x, location.y, location.z);

	        // move the vector to the surface of the earth
	        location_vector.multiplyScalar(earthSphereRadius / location_vector.length())

	        return findClosestObject(location_vector);
		}
        return undefined;
    }
    
    function findClosestObject(location_vector) {
        var graphicsObjects = universe.getGraphicsObjects();
        
        var closestDistance = undefined;
        var closestObject = undefined;
        
        for(var i in graphicsObjects) {
            if(graphicsObjects[i].currentLocation != undefined) {
                var vector = new THREE.Vector3(graphicsObjects[i].currentLocation.x, graphicsObjects[i].currentLocation.y, graphicsObjects[i].currentLocation.z);
                var distance_to = vector.distanceTo(location_vector);
                if(closestDistance == undefined || distance_to < closestDistance) {
                    closestObject = graphicsObjects[i];
                    closestDistance = distance_to;
                }
            }
        }
        
        return closestObject;
    }
    
    this.showAllOrbitLines = function(isEnabled) {
        var graphicsObjects = universe.getGraphicsObjects();

        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id.indexOf("_propogation") != -1){
                universe.showObject(graphicsObjects[i].id, isEnabled);
            }
        }
    }

    this.showOrbitLineForObject = function(isEnabled, id) {
        logger.debug("in show orbit lines " + isEnabled);
        universe.showObject(id + "_propogation", isEnabled);
    }

    this.showModelForId = function(isEnabled, id) {
        logger.debug("show/hiding vehicle model " + isEnabled);
        universe.showObject(id, isEnabled);
    }
    
    this.showAllGroundTracks = function(isEnabled) {
        var graphicsObjects = universe.getGraphicsObjects();

        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id.indexOf("_groundPoint") != -1){
                universe.showObject(graphicsObjects[i].id, isEnabled);
            }
        }
    }

    this.showGroundTrackForId = function(isEnabled, id) {
        logger.debug("show/hiding groundTrack, isEnabled: " + isEnabled + " id: " + id);
        universe.showObject(id + "_groundPoint", isEnabled);
    }
    
    this.showAllSensorProjections = function(isEnabled) {
        var graphicsObjects = universe.getGraphicsObjects();

        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id.indexOf("_sensorProjection") != -1){
                universe.showObject(graphicsObjects[i].id, isEnabled);
            }
        }
    }

    this.showSensorProjectionForId = function(isEnabled, id) {
        //console.log("show/hiding sensorProjection");
        universe.showObject(id + "_sensorProjection", isEnabled);
    }
    
    this.showAllControlLines = function(isEnabled) {
        enableControlLines = isEnabled;
        var graphicsObjects = universe.getGraphicsObjects();

        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id.indexOf("_controlLine") != -1){
                universe.showObject(graphicsObjects[i].id, isEnabled);
            }
        }
    }
    
    this.showControlLineForId = function(isEnabled, id) {
        universe.showObject(id + "_controlLine", isEnabled);
    }

    this.removeAllExceptEarthAndMoon = function() {
        var graphicsObjects = universe.getGraphicsObjects();
        
        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id != "earth" && graphicsObjects[i].id != "moon") {
                universe.removeObject(graphicsObjects[i].id);
            }
        }
    }

	this.setup = function() {
		this.removeAllExceptEarthAndMoon();
		universe.setup();
	}

    // Compare these two websites for details on why we have to do this:
    // http://celestrak.com/columns/v02n01/
    // http://stackoverflow.com/questions/7935209/three-js-3d-coordinates-system
    function eciTo3DCoordinates(location) {
        if(location == undefined) {
            return undefined;
        }
        return {
            x : -location.x,
            y : location.z,
            z : location.y
        };
    }
}
var HarmonicTerms = {

    /**
     *
     * @param state double[]
     * @param GST   double
     *
     * @returns Array of double
     */
    calculatePerturbationTerms: function(state, GST)
    {

    }
}; var OrbitPropagator = {

    /**
     *
     *
     * @param state                    double[]
     * @param elapsedTime              double
     * @param dt                       double
     * @param timeAtStartOfPropagation date
     *
     * @returns Array of doubles
     */
    rungeKuttaFehlbergIntegrator: function(state, elapsedTime, dt, timeAtStartOfPropagation)
    {
        //fifth order runge-kutta-fehlberg integrator
        var tempState = state;

        var f = new Array();          //array of doubles[9]
        var deltaState = new Array(); //array of doubles[9]
        var dtPrime = 0.0;            //double

        var N = 1;  //int
        var h = dt; //double

        //if the timestep is too big, reduce it to a smaller timestep and loop through the updates at the smaller timestep to add up to the total timestep
        var maxResolution = 0.02; //double

        if (dt > maxResolution)
        {
            h = maxResolution;
        }

        var newMilliseconds = timeAtStartOfPropagation.getTime(); //long

        N = elapsedTime / h;

        var j = 1;

        for (j = 1; j <= N; j++)
        {
            newMilliseconds = newMilliseconds + (h * 1000.0); //keep in millis
            var simTime = new Date(newMilliseconds);
            GST = CoordinateConversionTools.convertTimeToGMST(simTime); //double

            var k1 = new Array(); //double[9]
            var k2 = new Array(); //double[9]
            var k3 = new Array(); //double[9]
            var k4 = new Array(); //double[9]
            var k5 = new Array(); //double[9]
            var k6 = new Array(); //double[9]

            //for loop counter
            var i = 0;

            //build k1
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i];
            }

            dtPrime = h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k1[i] = h * f[i];
            }

            //build k2
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + 0.25 * k1[i];
            }

            dtPrime = 0.25 * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k2[i] = h * f[i];
            }

            //build k3
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + (3.0 / 32.0) * k1[i] + (9.0 / 32.0) * k2[i];
            }

            dtPrime = 0.375 * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k3[i] = h * f[i];
            }

            //build k4
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + ((1932.0 / 2197.0) * k1[i]) -
                    ((7200.0 / 2197.0) * k2[i]) + ((7296.0 / 2197.0) * k3[i]);
            }

            dtPrime = 0.9230769230769231 * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k4[i] = h * f[i];
            }

            //build k5
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + ((439.0 / 216.0) * k1[i]) -
                    (8.0 * k2[i]) + ((3680.0 / 513.0) * k3[i]) - ((845.0 / 4104.0) * k4[i]);
            }

            dtPrime = h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k5[i] = h * f[i];
            }

            //build k6
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] - ((8.0 / 27.0) * k1[i]) +
                    ((2.0) * k2[i]) - ((3544.0 / 2565.0) * k3[i]) +
                    ((1859.0 / 4104.0) * k4[i]) - ((11.0 / 40.0) * k5[i]);
            }

            dtPrime = (0.5) * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k6[i] = h * f[i];
            }

            //generate the estimate for this step in time
            for (i = 0; i < 9; i++)
            {
                //http://en.wikipedia.org/wiki/Runge%E2%80%93Kutta%E2%80%93Fehlberg_method
                tempState[i] = tempState[i] + ((16.0 / 135.0) * k1[i]) +
                    ((6656.0 / 12825.0) * k3[i]) + ((28561.0 / 56430.0) * k4[i]) -
                    ((9.0 / 50.0) * k5[i]) + ((2.0 / 55.0) * k6[i]);
            }
        }

        return tempState;
    },

    /**
     *
     *
     * @param state double[]
     * @param dt    double
     * @param GST   double
     *
     * @returns double[]
     */
    generateStateUpdate: function(state, dt, GST)
    {
        //state is 9x1
        //state structure is x,y,z,vx,vy,vz,ax,ay,az
        var stateRateOfChange = new Array(); //double[9]
        var mu = Constants.muEarth;     //double
        var r = Math.sqrt((state[0] * state[0]) + (state[1] * state[1]) +
            (state[2] * state[2])); //double

        //figure out the rate of change of x,y,z,vx,vy,vz
        stateRateOfChange[0] = state[3]; //vx
        stateRateOfChange[1] = state[4]; //vy
        stateRateOfChange[2] = state[5]; //vz
        stateRateOfChange[3] = -mu * state[0] / (r * r * r); //ax
        stateRateOfChange[4] = -mu * state[1] / (r * r * r); //ay
        stateRateOfChange[5] = -mu * state[2] / (r * r * r); //az
        stateRateOfChange[6] = 0.0;
        stateRateOfChange[7] = 0.0;
        stateRateOfChange[8] = 0.0;
       
        return stateRateOfChange;
    },

    /**
     *
     * @param eci                      ECICoordinates
     * @param elapsedTime              double
     * @param dt                       double, time-step
     * @param timeAtStartOfPropagation Date
     *
     * @returns ECICoordinates
     */
    propagateOrbit: function(eci, elapsedTime, dt, timeAtStartOfPropagation)
    {
        
        var kep = CoordinateConversionTools.convertECIToKeplerian(eci);
        //console.log('eccentricity: ' + JSON.stringify(kep.getEccentricity()));
        //timespan is in seconds
        if (elapsedTime == 0.0 || isNaN(kep.getEccentricity()))
        {
            return eci;
        }
        else if(kep.getEccentricity() <= 0.1) {
            //console.log('keping it up');
            var MA = kep.getMeanAnomaly()+kep.getMeanMotion()*elapsedTime; //update the mean anomaly (deg)
            var w = MathTools.toRadians(kep.getArgOfPerigee());
            var ra = MathTools.toRadians(kep.getRaan());
            var inc = MathTools.toRadians(kep.getInclination());
            var ecc=kep.getEccentricity();
            var mu=Constants.muEarth;
            //System.out.println("elapsed time: "+elapsedTime+" dt: "+dt+" ecc: "+kep.getEccentricity());
            //console.log("MA: "+kep.getMeanAnomaly()+" meanMotion: "+kep.getMeanMotion()+" new MA: "+MA + " elapsedTime: " + elapsedTime);
            MA = MathTools.toRadians(MA);  //convert the mean anomaly to radians
            //iterate to solve for the eccentric anomaly
            var EA = MA * 0.95; //fist guess at the eccentric anomaly (rads)
            var errorThreshold = 1e-5;  //how accurately do we need to solve for the eccentric anomaly?
            for (var i = 0; i < 500; i++)
            {
                var myerror = MA - (EA - ecc * Math.sin(EA));
                if (Math.abs(myerror) > errorThreshold)
                {
                    if (myerror > 0)
                    {
                        EA = EA + Math.abs(MA - EA) / 2;
                    }
                    else
                    {
                        if (myerror < 0)
                        {
                            EA = EA - Math.abs(MA - EA) / 2;
                        }
                    }
                }
                else
                {
                    break;
                }

            }

            var f = 2 * Math.atan(Math.sqrt((1 + ecc) / (1 - ecc)) * Math.tan(EA / 2));
            var p = kep.getSemimajorAxis() * (1 -ecc * ecc);
            var r = kep.getSemimajorAxis() * (1 -ecc* Math.cos(EA)); //radius
            var h = Math.sqrt(mu * kep.getSemimajorAxis() * (1 - ecc* ecc));
            var x = r * (Math.cos(ra) * Math.cos(w + f) - Math.sin(ra) * Math.sin(w + f) * Math.cos(inc));
            var y = r * (Math.sin(ra) * Math.cos(w + f) + Math.cos(ra) * Math.sin(w + f) * Math.cos(inc));
            var z = r * Math.sin(inc) * Math.sin(w + f);
            var xdot = ((x * h * ecc) / (r * p)) * Math.sin(f) - (h / r) * (Math.cos(ra) * Math.sin(w + f) + Math.sin(ra) * Math.cos(w + f) * Math.cos(inc));
            var ydot = ((y * h * ecc) / (r * p)) * Math.sin(f) - (h / r) * (Math.sin(ra) * Math.sin(w + f) - Math.cos(ra) * Math.cos(w + f) * Math.cos(inc));
            var zdot = ((z * h * ecc) / (r * p)) * Math.sin(f) + (h / r) * (Math.sin(inc) * Math.cos(w + f));

            //System.out.println(vehicleName+","+x+","+y+","+z+","+xdot+","+ydot+","+zdot);
            var eciState = new ECICoordinates();
            
            eciState.setX(x);
            eciState.setY(y);
            eciState.setZ(z);
            eciState.setVX(xdot);
            eciState.setVY(ydot);
            eciState.setVZ(zdot);
            eciState.setAX(0.0);
            eciState.setAY(0.0);
            eciState.setAZ(0.0);
            return eciState;
        }
        else
        {
            //console.log('runging it up: ' + + JSON.stringify(kep.getEccentricity()));
            var state = new Array();     //double[9]

            //establish the starting state vector;
            state[0] = eci.x;
            state[1] = eci.y;
            state[2] = eci.z;
            state[3] = eci.vx;
            state[4] = eci.vy;
            state[5] = eci.vz;
            state[6] = eci.ax;
            state[7] = eci.ay;
            state[8] = eci.az;

            //call the integrator
            var updatedState =  //double[]
               this.rungeKuttaFehlbergIntegrator(state, elapsedTime, dt, timeAtStartOfPropagation);

            //console.log("updatedState: " + JSON.stringify(updatedState));
            //translate the integrated values into the correct class structure
            var newEci = new ECICoordinates(
                updatedState[0], 
                updatedState[1], 
                updatedState[2], 
                updatedState[3], 
                updatedState[4], 
                updatedState[5], 
                updatedState[6], 
                updatedState[7], 
                updatedState[8]); //ECICoordinates
            //console.log("newEci: " + JSON.stringify(newEci));
            return newEci;
        }
    }
};
    /**
     *
     * @param
     *
     * @returns
     */

     var a = new Array();
        var i = 0;
        for(i = 0; i < 3; i++)
        {
           a[i] = new Array();
        }var Constants = {

    // define variables as <var name>: <value>

    radiusEarth:    6378.1363,     //km
    muEarth:        398600.4418,   //km3/s2
    eccEarthSphere: 0.081819221456 //vallado page 141
};var CoordinateConversionTools = {

    /**
     *
     * @param currentEpoch Date
     *
     * @returns
     */
    convertCurrentEpochToJulianDate: function(currentEpoch)
    {
        //convert a date to the Julian Date
        //this is the time since January 1, 4713 BC (12:00)
        //unit of measure = days
        var JD = 0;                               //double
        var year = currentEpoch.getYear() + 1900  //int
        var month = currentEpoch.getMonth();      //int
        var day = currentEpoch.getDate();         //int
        var hour = currentEpoch.getHours();       //int
        var minute = currentEpoch.getMinutes();   //int
        var second = currentEpoch.getSeconds();   //double

        JD = 367 * year - (7 * (year + ((month + 9) / 12)) / 4) +
            (275 * month / 9) + (day) + 1721013.5 +
            ((second / 60 + minute) / 60 + hour) / 24;

        return JD;
    },

    /**
     *
     * @param currentEpoch Date
     *
     * @returns double
     */
    convertTimeToGMST: function(currentEpoch)
    {
        var JD = this.convertCurrentEpochToJulianDate(currentEpoch); //double

        //double - julian centuries since January 1, 2000 12h UT1
        var TUT = (JD - 2451545.0) / 36525.0;

        //this is in seconds
        var GMST = 67310.54841 + (876600.0 * 3600 + 8640184.812866) * TUT +
            0.093104 * TUT * TUT - (0.0000062) * TUT * TUT * TUT;  //double

        var multiples = Math.floor(GMST / 86400.0); //double

        GMST = GMST - multiples * 86400.00;   //reduce it to be within the range of one day
        GMST = GMST / 240.0; //convert to degrees

        if (GMST < 0)
        {
            GMST = GMST + 360;
        }

        return GMST;  //degrees
    },

    /**
     *
     * @param LLACoordinates
     *
     * @returns ECEFCoordinates
     */
    convertLLAtoECEF: function(lla)
    {
        //lat = ground station latitude (deg)
        //lon = ground station longitude (deg)
        //alt = ground station altitude (km)

        var lat = MathTools.toRadians(lla.getLatitude());  //double
        var lon = MathTools.toRadians(lla.getLongitude()); //double
        var Re = Constants.radiusEarth;          //double - radius of the earth (mean) in kilometers
        var eearth = Constants.eccEarthSphere;   //double - eccentricity of the Earth's shape
        var sinLat = Math.sin(lat);                   //double
        var hellp = lla.getAltitude();                //double - height above the elliptical earth

        //REFER TO VALLADO PAGE 144 and 150
        var cearth = Re / Math.sqrt(1 - eearth * eearth * sinLat * sinLat); //double
        var searth = Re * (1 - eearth * eearth) / 
            Math.sqrt(1 - eearth * eearth * sinLat * sinLat); //double

        var x = (cearth + hellp) * (Math.cos(lat) * Math.cos(lon)); //double
        var y = (cearth + hellp) * (Math.cos(lat) * Math.sin(lon)); //double
        var z = (searth + hellp) * (Math.sin(lat));                 //double

        var ecef = new ECEFCoordinates(x, y, z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

        return ecef;
    },

    /**
     *
     * @param ecef ECEFCoordinates
     *
     * @returns LLACoordinates
     */
    convertECEFtoLLA: function(ecef)
    {
        //lat = ground station latitude (deg)
        //lon = ground station longitude (deg)
        //alt = ground station altitude (km)

        //REFER TO VALLADO PAGE 177
        var lla = new LLAcoordinates();

        var ri = ecef.getX(); //double
        var rj = ecef.getY(); //double
        var rk = ecef.getZ(); //double

        var ecc = Constants.eccEarthSphere; //double - eccentricity of the Earth's surface
        var Re = Constants.radiusEarth;     //double - radius of the earth (mean) in kilometers

        var rdelta = Math.sqrt((ri * ri) + (rj * rj));  //double
        var sinalpha = rj / rdelta;                 //double
        var cosalpha = ri / rdelta;                 //double
        var alpha = Math.atan(sinalpha / cosalpha); //double
 
        var lambda = alpha;              //double - same as the longitude
        var tandelta = rk / rdelta;      //double
        var delta = Math.atan(tandelta); //double

        var tolerance = 1e-8; //double
        var c = 0;            //double
        var lat = delta;      //double
        var latOld = 2000;    //double
        var sinLat;           //double
        var tanLat;           //double
        var count = 0;        //int

        while (Math.abs(lat - latOld) > tolerance)
        {
            latOld = lat;
            sinLat = Math.sin(latOld);
            c = Re / Math.sqrt(1 - (ecc * ecc * sinLat * sinLat));
            tanLat = (rk + c * ecc * ecc * sinLat) / rdelta;
            lat = Math.atan(tanLat);
            
            count++;

            if (count > 500)
            {
                lat = 0;
                latOld = 0;
            }
        }

        //correct the quadrants
        if (lambda < -Math.PI)
        {
            lambda = lambda + 2 * Math.PI;
        }

        if (lambda > Math.PI)
        {
            lambda = lambda - 2 * Math.PI;
        }

        lla.setLatitude(MathTools.toDegrees(lat));
        lla.setLongitude(MathTools.toDegrees(lambda));
        lla.setAltitude(rdelta / Math.cos(lat) - c);

        return lla;
    },

    /**
     *
     * @param eci ECICoordinates
     * @param GST double
     *
     * @returns ECEFCoordinates
     */
    convertECItoECEF: function(eci, GST)
    {
        //GST is in degrees
        var ecef = new ECEFcoordinates();

        //convert the position
        eciPos = new Array(); //Double[3];
        eciPos[0] = eci.getX();
        eciPos[1] = eci.getY();
        eciPos[2] = eci.getZ();

        var xyz = MathTools.rot3(GST, eciPos); //Double[3];
        ecef.setX(xyz[0]);
        ecef.setY(xyz[1]);
        ecef.setZ(xyz[2]);

        //convert the velocity
        var eciVel = new Array(); //Double[3];
        eciVel[0] = eci.getVX();
        eciVel[1] = eci.getVY();
        eciVel[2] = eci.getVZ();

        xyz = MathTools.rot3(GST, eciVel);

        ecef.setVx(xyz[0]);
        ecef.setVy(xyz[1]);
        ecef.setVz(xyz[2]);

        //convert the acceleration
        var eciAcc = new Array(); //Double[3];
        eciAcc[0] = eci.getAx();
        eciAcc[1] = eci.getAy();
        eciAcc[2] = eci.getAz();

        xyz = MathTools.rot3(GST, eciAcc);

        ecef.setAx(xyz[0]);
        ecef.setAy(xyz[1]);
        ecef.setAz(xyz[2]);

        return ecef;
    },

    /**
     *
     * @param ecef ECEFCoordinates
     * @param GST  double
     *
     * @returns ECICoordinates
     */
    convertECEFtoECI: function(ecef,  GST)
    {
        //GST is in degrees
        var eci = new ECICoordinates();

        //convert the position
        var eciPos = new Array(); //Double[3];
        eciPos[0] = ecef.getX();
        eciPos[1] = ecef.getY();
        eciPos[2] = ecef.getZ();

        var xyz = MathTools.rot3(-GST, eciPos);
        eci.setX(xyz[0]);
        eci.setY(xyz[1]);
        eci.setZ(xyz[2]);

        //convert the velocity
        var eciVel = new Array(); //Double[3];
        eciVel[0] = ecef.getVX();
        eciVel[1] = ecef.getVY();
        eciVel[2] = ecef.getVZ();

        xyz = MathTools.rot3(-GST, eciVel);

        eci.setVX(xyz[0]);
        eci.setVY(xyz[1]);
        eci.setVZ(xyz[2]);

        //convert the acceleration
        var eciAcc = new Array(); //Double[3];
        eciAcc[0] = ecef.getAX();
        eciAcc[1] = ecef.getAY();
        eciAcc[2] = ecef.getAZ();

        xyz = MathTools.rot3(-GST, eciAcc);

        eci.setAX(xyz[0]);
        eci.setAY(xyz[1]);
        eci.setAZ(xyz[2]);

        return eci;
    },

    /**
     *
     * @param eci ECICoordinates
     * @param GST double
     *
     * @returns LLACoordinates
     */
    convertECItoLLA: function(eci, GST)
    {
        var ecef = convertECItoECEF(eci, GST); //ECEFCoordinates
        return convertECEFtoLLA(ecef);
    },

    /**
     *
     * @param lla LLAcoordinates
     * @param GST double
     *
     * @returns ECICoordinates
     */
    convertLLAtoECI: function(lla, GST)
    {
        var ecef = this.convertLLAtoECEF(lla); //ECEFCoordinates
        return this.convertECEFtoECI(ecef, GST);
    },

    /**
     *
     * @param keplar KeplerianCoordinates
     *
     * @returns ECICoordinates
     */
    convertKeplerianToECI: function(kepler)
    {
        var eci = new ECIcoordinates();
        var a = kepler.getSemimajorAxis(); //double
        var e = kepler.getEccentricity();  //double
        var p = a * (1 - e * e);           //double
        var nu = kepler.getTrueAnomaly();  //double

        //reference vallado page 125
        var cosNu = Math.cos(Math.toRadians(nu)); //double
        var sinNu = Math.sin(Math.toRadians(nu)); //double

        //determine the position conversion;    //double
        var Xpqw = p * cosNu / (1 + e * cosNu); //double
        var Ypqw = p * sinNu / (1 + e * cosNu); //double
        var Zpqw = 0;                           //double

        var pqw = new Array(); //Double[3];
        pqw[0] = Xpqw;
        pqw[1] = Ypqw;
        pqw[2] = Zpqw;

        var eciValues = new Array(); //Double[3];
        eciValues = MathTools.rot3(-kepler.getArgOfPerigee(), pqw);
        eciValues = MathTools.rot1(-kepler.getInclination(), eciValues);
        eciValues = MathTools.rot3(-kepler.getRaan(), eciValues);
        eci.setX(eciValues[0]);
        eci.setY(eciValues[1]);
        eci.setZ(eciValues[2]);

        //determine the velocity conversion;                             //double
        var VXpqw = -Math.sqrt(Constants.muEarth / p) * sinNu;      //double
        var VYpqw = Math.sqrt(Constants.muEarth / p) * (e + cosNu); //double
        var VZpqw = 0;                                                   //double
        pqw[0] = VXpqw;
        pqw[1] = VYpqw;
        pqw[2] = VZpqw;
        eciValues = MathTools.rot3(-kepler.getArgOfPerigee(), pqw);
        eciValues = MathTools.rot1(-kepler.getInclination(), eciValues);
        eciValues = MathTools.rot3(-kepler.getRaan(), eciValues);
        eci.setVx(eciValues[0]);
        eci.setVy(eciValues[1]);
        eci.setVz(eciValues[2]);

        return eci;
    },

    /**
     *
     * @param eci ECICoordinates
     *
     * @returns KeplerianCoordinates
     *
     */
    convertECIToKeplerian: function(eci)
    {
        var kepler = new KeplerianCoordinates();

        /*
        if ( eci == null || typeof eci.getX === 'undefined') {
            console.log("convertECIToKeplerian received bogus eci object" + eci);
            return null;
        }
        */
        //reference Vallado 120

        var r = new Array(); //Double[3];
        r[0] = eci.x;
        r[1] = eci.y;
        r[2] = eci.z;
        
        var v = new Array(); //Double[3];
        v[0] = eci.vx;
        v[1] = eci.vy;
        v[2] = eci.vz;

        var h = MathTools.cross(r, v); //Double[3]
        var hmag = MathTools.magnitude(h); //double
        var rmag = MathTools.magnitude(r); //double
        var vmag = MathTools.magnitude(v); //double

        var khat = new Array(); //Double[3];
        khat[0] = 0.0;
        khat[1] = 0.0;
        khat[2] = 1.0;

        var n = new Array(); //Double[3];
        n = MathTools.cross(khat, h);
        
        var coeff1 = vmag * vmag - Constants.muEarth / rmag; //double
        var coeff2 = MathTools.dotMultiply(r, v);            //double
       
        var e = new Array(); //Double[3];

        var i = 0;
        for (i = 0; i < 3; i++)
        {
            e[i] = (1 / Constants.muEarth) * (coeff1 * r[i] - coeff2 * v[i]);
        }
        
        var emag = MathTools.magnitude(e);                       //double
        var energy = vmag * vmag / 2 - Constants.muEarth / rmag; //double
        
        var p = 0.0; //double
        var a = 0.0; //double

        if (emag == 1.0)
        {
            a = Infinity;
            p = hmag * hmag / Constants.muEarth;
        }
        else
        {
            a = -Constants.muEarth / (2 * energy);
            p = a * (1 - emag * emag);
        }

        var inc = MathTools.toDegrees(Math.acos(h[2] / hmag));                    //double
        var raan = MathTools.toDegrees(Math.acos(n[0] / MathTools.magnitude(n))); //double

        if (n[1] < 0)
        {
            raan = 360 - raan;
        }
        
        
        var arg = MathTools.toDegrees(Math.acos(MathTools.dotMultiply(n, e) /
            (MathTools.magnitude(n) * emag)));  //double

        if (e[2] < 0)
        {
            arg = 360 - arg;
        }
        
        // console.log("MathTools.dotMultiply(e, r) / (emag * rmag): " + MathTools.dotMultiply(e, r) / (emag * rmag) )
        // console.log("Math.acos(MathTools.dotMultiply(e, r) / (emag * rmag)): " + Math.acos(MathTools.dotMultiply(e, r) / (emag * rmag)));
        
        var value = MathTools.dotMultiply(e, r) / (emag * rmag);
        if(value > 1) {
            // console.log("setting to 1");
            value = 1;
        }
        var nu = MathTools.toDegrees(Math.acos(value)); //double
        // console.log("nu: " + nu);
        if (MathTools.dotMultiply(v, r) < 0)
        {
            nu = 360 - nu;
        }

        if(isNaN(raan))
        {
            raan = 0.00001;
        }

        if(isNaN(arg))
        {
            arg = 0.00001;
        }
        
        
        kepler.setSemimajorAxis(a);
        kepler.setEccentricity(emag);
        kepler.setTrueAnomaly(nu);
        kepler.setRaan(raan);
        kepler.setInclination(inc);
        kepler.setMeanMotion(MathTools.toDegrees(Math.sqrt(Constants.muEarth / (a * a * a))));
        kepler.setArgOfPerigee(arg);
        
        //figure out the mean anomaly
        var sinNu = Math.sin(MathTools.toRadians(nu));
        var cosNu = Math.cos(MathTools.toRadians(nu));
        var sinEA = ((sinNu * Math.sqrt(1 - emag * emag)) / (1 + emag * cosNu));
        var cosEA = ((emag + cosNu) / (1 + emag * cosNu));
        var EA = Math.atan2(sinEA, cosEA);
        var MA = EA - emag * sinEA;
        MA = MathTools.toDegrees(MA);
        kepler.setMeanAnomaly(MA);

        return kepler;
    },

    /**
     *
     * @param satellite SimulationObject
     *
     * @returns double[][]
     */
    buildRotationMatrixToConvertECItoRSW: function(satellite)
    {
        var satelliteKepler = satellite.getKepler(); //KeplerianCoords

        var nu = satelliteKepler.getTrueAnomaly();  //double
        var w = satelliteKepler.getArgOfPerigee();  //double
        var inc = satelliteKepler.getInclination(); //double
        var raan = satelliteKepler.getRaan();       //double

        var netRotationMatrix = new Array(3);

        var i = 0;
        for(var i = 0; i < 3; i++) //create as Double[3][3];
        {
            netRotationMatrix[i] = new Array(3);
        }

        netRotationMatrix = MathTools.buildRotationMatrix3(raan);
        netRotationMatrix = MathTools.multiply(MathTools.buildRotationMatrix1(inc), netRotationMatrix);
        netRotationMatrix = MathTools.multiply(MathTools.buildRotationMatrix3(w), netRotationMatrix);
        netRotationMatrix = MathTools.multiply(MathTools.buildRotationMatrix3(nu), netRotationMatrix);

        return netRotationMatrix;
    },

    /**
     *
     * @param satellite SimulationObject
     * @param targetECI ECIcoordinates
     *
     * @returns RSWcoordinates
     *
     */
    convertTargetECIToSatelliteRSW: function(satellite, targetECI)
    {
        var rsw = new RSWcoordinates();
        var satelliteKepler = satellite.getKepler(); //KeplerianCoordinates
        var satelliteECI = satellite.getEci();       //ECICoordinates

        var nu = satelliteKepler.getTrueAnomaly();  //double
        var w = satelliteKepler.getArgOfPerigee();  //double
        var inc = satelliteKepler.getInclination(); //double
        var raan = satelliteKepler.getRaan();       //double

        var rijk = new Array(); //Double[3];
        rijk[0] = targetECI.getX() - satelliteECI.getX();
        rijk[1] = targetECI.getY() - satelliteECI.getY();
        rijk[2] = targetECI.getZ() - satelliteECI.getZ();

        rijk = MathTools.rot3(raan, rijk);
        rijk = MathTools.rot1(inc, rijk);
        rijk = MathTools.rot3(w, rijk);
        rijk = MathTools.rot3(nu, rijk);

        rsw.setRadial(rijk[0]);
        rsw.setAlongTrack(rijk[1]);
        rsw.setCrossTrack(rijk[2]);

        return rsw;
    },

    /**
     *
     * @param satellite SimulationObject
     * @param rsw RSWcoordinates
     *
     * @returns ECIcoordinates
     */
    convertRSWToECI: function(satellite, rsw)
    {
        var eci = new ECIcoordinates();
        var satelliteKepler = satellite.getKepler();

        var nu = satelliteKepler.getTrueAnomaly();
        var w = satelliteKepler.getArgOfPerigee();
        var inc = satelliteKepler.getInclination();
        var raan = satelliteKepler.getRaan();

        var rswVec = new Array();        //Double[3];
        rswVec[0] = rsw.getRadial();
        rswVec[1] = rsw.getAlongTrack();
        rswVec[2] = rsw.getCrossTrack();

        var rijk = new Array();              //Double[3];
        rijk = MathTools.rot3(-nu, rswVec);  //to PQW format
        rijk = MathTools.rot3(-w, rijk);
        rijk = MathTools.rot1(-inc, rijk);
        rijk = MathTools.rot3(-raan, rijk);

        eci.setX(rijk[0]);
        eci.setY(rijk[1]);
        eci.setZ(rijk[2]);

        return eci;
    },

    /**
     *
     * @param currentEpoch Date
     *
     * @returns ECIcoordinates
     */
    getSunPositionECIAtCurrentTime: function(currentEpoch)
    {
        //ref Vallado 266
        var JD = convertCurrentEpochToJulianDate(currentEpoch);

        //julian centuries since January 1, 2000 12h UT1
        var TUT = (JD - 2451545.0) / 36525.0;
        var lambdaSun = 280.4606184 + 36000.77005361 * TUT;  //solar angle (deg)
        var Msun = 357.5277233 + 35999.05034 * TUT;
        var lambdaEcliptic = lambdaSun + 1.914666471 *
            Math.sin(Math.toRadians(Msun)) + 0.019994643 *
            Math.sin(2 * Math.toRadians(Msun));//ecliptic angle (deg)

        //distance of the sun in AU
        var rsun = 1.000140612 - 0.016708617 * Math.cos(Math.toRadians(Msun)) -
            0.000139589 * Math.cos(2 * Math.toRadians(Msun));
        var e = 23.439291 - 0.0130042 * TUT;  //ecliptic latitude on the earth

        var AU = 149597870.0;  //one astronomical unit (km)
        var sunPosition = new ECIcoordinates();

        sunPosition.setX(rsun * Math.cos(Math.toRadians(lambdaEcliptic)) * AU);
        sunPosition.setY(rsun * Math.cos(Math.toRadians(e)) *
            Math.sin(Math.toRadians(lambdaEcliptic)) * AU);
        sunPosition.setZ(rsun * Math.sin(Math.toRadians(e)) *
            Math.sin(Math.toRadians(lambdaEcliptic)) * AU);

        return sunPosition;
    }
};
var CoordinateFunctionHelper = {

    /**
     * Uses a true anomoly to update the eccentric anomoly and mean anomoly.
     */
    updateKeplerianAnglesUsingTrueAnomaly: function(keplerianCoords)
    {
        var nu = Math.toRadians(trueAnomaly);
        var sinEA = Math.sin(nu) * Math.sqrt(1 - keplerianCoords.eccentricity * keplerianCoords.eccentricity) /
            (1 + keplerianCoords.eccentricity * Math.cos(nu));
        var cosEA = (keplerianCoords.eccentricity + Math.cos(nu)) /
            (1 + keplerianCoords.eccentricity * Math.cos(nu));

        keplerianCoords.eccentricAnomaly = Math.toDegrees(Math.atan2(sinEA, cosEA));
        keplerianCoords.meanAnomaly = Math.toDegrees(Math.toRadians(keplerianCoords.eccentricAnomaly) -
            keplerianCoords.eccentricity * sinEA);
    },

    /**
     * Sets a new true anomoly and updates the eccentric and mean anomoly vals.
     */
    setKeplerianTrueAnomaly: function(keplerianCoords, newTrueAnomaly)
    {
        keplerianCoords.trueAnomaly = newTrueAnomaly;
        updateAnglesUsingTrueAnomaly(keplerianCoords);
    }
};function ECEFCoordinates(xVal, yVal, zVal, vxVal, vyVal, vzVal, axVal, ayVal, azVal)  {

    // define variables as <var name>: <value>

    this.x = xVal ? xVal : 0.0, //km
    this.y =  yVal ? yVal : 0.0, //km
    this.z =  zVal ? zVal : 0.0, //km
    this.vx = vxVal ? vxVal : 0.0, //km
    this.vy = vyVal ? vyVal : 0.0, //km
    this.vz = vzVal ? vzVal : 0.0, //km
    this.ax = axVal ? axVal : 0.0, //km
    this.ay = ayVal ? ayVal : 0.0, //km
    this.az = azVal ? azVal : 0.0 //km

   /**
     * Get the X value.
     */
    this.getX = function()
    {
        return this.x;
    }

    /**
     * Set the X value.
     */
    this.setX = function(newX)
    {
        this.x = newX;
    }

    /**
     * Get the Y value.
     */
    this.getY = function()
    {
        return this.y;
    }

    /**
     * Set the Y value.
     */
    this.setY = function(newY)
    {
        this.y = newY;
    }

    /**
     * Get the Z value.
     */
    this.getZ = function()
    {
        return this.z;
    }

    /**
     * Set the Z value.
     */
    this.setZ = function(newZ)
    {
        this.z = newZ;
    }

   /**
     * Get the VX value.
     */
    this.getVX = function()
    {
        return this.vx;
    }

    /**
     * Set the VX value.
     */
    this.setVX = function(newVX)
    {
        this.vx = newVX;
    }

    /**
     * Get the VY value.
     */
    this.getVY = function()
    {
        return this.vy;
    }

    /**
     * Set the VY value.
     */
    this.setVY = function(newVY)
    {
        this.vy = newVY;
    }

    /**
     * Get the VZ value.
     */
    this.getVZ = function()
    {
        return this.vz;
    }

    /**
     * Set the VZ value.
     */
    this.setVZ = function(newVZ)
    {
        this.vz = newVZ;
    }

    /**
     * Get the AX value.
     */
    this.getAX = function()
    {
        return this.ax;
    }

    /**
     * Set the AX value.
     */
    this.setAX = function(newAX)
    {
        this.ax = newAX;
    }

    /**
     * Get the AY value.
     */
    this.getAY = function()
    {
        return this.ay;
    }

    /**
     * Set the AY value.
     */
    this.setAY = function(newAY)
    {
        this.ay = newAY;
    }

    /**
     * Get the AZ value.
     */
    this.getAZ = function()
    {
        return this.az;
    }

    /**
     * Set the AZ value.
     */
    this.setAZ = function(newAZ)
    {
        this.az = newAZ;
    }
}function ECICoordinates(xVal, yVal, zVal, vxVal, vyVal, vzVal, axVal, ayVal, azVal) {
    
    // define variables as <var name>: <value>

    this.x = xVal ? xVal : 0.0, //km
    this.y =  yVal ? yVal : 0.0, //km
    this.z =  zVal ? zVal : 0.0, //km
    this.vx = vxVal ? vxVal : 0.0, //km
    this.vy = vyVal ? vyVal : 0.0, //km
    this.vz = vzVal ? vzVal : 0.0, //km
    this.ax = axVal ? axVal : 0.0, //km
    this.ay = ayVal ? ayVal : 0.0, //km
    this.az = azVal ? azVal : 0.0 //km
    
    /**
     * Get the X value.
     */
    this.getX = function()
    {
        return this.x;
    }

    /**
     * Set the X value.
     */
    this.setX = function(newX)
    {
        this.x = newX;
    }

    /**
     * Get the Y value.
     */
    this.getY = function()
    {
        return this.y;
    }

    /**
     * Set the Y value.
     */
    this.setY = function(newY)
    {
        this.y = newY;
    }

    /**
     * Get the Z value.
     */
    this.getZ = function()
    {
        return this.z;
    }

    /**
     * Set the Z value.
     */
    this.setZ = function(newZ)
    {
        this.z = newZ;
    }

   /**
     * Get the VX value.
     */
    this.getVX = function()
    {
        return this.vx;
    }

    /**
     * Set the VX value.
     */
    this.setVX = function(newVX)
    {
        this.vx = newVX;
    }

    /**
     * Get the VY value.
     */
    this.getVY = function()
    {
        return this.vy;
    }

    /**
     * Set the VY value.
     */
    this.setVY = function(newVY)
    {
        this.vy = newVY;
    }

    /**
     * Get the VZ value.
     */
    this.getVZ = function()
    {
        return this.vz;
    }

    /**
     * Set the VZ value.
     */
    this.setVZ = function(newVZ)
    {
        this.vz = newVZ;
    }

    /**
     * Get the AX value.
     */
    this.getAX = function()
    {
        return this.ax;
    }

    /**
     * Set the AX value.
     */
    this.setAX = function(newAX)
    {
        this.ax = newAX;
    }

    /**
     * Get the AY value.
     */
    this.getAY = function()
    {
        return this.ay;
    }

    /**
     * Set the AY value.
     */
    this.setAY = function(newAY)
    {
        this.ay = newAY;
    }

    /**
     * Get the AZ value.
     */
    this.getAZ = function()
    {
        return this.az;
    }

    /**
     * Set the AZ value.
     */
    this.setAZ = function(newAZ)
    {
        this.az = newAZ;
    }
}function KeplerianCoordinates(theSemimajorAxis, theMeanAnomaly, theEccentricAnomaly, theTrueAnomaly, theInclination, theEccentricity, theRaan, theArgOfPerigee, theMeanMotion) {

    this.semimajorAxis = theSemimajorAxis ? theSemimajorAxis : 0.0, //km
    this.meanAnomaly = theMeanAnomaly ? theMeanAnomaly : 0.0,
    this.eccentricAnomaly = theMeanAnomaly ? theMeanAnomaly : 0.0,
    this.trueAnomaly = theTrueAnomaly ? theTrueAnomaly : 0.0,
    this.inclination = theInclination ? theInclination : 0.0, //deg
    this.eccentricity = theEccentricity ? theEccentricity : 0.0, //unitless
    this.raan = theRaan ? theRaan : 0.0, //deg
    this.argOfPerigee = theArgOfPerigee ? theArgOfPerigee : 0.0, //deg
    this.meanMotion = theMeanMotion ? theMeanMotion : 0.0 //deg/sec
    
    this.getSemimajorAxis = function()
    {
        return this.semimajorAxis;
    }
    
    this.getMeanAnomaly = function()
    {
        return this.meanAnomaly;
    }

    this.getEccentricAnomaly = function()
    {
        return this.eccentricAnomaly;
    }
    
    this.getTrueAnomaly = function()
    {
        return this.trueAnomaly;
    }

    this.getInclination = function()
    {
        return this.inclination;
    }
    
    this.getEccentricity = function()
    {
        return this.eccentricity;
    }
    
    this.getRaan = function() {
        return this.raan;
    }
    
    this.getArgOfPerigee = function() {
        return this.argOfPerigee;
    }
    
    this.getMeanMotion = function() {
        return this.meanMotion;
    }

    // setters
    this.setSemimajorAxis = function(theSemimajorAxis)
    {
         this.semimajorAxis = theSemimajorAxis;
    }
    
    this.setMeanAnomaly = function(theMeanAnomaly)
    {
         this.meanAnomaly = theMeanAnomaly;
    }

    this.setEccentricAnomaly = function(theEccentricAnomaly)
    {
         this.eccentricAnomaly = theEccentricAnomaly;
    }
    
    this.setTrueAnomaly = function(theTrueAnomaly)
    {
         this.trueAnomaly = theTrueAnomaly;
    }

    this.setInclination = function(theInclination)
    {
         this.inclination = theInclination;
    }
    
    this.setEccentricity = function(theEccentricity)
    {
         this.eccentricity = theEccentricity;
    }
    
    this.setRaan = function(theRaan) {
         this.raan = theRaan;
    }
    
    this.setArgOfPerigee = function(theArgOfPerigee) {
         this.argOfPerigee = theArgOfPerigee;
    }
    
    this.setMeanMotion = function(theMeanMotion) {
         this.meanMotion = theMeanMotion;
    }
}
function LLACoordinates(lat, lon, alt) {

    // define variables as <var name>: <value>

    this.latitude =  lat ? lat : 0.0, //deg
    this.longitude = lon ? lon : 0.0, //deg
    this.altitude =  alt ? alt : 0.0  //km

    /**
     * Returns the altitude value.
     */
    this.getAltitude = function()
    {
        return this.altitude;
    }

    /**
     * Sets a new altitude value.
     */
    this.setAltitude = function(newAltitude)
    {
        this.altitude = newAltitude;
    }

    /**
     * Returns the latitude value.
     */
    this.getLatitude = function()
    {
        return this.latitude;
    }

    /**
     * Sets a new latitude value.
     */
    this.setLatitude = function(newLatitude)
    {
        this.latitude = newLatitude;
    }

    /**
     * Returns the longitude value.
     */
    this.getLongitude = function()
    {
        return this.longitude;
    }

    /**
     * Sets a new longitude value.
     */
    this.setLongitude = function(setLongitude)
    {
        this.longitude = setLongitude;
    }
}
var MathTools = {

    /**
     *
     * @param x double[]
     * @param a double
     *
     * @returns Array of double
     */
    scalarMultiply: function(x, a)
    {
        var N = x.length;          //int
        var xTimesA = new Array(); //Double[N];

        for (var i = 0; i < N; i++)
        {
            xTimesA[i] = x[i] * a;
        }

        return xTimesA;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns double
     */
    dotMultiply: function(x,  y)
    {
        if (x.length != y.length)
        {
            return 0.0;
        }
        else
        {
            var N = x.length; //int
            var xDotY = 0.0;  //double

            for (var i = 0; i < N; i++)
            {
                xDotY += (x[i] * y[i]);
            }

            return xDotY;
        }
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns double
     */
    angleBetweenTwoVectors: function(x, y)
    {
        var angle = 0;                 //double
        var magX = magnitude(x);       //double
        var magY = magnitude(y);       //double
        var xDotY = dotMultiply(x, y); //double

        angle = Math.toDegrees(Math.acos(xDotY / (magX * magY)));

        return angle; //deg
    },

    /**
     *
     * @param x Double[]
     *
     * @returns double
     */
    magnitude: function(x)
    {
        var vectorMagnitude = 0; //double
        vectorMagnitude = Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);

        return vectorMagnitude;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns Array of double
     */
    cross: function(x, y)
    {
        var result = new Array(); //Double[3];

        //returns the cross product of x cross y
        result[0] = x[1] * y[2] - y[1] * x[2];    //i
        result[1] = -(x[0] * y[2] - y[0] * x[2]); //j
        result[2] = x[0] * y[1] - y[0] * x[1];    //k

        return result;
    },

    /**
     *
     * @param x   double
     * @param vec Double[]
     *
     * @returns Array of double
     */
    rot1: function(x, vec)
    {
        x = MathTools.toRadians(x);

        var result = new Array(); //Double[3];
        result[0] = vec[0];
        result[1] = Math.cos(x) * vec[1] + Math.sin(x) * vec[2];
        result[2] = -Math.sin(x) * vec[1] + Math.cos(x) * vec[2];

        return result;
    },

    /**
     *
     * @param x   double
     * @param vec Double[]
     *
     * @returns Array of double
     */
    rot2: function(x, vec)
    {
        x = MathTools.toRadians(x);
        
        var result = new Array(); //Double[3];

        result[0] = Math.cos(x) * vec[0] - Math.sin(x) * vec[2];
        result[1] = vec[1];
        result[2] = Math.sin(x) * vec[0] + Math.cos(x) * vec[2];

        return result;
    },

    /**
     *
     * @param x   double
     * @param vec Double[]
     *
     * @returns Array of double
     */
    rot3: function(x, vec)
    {
        x = MathTools.toRadians(x);

        var result = new Array(); //Double[3];

        result[0] = Math.cos(x) * vec[0] + Math.sin(x) * vec[1];
        result[1] = -Math.sin(x) * vec[0] + Math.cos(x) * vec[1];
        result[2] = vec[2];

        return result;
    },

    /**
     *
     * @param valueInDegrees   double
     *
     * @returns double
     */
    toRadians: function(valueInDegrees)
    {
        return valueInDegrees * Math.PI / 180.0;
    },

    /**
     *
     * @param valueInRadians double
     *
     * @returns double
     */
    toDegrees: function(valueInRadians)
    {
        return valueInRadians * 180 / Math.PI;
    },

    /**
     *
     * @param x double
     *
     * @returns double[3][3]
     */
    buildRotationMatrix1: function(x)
    {
        x = Math.toRadians(x);
        var result = new Array(); //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = new Array();
        }

        result[0][0] = 1.0;
        result[0][1] = 0.0;
        result[0][2] = 0.0;
        result[1][0] = 0.0;
        result[1][1] = Math.cos(x);
        result[1][2] = -Math.sin(x);
        result[2][0] = 0.0;
        result[2][1] = Math.sin(x);
        result[2][2] = Math.cos(x);

        return result;
    },

    /**
     *
     * @param x double
     *
     * @returns double[3][3]
     */
    buildRotationMatrix2: function(x)
    {
        x = Math.toRadians(x);
        var result = new Array(); //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = new Array();
        }

        result[0][0] = Math.cos(x);
        result[0][1] = 0.0;
        result[0][2] = Math.sin(x);
        result[1][0] = 0.0;
        result[1][1] = 1.0;
        result[1][2] = 0.0;
        result[2][0] = -Math.sin(x);
        result[2][1] = 0.0;
        result[2][2] = Math.cos(x);

        return result;
    },

    /**
     *
     * @param x double
     *
     * @returns Double[][]
     */
    buildRotationMatrix3: function(x)
    {
        x = Math.toRadians(x);
        var result = new Array(); //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = new Array();
        }

        result[0][0] = Math.cos(x);
        result[0][1] = -Math.sin(x);
        result[0][2] = 0.0;
        result[1][0] = Math.sin(x);
        result[1][1] = Math.cos(x);
        result[1][2] = 0.0;
        result[2][0] = 0.0;
        result[2][1] = 0.0;
        result[2][2] = 1.0;

        return result;
    },

    /**
     *
     * @param N int
     *
     * @returns Double[][]
     */
    ones: function(N)
    {
        var x = new Array(); //Double[N][N];

        var i = 0;
        var j = 0;

        for(i = 0; i < N; i++)
        {
           result[i] = new Array(N);
        }

        for (i = 0; i < N; i++)
        {
            for (j = 0; j < N; j++)
            {
                if (i != j)
                {
                    x[i][j] = 0.0;
                }
                else
                {
                    x[i][j] = 1.0;
                }
            }
        }

        return x;
    },

    /**
     *
     * @param N int
     *
     * @returns Double[][]
     */
    zeros: function(N)
    {
        var x = new Array(N); //Double[3][3];

        var i = 0;
        var j = 0;

        for(i = 0; i < N; i++)
        {
           result[i] = new Array(N);
        }

        for (i = 0; i < N; i++)
        {
            for (j = 0; j < N; j++)
            {
                x[i][j] = 0.0;
            }
        }

        return x;
    },

    /**
     *
     * @param M int
     * @param N int
     *
     * @returns Double[][]
     */
    zeros: function(M, N)
    {
        var x = new Array(M); //Double[M][N];

        var i = 0;
        var j = 0;

        for(i = 0; i < M; i++)
        {
           result[i] = new Array(N);
        }

        for (i = 0; i < M; i++)
        {
            for ( j = 0; j < N; j++)
            {
                x[i][j] = 0.0;
            }
        }

        return x;
    },

    /**
     *
     * @param x 1d array
     * @param y 2d array
     *
     * @returns Double[]
     */
    multiply1dBy2d: function(x, y)
    {
        var x1 = x.length;
        var y1 = y.length;
        var y2 = y[0].length;

        if (x1 != y1)
        {
            return null;
        }

        var returnVal = new Array(y2); //Double[y2];

        for (var i = 0; i < y2; i++)
        {
            var val = 0;

            for (var j = 0; j < x1; j++)
            {
                val = val + x[j] * y[j][i];
            }

            returnVal[i] = val;
        }

        return returnVal;
    },

    /**
     *
     * @param x 2d array
     * @param y 1d array
     *
     * @returns Double[]
     */
    multiply2dBy1d: function(x, y)
    {
        //where x is MxN and Y is Nx1
        var M_x1 = x.length;
        var N_x2 = x[0].length;
        var N_y1 = y.length;

        if (N_x2 != N_y1)
        {
            return null;
        }

        var returnVal = new Array(M_x1); //Double[M_x1];

        for (var i = 0; i < M_x1; i++)
        {
            var val = 0;

            for (var j = 0; j < N_y1; j++)
            {
                val = val + x[i][j] * y[j];
            }

            returnVal[i] = val;
        }

        return returnVal;
    },

    /**
     *
     * @param h double
     * @param x 2d array
     *
     * @returns Double[][]
     */
    multiplyDoubleBy2d: function(h, x)
    {
        var M = x.length;
        var N = x[0].length;
        var hTimesX = new Array(M); //Double[M][N];

        var i = 0;
        var j = 0;

        for(i = 0; i < M; i++)
        {
           hTimesX[i] = new Array(N);
        }

        for (i = 0; i < M; i++)
        {
            for (j = 0; j < N; j++)
            {
                if (x[i][j] == 0)
                {
                    hTimesX[i][j] = 0.0;
                }
                else
                {
                    hTimesX[i][j] = h * x[i][j];
                }
            }
        }

        return hTimesX;
    },

    /**
     *
     * @param x Double[][]
     * @param y Double[][]
     *
     * @returns Double[][] 
     */
    multiply2dBy2d: function(x, y)
    {
        var x1 = x.length;
        var x2 = x[0].length;
        var y1 = y.length;
        var y2 = y[0].length;

        if (x2 != y1)
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[3][3];

        var i = 0;
        var j = 0;

        for(i = 0; i < x1; i++)
        {
           result[i] = new Array(y2);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {
            //each column of the target matrix
            for (j = 0; j < y2; j++)
            {
                var val = 0;
                var k = 0;

                //the components of the target cell
                for (k = 0; k < y1; k++)
                {
                    val = val + x[i][k] * y[k][j];
                }

                returnVal[i][j] = val;
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[][]
     *
     * @returns Double[][]
     */
    transposeMatrix: function(x)
    {
        var x1 = x.length;
        var x2 = x[0].length;

        var returnVal = new Array(x2); //Double[x2][x1];

        var i = 0;
        var j = 0;

        for(i = 0; i < x2; i++)
        {
           returnVal[i] = new Array(x1);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {  
            //each column of the target matrix
            for (j = 0; j < x2; j++)
            { 
                returnVal[j][i] = x[i][j];
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns Double[]
     */
    add1dTo1d: function(x, y)
    {
        var x1 = x.length;
        var y1 = y.length;

        if (x1 != y1)
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1];
        var i = 0;

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {  
            returnVal[i] = x[i] + y[i];
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[][]
     * @param y Double[][]
     *
     *
     * @returns Double[][]
     */
    add2dTo2d: function(x, y)
    {
        var x1 = x.length;
        var x2 = x[0].length;
        var y1 = y.length;
        var y2 = y[0].length;

        if ((x1 != y1) || (x2 != y2))
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1][x2];
        var i = 0;
        var j = 0;

        for(i = 0; i < x1; i++)
        {
           returnVal[i] = new Array(x2);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {
            //each column of the target matrix
            for (j = 0; j < x2; j++)
            { 
                returnVal[i][j] = x[i][j] + y[i][j];
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[][]
     * @param y Double[][]
     *
     * @returns Double[][]
     */
    subtract2dMinus2d: function(x, y)
    {
        var x1 = x.length;
        var x2 = x[0].length;
        var y1 = y.length;
        var y2 = y[0].length;

        if ((x1 != y1) || (x2 != y2))
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1][x2];
        var i = 0;
        var j = 0;

        for(i = 0; i < x1; i++)
        {
           returnVal[i] = new Array(x2);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {
            //each column of the target matrix
            for (j = 0; j < x2; j++)
            { 
                returnVal[i][j] = x[i][j] - y[i][j];
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns Double[]
     */
    subtract1dMinus1d: function(x, y)
    {
        var x1 = x.length;
        var y1 = y.length;

        if (x1 != y1)
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1];
        var i = 0;

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {  
            returnVal[i] = x[i] - y[i];
        }

        return returnVal;
    }
}
function Quaternion() {

    this.w = xVal ? xVal : 0.0,
    this.x = xVal ? xVal : 0.0,
    this.y = yVal ? yVal : 0.0,
    this.z = zVal ? zVal : 0.0,
    this.q = new Array(4)

    /**
     *
     */
    this.updateQ = function()
    {
        this.q[0] = this.w;
        this.q[1] = this.x;
        this.q[2] = this.y;
        this.q[3] = this.z;
    }

    /**
     *
     * @returns
     */
    this.getQ = function()
    {
        return q;
    }

    /**
     *
     * @param q Double[]
     */
    this.setQ = function(q)
    {
        this.w = q[0];
        this.x = q[1];
        this.y = q[2];
        this.z = q[3];
        this.q = q;
    }

    /**
     *
     *
     * @returns double
     */
    this.getW = function()
    {
        return this.w;
    }

    /**
     *
     * @param newW double
     */
    this.setW = function(newW)
    {
        this.w = newW;
        updateQ();
    }

    /**
     *
     * @returns double
     */
    this.getX = function()
    {
        return this.x;
    }

    /**
     *
     * @param newX double
     */
    this.setX = function(newX)
    {
        this.x = newX;
        updateQ();
    }

    /**
     *
     * @returns double
     */
    this.getY = function()
    {
        return this.y;
    }

    /**
     *
     * @param newY double
     */
    this.setY = function(newY)
    {
        this.y = newY;
        updateQ();
    }

    /**
     *
     * @returns double
     */
    this.getZ = function()
    {
        return this.z;
    }

    /**
     *
     * @param newZ double
     */
    this.setZ = function(newZ)
    {
        this.z = newZ;
        updateQ();
    }

    /**
     *
     * @returns boolean
     */
    this.isZero = function()
    {
        var allZeros = true;
        var i = 0;

        for (i = 0; i < 4; i++)
        {
            if (this.q[i] != null)
            {
                if (this.q[i] != 0)
                {
                    allZeros = false;
                    break;
                }
            }
        }

        return allZeros;
    }
}var QuaternionMath = {

    /**
     *
     * @param q1 Quaternion
     * @param q2 Quaternion
     *
     * @returns Quaternion
     */
    multiplyQuaternions: function(q1, q2)
    {
        //multiplies q1 by q2;
        if (q1.isZero())
        {
            return q2;
        }
        else if (q2.isZero())
        {
            return q1;
        }
        else
        {
            var w1 = q1.getW(); //double
            var x1 = q1.getX(); //double
            var y1 = q1.getY(); //double
            var z1 = q1.getZ(); //double
            var w2 = q2.getW(); //double
            var x2 = q2.getX(); //double
            var y2 = q2.getY(); //double
            var z2 = q2.getZ(); //double

            //now that each quaternion has an axis of rotation that is a unit vector, multiply the two:
            var quaternionProduct = new Quaternion();
            quaternionProduct.setW(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2);
            quaternionProduct.setX(w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2);
            quaternionProduct.setY(w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2);
            quaternionProduct.setZ(w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2);

            return quaternionProduct;
        }
    },

    /**
     *
     * @param qRotation Quaternion
     * @param inputVector Double[]
     *
     * @returns Double[]
     */
    applyQuaternionRotation: function(qRotation, inputVector)
    {
        //applies qRotation q1 to the vector inputVector (3x1)
        var q0 = qRotation.getW(); //double
        var q1 = qRotation.getX(); //double
        var q2 = qRotation.getY(); //double
        var q3 = qRotation.getZ(); //double

        var A = new Array(3); //Double[3][3];
        var i = 0;
        for(i = 0; i < 3; i++)
        {
            A[i] = new Array(3);
        }

        A[0][0] = 2*q0*q0-1+2*q1*q1;
        A[0][1] = 2*q1*q2+2*q0*q3;
        A[0][2] = 2*q1*q3-2*q0*q2;
        A[1][0] = 2*q1*q2-2*q0*q3;
        A[1][1] = 2*q0*q0-1+2*q2*q2;
        A[1][2] = 2*q2*q3+2*q0*q1;
        A[2][0] = 2*q1*q3+2*q0*q2;
        A[2][1] = 2*q2*q3-2*q0*q1;
        A[2][2] = 2*q0*q0-1+2*q3*q3;

        var matrixProduct = MathTools.multiply(A, inputVector);

        return matrixProduct;
    },

    /**
     *
     * @param q Quaternion
     *
     * @returns Double[]
     */
    getEulerAngles: function(q)
    {
        //------DETERMINING THE EQUIVALENT EULER ROTATION ANGLES------
        //translate the net (final) quaternion back to euler angles
        var q0 = q.getW(); //double
        var q1 = q.getX(); //double
        var q2 = q.getY(); //double
        var q3 = q.getZ(); //double

        var phi = Math.atan2((2 * (q0 * q1 + q2 * q3)),
            (1 - 2 * (q1 * q1 + q2 * q2)));   //rad  (rotation about the x-axis)
        var theta = Math.asin(2 * (q0 * q2 - q3 * q1)); //rad  (rotation about the y-axis)
        var gamma = Math.atan2((2 * (q0 * q3 + q1 * q2)),
            (1 - 2 * (q2 * q2 + q3 * q3))); //rad  (rotation about the z-axis)

        //equivalentRotationMatrix=Rot3(gamma*180/pi)*Rot2(theta*180/pi)*Rot1(phi*180/pi);
        var EulerAngles = new Array(3); //Double[3];
        EulerAngles[0] = Math.toDegrees(phi);     //deg  (rotation about the x-axis)
        EulerAngles[1] = Math.toDegrees(theta);   //deg  (rotation about the y-axis)
        EulerAngles[2] = Math.toDegrees(gamma);   //deg  (rotation about the z-axis)

        //remember, the equivalentRotationMatrix=Rot3(gamma*180/pi)*Rot2(theta*180/pi)*Rot1(phi*180/pi);
        return EulerAngles;
    },

    /**
     *
     * @param m Double[][]
     *
     * @returns Quaternion
     */
    convertRotationMatrixToQuaternion: function(m)
    {
        //converts a 3x3 rotation matrix to an equivalent quaternion
        var q = new Quaternion();
        var m11 = m[0][0]; //double
        var m12 = m[0][1]; //double
        var m13 = m[0][2]; //double
        var m21 = m[1][0]; //double
        var m22 = m[1][1]; //double
        var m23 = m[1][2]; //double
        var m31 = m[2][0]; //double
        var m32 = m[2][1]; //double
        var m33 = m[2][2]; //double

        q.setW(0.5 * Math.sqrt(m11+m22+m33+1));
        q.setX((m23 - m32) / (4 * q.getW()));
        q.setY((m31 - m13) / (4 * q.getW()));
        q.setZ((m12 - m21) / (4 * q.getW()));

        return q;
    }
}
function RSWCoordinates() {
 
    // define variables as <var name>: <value>

    radial =     0.0, //radial vector (km)
    alongTrack = 0.0, //along track vector (km)
    crossTrack = 0.0  //cross track vector (km)
};var SimulationObject = {

    // define variables as <var name>: value

    name:         "",
    eciCoords:    ECICoordinates,
    ecefCoords:   ECEFCoordinates,
    keplerCoords: KeplerianCoordinates,
    llaCoords:    LLACoordinates,
    sensorList:   new Array(),

    /**
     * Returns the Ecef Coordinates of this object.
     */
    getEcefCoordinates: function()
    {
        return ecefCoords;
    },

    /**
     * Sets the Ecef Coordinates of this object.
     */
    setEcefCoordinates: function(newEcefCoords)
    {
        ecefCoords = newEcefCoords;
    },

    /**
     * Returns the Eci Coordinates of this object.
     */
    getEciCoordinates: function()
    {
        return eciCoords;
    },

    /**
     * Sets the Eci Coordinates of this object.
     */
    setEciCoordinates: function(newEciCoords)
    {
        eciCoords = newEciCoords;
    },

    /**
     * Returns the Keplerian Coordinates of this object.
     */
    getKeplerianCoordinates: function()
    {
        return keplerCoords;
    },

    /**
     * Sets the Keplerian Coordinates of this object.
     */
    setKeplerianCoordinates: function(newKeplerCoords)
    {
        kepler = newKeplerCoords;
    },

    /**
     *  Returns the Lla Coordinates of this object.
     */
    getLlaCoordinates: function()
    {
        return llaCoords;
    },

    /**
     * Sets the Lla Coordinates of this object.
     */
    setLlaCoordinates: function(newLlaCoords)
    {
        lla = newLlaCoords;
    },

    /**
     * Returns the name of this object.
     */
    getName: function()
    {
        return name;
    },

    /**
     * Sets the name of this object.
     */
    setName: function(name)
    {
        this.name = name;
    },

    /**
     * Returns the Sesnors for this object.
     */
    getSensors: function()
    {
        return sensors;
    },

    /**
     * Sets the sensors for this object.
     */
    setSensors: function(newSensorList)
    {
        sensorList = newSensorList;
    },

    /**
     * Propagates the state of a Simulation object.
     *
     * @param timeToPropagate          double
     * @param dt                       double
     * @param timeAtStartOfPropagation date
     */
    propagateState: function(timeToPropagate, dt, timeAtStartOfPropagation)
    {
        eciCoords = OrbitPropagator.propagateOrbit(eci, timeToPropagate,dt, timeAtStartOfPropagation);
        keplerCoords = CoordinateConversionTools.convertECIToKeplerian(eci);

        //calculate the greenwich hour angle from the current time plus the elapsed time 'dt'
        var newMilliseconds = (timeAtStartOfPropagation.getTime() +
            (timeToPropagate * 1000.0));         //long
        var simTime = new Date(newMilliseconds); //Date
        var GST = CoordinateConversionTools.convertTimeToGMST(simTime); //double

        //calculate the ECEF and LLA coordinates based upon the new ECI coordinates
        ecefCoords = CoordinateConversionTools.convertECItoECEF(eci, GST);
        llaCoords = CoordinateConversionTools.convertECItoLLA(eci, GST);
    }
}
var SSI = SSI || {};

SSI.Universe = function(options, container) {
    var controller = new SSI.UniverseController({});
    var core = new SSI.Core3D(container);
    var objectLibrary = new SSI.ObjectLibrary();

    // options

    var currentUniverseTime = options.currentUniverseTime;
    var playbackSpeed = 1;

    // function to call when we have a new state object
    var stateChangedCallback = function() {
    };

    // milliseconds between updating our state object that we broadcast
    // to any listeners
    var timeBetweenStateUpdatesMs = 1000;

    // timeout for updating state
    var updateStateTimeout;

    var universe = this;

    // OBJECT LIBRARY DEFAULTS
    
    objectLibrary.setObject("default_geometry", new THREE.Geometry());
    objectLibrary.setObject("default_material", new THREE.MeshFaceMaterial());

    // PRIVATE METHODS
    
    // fires a state changed event to the callback
    function fireStateChanged(state) {
        if(stateChangedCallback != null) {
            stateChangedCallback(state);
        }
    }

    function addSimStateObject() {
        controller.addGraphicsObject({
            id : "simState",
            objectName : "simState",
            update : function(elapsedTime) {
                currentUniverseTime.setTime(currentUniverseTime.getTime() + playbackSpeed * elapsedTime);
            },
            draw : function() {
            }
        });
    }


    function updateState() {
        //create our state object and notify our listener
        var universe = this;
        var state = {};
        state.currentUniverseTime = new Date(currentUniverseTime);

        fireStateChanged(state);

        // call update() again in a certain number of milliseconds
        updateStateTimeout = setTimeout(function() {
            updateState();
        }, timeBetweenStateUpdatesMs);
    }
    
    // PROTECTED METHODS (API METHODS)
    
    // play the universe
    this.play = function(options) {
        currentUniverseTime = new Date(options.startTime);
        playbackSpeed = options.playbackSpeed;
        stateChangedCallback = options.stateChangedCallback;
        logger.debug("Universe.play() called with time [" + currentUniverseTime + "], speed: [" + playbackSpeed + "]");

        // update state our first time
        updateState();

        controller.play();
    };
    // pause the universe
    this.pause = function() {
        clearTimeout(updateStateTimeout);
        controller.pause();
    };
    this.setPlaybackSpeed = function(speed) {
        playbackSpeed = speed;
    }

    this.setCurrentUniverseTime = function(newUniverseTime) {
        currentUniverseTime = new Date(newUniverseTime);
        controller.updateOnce();
    }

    this.getCurrentUniverseTime = function() {
        return currentUniverseTime;
    }

    
    // adds a geometry to the universe with an ID and url to retrieve
    // the model's geometry
    this.addJsonGeometryModel = function(modelId, modelUrl, callback) {
        logger.debug("Adding mesh model to universe; id: [" + modelId + "] url: [" + modelUrl + "]");
        if (modelId != undefined){
            objectLibrary.addGeometryObjectFromUrl(modelId, modelUrl, callback);
        } else {
            callback();
        }
    };


	// object
	// id,
	// objectName,
	// update : function(elapsedTime),
	// draw : function()
	this.addObject = function(object) {
		controller.addGraphicsObject(object);
	}
	
	// Draws an object with Id and mesh
	// if isScale is true the object will always appear the same size as its
	// size will be scaled based on distance from camera
	this.draw = function(id, mesh, isScale) {
		core.draw(id, mesh, isScale);
	}
	
	this.unDraw = function(id) {
		core.removeObject(id);
	}
	
	this.setObjectInLibrary = function(id, object) {
		objectLibrary.setObject(id, object);
	}
	
	this.getObjectFromLibraryById = function(id, callback) {
		objectLibrary.getObjectById(id, callback);
	}

    this.removeObject = function(id) {
        controller.removeGraphicsObject(id);
        core.removeObject(id);
    }

    this.snapToObject = function(id) {
        // get the object's position and copy it into a vector
        var position = core.getObjectPosition(id);
        if(position != undefined) {
            var vector = new THREE.Vector3();
            vector.copy(position);
    
            // move the point the camera will be at out a bit so we are behind the object
            vector.multiplyScalar(1.4);
    
            // tell the core to move to the vector
            core.moveCameraTo(vector);
        }
        else {
            logger.debug(id + " not added to the core")
        }
    }

    this.removeAll = function() {
        core.removeAllObjects();
        controller.removeAllGraphicsObjects();
    }
    
    this.getGraphicsObjects = function() {
        return controller.getGraphicsObjects();
    }

    this.updateObject = function(id, propertyName, propertyValue) {
        // TODO: Implement or delete
    }

	this.showObject = function(id, isEnabled) {
		core.showObject(id, isEnabled);
	}

    this.setup = function() {
        addSimStateObject();
    }

    this.setup();
};
