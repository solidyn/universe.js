var SSI = SSI || {};

SSI.Universe = function(options, container) {
    var controller = new SSI.UniverseController({});
    var core = new SSI.Core3D(container);
    var objectLibrary = new SSI.ObjectLibrary();

    // constants
    var earthSphereRadius = 6371;

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
	
    var isShowOrbitLines = true;
    var isShowVehicles = true;
    var isShowGround = true;
    
    var universe = this;
    
    var earthCenterPoint = new THREE.Vector3(0,0,0);

    controller.addGraphicsObject({
        id : "simState",
        objectName : "simState",
        update : function(elapsedTime) {
            currentUniverseTime.setTime(currentUniverseTime.getTime() + playbackSpeed * elapsedTime);
        },
        draw : function() {
        }
    });
    
    objectLibrary.setObject("default_geometry", new THREE.Geometry());
    objectLibrary.setObject("default_material", new THREE.MeshFaceMaterial());
    objectLibrary.setObject("default_ground_object_geometry", new THREE.SphereGeometry(300, 20, 10));
    objectLibrary.setObject("default_ground_object_material", new THREE.MeshLambertMaterial());
    objectLibrary.setObject("default_ground_track_material", new THREE.MeshLambertMaterial({color : 0xCC0000}));
    objectLibrary.setObject("default_sensor_projection_material",new THREE.MeshLambertMaterial({
                color : 0xDF0101, 
                opacity: 0.5,
                overdraw: true
            }));
    objectLibrary.setObject("default_orbit_line_material", new THREE.LineBasicMaterial({
                color : 0x990000,
                opacity : 1
            }));

    // fires a state changed event to the callback
    function fireStateChanged(state) {
        if(stateChangedCallback != null) {
            stateChangedCallback(state);
        }
    }


    this.updateState = function() {
        //create our state object and notify our listener
        var universe = this;
        var state = {};
        state.currentUniverseTime = new Date(currentUniverseTime);

        fireStateChanged(state);

        // call update() again in a certain number of milliseconds
        updateStateTimeout = setTimeout(function() {
            universe.updateState();
        }, timeBetweenStateUpdatesMs);
    }
    // play the universe
    this.play = function(options) {
        currentUniverseTime = new Date(options.startTime);
        playbackSpeed = options.playbackSpeed;
        stateChangedCallback = options.stateChangedCallback;
        logger.debug("Universe.play() called with time [" + currentUniverseTime + "], speed: [" + playbackSpeed + "]");

        // update state our first time
        this.updateState();

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

        controller.addGraphicsObject({
            id : "earth",
            objectName : "earth",
            update : function(elapsedTime) {
                // TODO: retrieve earth rotation at a time and change rotation
                var rotationAngle = CoordinateConversionTools.convertTimeToGMST(currentUniverseTime);
                earthMesh.rotation.y = rotationAngle * (2 * Math.PI / 360);
            },
            draw : function() {
                core.draw(this.id, earthMesh, false);
            }
        });
    };
    // adds a model to the universe with an ID and url to retrieve
    // the model's geometry
    this.addJsonGeometryModel = function(modelId, modelUrl, callback) {
        logger.debug("Adding mesh model to universe; id: [" + modelId + "] url: [" + modelUrl + "]");
        if (modelId != undefined){
            objectLibrary.addGeometryObjectFromUrl(modelId, modelUrl, callback);
        } else {
            callback();
        }
    };

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
        objectLibrary.getObjectById(spaceObject.modelId, function(retrieved_geometry) {
            objectGeometry = retrieved_geometry;
            objectLibrary.getObjectById("default_material", function(retrieved_material) {
                material = retrieved_material;
                
                objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( 0, Math.PI, 0 ) ));
                var objectModel = new THREE.Mesh(objectGeometry, material);
        
                controller.addGraphicsObject({
                    id : spaceObject.id,
                    objectName : spaceObject.objectName,
                    update : function(elapsedTime) {
                        // need to pass a time to the propagator
                        var convertedLocation = eciTo3DCoordinates(spaceObject.propagator(), true);
                        objectModel.position.set(convertedLocation.x, convertedLocation.y, convertedLocation.z);
                        
                        //http://mrdoob.github.com/three.js/examples/misc_lookat.html
                        objectModel.lookAt(earthCenterPoint);
                    },
                    draw : function() {
                        core.draw(this.id, objectModel, false);
                    }
                });
                universe.addPropogationLineForObject(spaceObject);
                universe.showOrbitLineForObject(spaceObject.showPropogationLine, spaceObject._id)
 
                universe.addGroundTrackPointForObject(spaceObject);
                universe.showGroundTrackForId(spaceObject.showGroundTrackPoint, spaceObject._id)
                universe.addSensorProjection(spaceObject);
                
        
                // TODO: enamble a real toggle button for this .showSensorPattern
                // if (spaceObject.showSensorProjections) {
                    // universe.addSensorProjection(spaceObject);
                // }
            });
        });
    };
    // groundObject:
    // id
    // propagator
    // object
    this.addGroundObject = function(groundObject) {
        var objectGeometry, objectMaterial;
        if(!groundObject.modelId) {
            groundObject.modelId = "default_ground_object_geometry";
        }
        objectLibrary.getObjectById(groundObject.modelId, function(retrieved_geometry) {
            objectGeometry = retrieved_geometry;
            objectLibrary.getObjectById("default_material", function(retrieved_material) {
                objectMaterial = retrieved_material;
                objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( Math.PI / 2, Math.PI, 0 ) ));
                var groundObjectMesh = new THREE.Mesh(objectGeometry, objectMaterial);
                
                controller.addGraphicsObject({
                    id : groundObject.id,
                    objectName : groundObject.objectName,
                    update : function(elapsedTime) {
                        // check earth rotation and update location
                        var position = eciTo3DCoordinates(groundObject.propagator());
                        groundObjectMesh.position.set(position.x, position.y, position.z);

                        //http://mrdoob.github.com/three.js/examples/misc_lookat.html
                        var scaled_position_vector = new THREE.Vector3(position.x, position.y, position.z);
                        
                        // arbitrary size, just a point along the position vector further out for the object to lookAt
                        scaled_position_vector.multiplyScalar(1.4);
                        
                        groundObjectMesh.lookAt(scaled_position_vector);
                    },
                    draw : function() {
                        core.draw(this.id, groundObjectMesh, true);
                    }
                });
            });
        });
    };
    // method to add an orbit line
    this.addPropogationLineForObject = function(object) {
        var objectGeometry, objectMaterial;
        objectGeometry = new THREE.Geometry();
        objectLibrary.getObjectById("default_orbit_line_material", function(retrieved_material) {
            objectMaterial = retrieved_material;
            var timeToPropogate = new Date(currentUniverseTime);
            var loopCount = 1440;
            
            // draw a vertex for each minute in a 24 hour period
            for(var j = 0; j < loopCount; j++) {
                var convertedLocation = eciTo3DCoordinates(object.propagator(timeToPropogate, false));
                var vector = new THREE.Vector3(convertedLocation.x, convertedLocation.y, convertedLocation.z);
                objectGeometry.vertices.push(new THREE.Vertex(vector));
    
                timeToPropogate.setMinutes(timeToPropogate.getMinutes() + 1);
            }
            
            var lineS = new THREE.Line(objectGeometry, objectMaterial);
    
            controller.addGraphicsObject({
                id : object.id + "_propogation",
                objectName : object.objectName,
                update : function(elapsedTime) {
                // add points onto the end of the track?
                },
                draw : function() {
                    core.draw(this.id, lineS, false);
                }
            });
        });
    }

    this.addGroundTrackPointForObject = function(object) {
        var objectGeometry, objectMaterial;
        objectLibrary.getObjectById("default_ground_object_geometry", function(retrieved_geometry) {
            objectGeometry = retrieved_geometry;
            objectLibrary.getObjectById("default_ground_track_material", function(retrieved_material) {
                objectMaterial = retrieved_material;
        

                var groundObjectMesh = new THREE.Mesh(objectGeometry, objectMaterial);
        
                controller.addGraphicsObject({
                    id : object.id + "_groundPoint",
                    objectName : object.objectName,
                    update : function(elapsedTime) {
                        var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));
        
                        var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);
        
                        // move the vector to the surface of the earth
                        vector.multiplyScalar(earthSphereRadius / vector.length())
        
                        groundObjectMesh.position.copy(vector);
                    },
                    draw : function() {
                        core.draw(this.id, groundObjectMesh, true);
                    }
                });
            });
        });
    }

    // TODO: This really needs to be refactored into the Sensor code, but that seems kind
    // of disfunctional right now....so I've got this instead
    this.addSensorProjection = function(object) {
        
            var objectGeometry, objectMaterial;
            
            // Determine the object's location in 3D space
            var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));
    
            // Now convert that to a Vector3 to use its mathy functions
            var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);
            
            // Create a SensorPattern that's the length of the vector to the object 
            // (i.e. the length to the center of the earth)
            objectGeometry = new SensorPatternGeometry(1500, vector.length());
    
            objectLibrary.getObjectById("default_sensor_projection_material", function(retrieved_material) {
                objectMaterial = retrieved_material;

                // Apply a matrix to the shape to allow us to call .lookAt() to set the boresite.
                objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( -1 * Math.PI/2 , 0, 0 ) ));

                var sensorProjection = new THREE.Mesh(objectGeometry, objectMaterial);
                sensorProjection.doubleSided=true;
        
                controller.addGraphicsObject({
                    id : object.id + "_sensorProjection",
                    objectName : object.objectName,
                    update : function(elapsedTime) {
                        
                        var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));
                        var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);

                        // Move the tip of the sensor projection to the vehicle's location
                        sensorProjection.position.copy(vector);

                        var sensor_boresite = new THREE.Vector3(0,0,0);

                        sensorProjection.lookAt(sensor_boresite);

                       /*
                        // Rotate the beam so it points to the center of the earth
                        // TODO: this will have to be corrected with its actual look angles
        
                       var zRotationAngle = Math.asin(vector.x / (vector.length()));
                       var xRotationAngle = Math.asin(vector.z / (vector.length()));
        
                        // The equation above neglects which quadrant the angle is.  If y is negative, you need to subtract the angle
                        // from 180 deg
                        if ( vector.y < 0 )
                        {
                            xRotationAngle = Math.PI - xRotationAngle;
                        }
        
                        //var zRotationAngle = Math.asin(vector.z / (vector.length()));
                        // no need to rotate along y; that's down the center of the cone
                        //logger.debug("xRotation: "+xRotationAngle + "  x:" + vector.x + "  y:" + vector.y + "  z:" + vector.z);
        
                        sensorProjection.rotation.x = xRotationAngle;
                        sensorProjection.rotation.z = -zRotationAngle;

                        */
                        
                    },
                    draw : function() {
                        core.draw(this.id, sensorProjection, false);
                    }
                });
            });
        
    }

    this.showOrbitLineForObject = function(isEnabled, id) {
        logger.debug("in show orbit lines");
        if (!isEnabled) {
            core.hideObject(id + "_propogation");
        } else {
            core.showObject(id + "_propogation");
        }
    }
    
    this.showModelForId = function(isEnabled, id) {
        //console.log("show/hiding model");
        if (!isEnabled) {
            core.hideObject(id);
        } else {
            core.showObject(id);
        }   
    }
    
    this.showGroundTrackForId = function(isEnabled, id) {
        //console.log("show/hiding groundTrack");
        if (!isEnabled) {
            core.hideObject(id + "_groundPoint");
        } else {
            core.showObject(id + "_groundPoint");
        }   
    }
    
    this.snapToObject = function(id) {
        // get the object's position and copy it into a vector
        var position = core.getObjectPosition(id);
        var vector = new THREE.Vector3();
        vector.copy(position);
       
        // move the point the camera will be at out a bit so we are behind the object
        vector.multiplyScalar(1.4);
        
        // tell the core to move to the vector
        core.moveCameraTo(vector);
    }
    
    this.addGroundTrackForObject = function(object) {
    // This needs to be written to take into account earth rotation
    }
    // Compare these two websites for details on why we have to do this:
    // http://celestrak.com/columns/v02n01/
    // http://stackoverflow.com/questions/7935209/three-js-3d-coordinates-system
    function eciTo3DCoordinates(location) {
        return {
            x : -location.x,
            y : location.z,
            z : location.y
        };
    }
};
