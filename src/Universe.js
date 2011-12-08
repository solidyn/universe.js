
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
