
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

                objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( 0, Math.PI, 0 ) ));
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
        var location_vector = new THREE.Vector3(location.x, location.y, location.z);

        // move the vector to the surface of the earth
        location_vector.multiplyScalar(earthSphereRadius / location_vector.length())
        
        return findClosestObject(location_vector);
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
