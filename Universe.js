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

    controller.addGraphicsObject({
        id : "simState",
        objectName : "simState",
        update : function(elapsedTime) {
            currentUniverseTime.setTime(currentUniverseTime.getTime() + playbackSpeed * elapsedTime);
        },
        draw : function() {
        }
    });
    
    objectLibrary.setObject("default_material", new THREE.MeshFaceMaterial());
    objectLibrary.setObject("default_ground_object_geometry", new THREE.SphereGeometry(300, 20, 10));
    objectLibrary.setObject("default_ground_object_material", new THREE.MeshLambertMaterial({color : 0xCC0000}));

    // fires a state changed event to the callback
    function fireStateChanged(state) {
        if(stateChangedCallback != null) {
            stateChangedCallback(state);
        }
    }


    this.updateState = function() {
        // create our state object and notify our listener
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
                var rotationAngle = convertTimeToGMST(currentUniverseTime);
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
        var objectGeometry = objectLibrary.getObjectById(spaceObject.modelId);
        var material = objectLibrary.getObjectById("default_material");
        console.log("creating mesh");
        var objectModel = new THREE.Mesh(objectGeometry, material);

        controller.addGraphicsObject({
            id : spaceObject.id,
            objectName : spaceObject.objectName,
            update : function(elapsedTime) {
                // need to pass a time to the propagator
                spaceObject.propagator(null, function(location) {
                    var convertedLocation = eciTo3DCoordinates(location);
                    objectModel.position.set(convertedLocation.x, convertedLocation.y, convertedLocation.z);
                });
            },
            draw : function() {
                core.draw(this.id, objectModel, true);
            }
        });

        if(spaceObject.showPropogationLine == true) {
            logger.debug("show propogation line");
            this.addPropogationLineForObject(spaceObject);
        }

        if(spaceObject.showGroundTrackPoint) {
            this.addGroundTrackPointForObject(spaceObject);
        }

        // TODO: enamble a real toggle button for this .showSensorPattern
        if (true) {
            this.addSensorProjection(spaceObject);
        }

    };
    // groundObject:
    // id
    // propagator
    // object
    this.addGroundObject = function(groundObject) {
        

        var groundObjectMesh = new THREE.Mesh(objectLibrary.getObjectById("default_ground_object_geometry"), objectLibrary.getObjectById("default_ground_object_material"));

        controller.addGraphicsObject({
            id : groundObject.id,
            objectName : groundObject.objectName,
            update : function(elapsedTime) {
                // check earth rotation and update location
                var position = eciTo3DCoordinates(groundObject.propagator());
                groundObjectMesh.position.set(position.x, position.y, position.z);
            },
            draw : function() {
                core.draw(this.id, groundObjectMesh, true);
            }
        });
    };
    // method to add an orbit line
    this.addPropogationLineForObject = function(object) {
        var geometry = new THREE.Geometry();

        var timeToPropogate = new Date(currentUniverseTime);
        var loopCount = 1440;
        
        if ("4ec96588246fc15d9a000002" == object.id) {
            loopCount = 35000;
        }
        // draw a vertex for each minute in a 24 hour period
        for(var j = 0; j < loopCount; j++) {
            object.propagator(timeToPropogate, function(location) {
                var convertedLocation = eciTo3DCoordinates(location);
                var vector = new THREE.Vector3(convertedLocation.x, convertedLocation.y, convertedLocation.z);
                geometry.vertices.push(new THREE.Vertex(vector));
            });

            timeToPropogate.setMinutes(timeToPropogate.getMinutes() + 1);
        }
        var lineS = new THREE.Line(geometry, new THREE.LineBasicMaterial({
            color : 0x990000,
            opacity : 1
        }));

        controller.addGraphicsObject({
            id : object.id + "_propogation",
            objectName : object.objectName,
            update : function(elapsedTime) {
            // add points onto the end of the track?
            },
            draw : function() {
                core.draw(this.id, lineS, false);
            }
        })
    }

    this.addGroundTrackPointForObject = function(object) {
        var geometry = new THREE.SphereGeometry(300, 20, 10);

        var sphereMaterial = new THREE.MeshLambertMaterial({
            color : 0xCC0000
        });

        var groundObjectMesh = new THREE.Mesh(geometry, sphereMaterial);

        controller.addGraphicsObject({
            id : object.id + "_groundPoint",
            objectName : object.objectName,
            update : function(elapsedTime) {
                object.propagator(undefined, function(location) {
                    var objectLocation = eciTo3DCoordinates(location);

                    var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);
    
                    // move the vector to the surface of the earth
                    vector.multiplyScalar(earthSphereRadius / vector.length())
    
                    groundObjectMesh.position.copy(vector);
                });
            },
            draw : function() {
                core.draw(this.id, groundObjectMesh, true);
            }
        })
    }

    // TODO: This really needs to be refactored into the Sensor code, but that seems kind
    // of disfunctional right now....so I've got this instead
    this.addSensorProjection = function(object) {
        object.propagator(undefined, function(location) {
            // Determine the object's location in 3D space
            var objectLocation = eciTo3DCoordinates(location);
    
            // Now convert that to a Vector3 to use its mathy functions
            var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);
            
            // Create a SensorPattern that's the length of the vector to the object 
            // (i.e. the length to the center of the earth)
            var geometry = new SensorPatternGeometry(1500, vector.length()*(2/3));
    
            var material = new THREE.MeshLambertMaterial({
                color : 0xffff00, 
                opacity: 0.1,
                overdraw: true
            });
    
            var sensorProjection = new THREE.Mesh(geometry, material);
            sensorProjection.doubleSided=true;
            
    
            controller.addGraphicsObject({
                id : object.id + "_sensorProjection",
                objectName : object.objectName,
                update : function(elapsedTime) {
                    object.propagator(undefined, function(location) {
                        var objectLocation = eciTo3DCoordinates(location);
                        var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);
        
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
        
                        sensorProjection.position.copy(vector);
                    });
                },
                draw : function() {
                    core.draw(this.id, sensorProjection, true);
                }
            });
        });
        
    }

    this.showOrbitLines = function() {
        logger.debug("in show orbit lines");
        if (isShowOrbitLines) {
            logger.debug("hidding all orbit lines");
            core.hideObject("4ec0491c246fc143ae000005_propogation");
            core.hideObject("4ec0491c246fc143ae000008_propogation");
            core.hideObject("4ec0491c246fc143ae000002_propogation");
            isShowOrbitLines = false;
        } else {
            logger.debug("showing all orbit lines");
            core.showObject("4ec0491c246fc143ae000005_propogation");
            core.showObject("4ec0491c246fc143ae000008_propogation");
            core.showObject("4ec0491c246fc143ae000002_propogation");
            isShowOrbitLines = true;
        }
    }
    
    this.showVehicles = function() {
        logger.debug("in show vehicles");
        if (isShowVehicles) {
            logger.debug("hidding all vehicles");
            core.hideObject("4ec0491c246fc143ae000005");
            core.hideObject("4ec0491c246fc143ae000008");
            core.hideObject("4ec0491c246fc143ae000002");
            isShowVehicles = false;
        } else {
            logger.debug("showing all vehicles");
            core.showObject("4ec0491c246fc143ae000005");
            core.showObject("4ec0491c246fc143ae000008");
            core.showObject("4ec0491c246fc143ae000002");
            isShowVehicles = true;
        }   
    }
    
    this.showGroundTracks = function() {
        logger.debug("in show ground tracks");
        if (isShowGround) {
            logger.debug("hidding all ground tracks");
            core.hideObject("4ec0491c246fc143ae000005_groundPoint");
            core.hideObject("4ec0491c246fc143ae000008_groundPoint");
            core.hideObject("4ec0491c246fc143ae000002_groundPoint");
            isShowGround = false;
        } else {
            logger.debug("showing all ground tracks");
            core.showObject("4ec0491c246fc143ae000005_groundPoint");
            core.showObject("4ec0491c246fc143ae000008_groundPoint");
            core.showObject("4ec0491c246fc143ae000002_groundPoint");
            isShowGround = true;
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


    this.getCurrentUniverseTime = function() {
        return currentUniverseTime;
    }
};

SSI.Universe.prototype.goToTime = function(time) {
    };
// TODO refactor these to wherever Josh puts the common math libs
function convertCurrentEpochToJulianDate(time) {
    var JD = 0;
    var year = time.getFullYear();
    var month = time.getUTCMonth();
    var day = time.getUTCDate();
    var hour = time.getUTCHours();
    var minute = time.getUTCMinutes();
    var second = time.getUTCSeconds();
    JD = 367 * year - (7 * (year + ((month + 9) / 12)) / 4) + (275 * month / 9) + (day) + 1721013.5 + ((second / 60 + minute) / 60 + hour) / 24;
    return JD;
}

function convertTimeToGMST(time) {
    var JD = convertCurrentEpochToJulianDate(time);

    var TUT = (JD - 2451545.0) / 36525.0;
    //julian centuries since January 1, 2000 12h UT1
    var GMST = 67310.54841 + (876600.0 * 3600 + 8640184.812866) * TUT + 0.093104 * TUT * TUT - (0.0000062) * TUT * TUT * TUT;
    //this is in seconds

    var multiples = Math.floor(GMST / 86400.0);
    GMST = GMST - multiples * 86400.00;
    //reduce it to be within the range of one day

    GMST = GMST / 240.0;
    //convert to degrees
    if(GMST < 0) {
        GMST = GMST + 360;
    }
    return GMST;
//degrees
}