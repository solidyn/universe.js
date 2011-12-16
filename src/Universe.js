/**
    @namespace Solidyn Solutions Inc. Namespace.
*/
var SSI = SSI || {};

/** 
	A simple Universe for drawing 3D modeling and simulation using WebGL
	@constructor
	@param {Object} options - currentUniverseTime, refreshRate
	@param {DOMElement} container - the container where the Universe will be drawn
 */
SSI.Universe = function(options, container) {
    var controller = new SSI.UniverseController(options);
    var core = new SSI.Core3D(container);
    var objectLibrary = new SSI.ObjectLibrary();

    // options

    var currentUniverseTime = options.currentUniverseTime;
    var playbackSpeed = 1;

    /**
		function to call when we have a new state object
		@private
	*/
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
    
    /**
		fires a state changed event to the callback
		@private
	*/
    function fireStateChanged(state) {
        if(stateChangedCallback != null) {
            stateChangedCallback(state);
        }
    }

	/**
		adds an object that updates the currentUniverseTime using the playback speed
		@private
	*/
    function addSimStateObject() {
        controller.addGraphicsObject({
            id : "simState",
            objectName : "simState",
            update : function(elapsedTime) {
				if(elapsedTime != null) {
					currentUniverseTime.setTime(currentUniverseTime.getTime() + playbackSpeed * elapsedTime);
				}
            },
            draw : function() {
            }
        });
    }

	/**
		gets called at our state update interfal and fires the state change callback
		@private
	*/
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
    
	/**
		Start playback for the universe
		@public
	    @param {string} options - playbackSpeed, startTime, stateChangedCallback
	 */
    this.play = function(options) {
		if(options.startTime != undefined) {
			currentUniverseTime = new Date(options.startTime);
		}
		if(options.playbackSpeed != undefined) {
			playbackSpeed = options.playbackSpeed;
		}
        
		if(options != undefined) {
			stateChangedCallback = options.stateChangedCallback;
		}
        
        // update state our first time
        updateState();

        controller.play();
    };

    /**
		Pause playback for the universe
		@public
	*/
    this.pause = function() {
        clearTimeout(updateStateTimeout);
        controller.pause();
    };

	/**
		Set the playback speed for the Universe
		@public
	    @param {Double} speed
	 */
    this.setPlaybackSpeed = function(speed) {
        playbackSpeed = speed;
    }

	/**
		Set the current time of the Universe
		@public
	    @param {Date} newUniverseTime
	 */
    this.setCurrentUniverseTime = function(newUniverseTime) {
        currentUniverseTime = new Date(newUniverseTime);
        controller.updateOnce();
    }

	/**
		Get the current time of the Universe
		@public
	*/
    this.getCurrentUniverseTime = function() {
        return currentUniverseTime;
    }

    /**
    	Add a geometry to the universe with an ID and url to retrieve the model's geometry
		@public
		@param {string} modelId
		@param {string} modelUrl - URL for the THREE.js format geometry model
		@param {function} callback - callback function that gets called when the geometry is done loading
	*/
    this.addJsonGeometryModel = function(modelId, modelUrl, callback) {
        if (modelId != undefined){
            objectLibrary.addGeometryObjectFromUrl(modelId, modelUrl, callback);
        } else {
            callback();
        }
    };

	/**
    	Add an object to the universe
		@public
		@param {Object} object 
			- id: identifier for the object to be referenced later
			- objectName: a name for the object if different than id
			- update: a function(elapsedTime) that gets called each time the Universe time changes
			- draw: a function that should call Universe.draw with the object's model
	*/
	this.addObject = function(object) {
		controller.addGraphicsObject(object);
	}
	
	/**
    	Draws an object in the Universe
		@public
		@param {string} id - identifier for the object
		@param {THREE.Mesh} mesh - THREE.js mesh for the object
		@param {boolean} isScale - specifies whether the object should be scaled to always be the same as the camera moves
	*/
	this.draw = function(id, mesh, isScale) {
		core.draw(id, mesh, isScale);
	}
	
	/**
    	Removes an object from the Universe
		@public
		@param {string} id - identifier for the object
	*/
	this.unDraw = function(id) {
		core.removeObject(id);
	}
	
	/**
    	Add an object to the Universe.js object pipeline.  
		This is useful for storing things that take up GPU memory like geometries so you can reuse them.
		@public
		@param {string} id - identifier for the object
		@param {Object} object - any object you want to store for later retrieval
	*/
	this.setObjectInLibrary = function(id, object) {
		objectLibrary.setObject(id, object);
	}
	
	/**
    	Retrieves an object from the Universe.js object pipeline
		@public
		@param {string} id - identifier for the object
		@param {function} callback - method to be called with the retrieved object
	*/
	this.getObjectFromLibraryById = function(id, callback) {
		objectLibrary.getObjectById(id, callback);
	}
	
	/**
		Remove an object completely from the Universe
		@public
		@param {string} id - identifier for the object
	*/
    this.removeObject = function(id) {
        controller.removeGraphicsObject(id);
        core.removeObject(id);
    }

	/**
		Snap the Universe's camera to be directly behind an object
		@public
		@param {string} id - identifier for the object
	*/
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
			// Object is not added to the core so not doing anything
        }
    }

	/**
		Remove all objects from the Universe
		@public
	*/
    this.removeAll = function() {
        core.removeAllObjects();
        controller.removeAllGraphicsObjects();
    }
    
	/**
		Get all of the objects currently in the Universe
		@public
	*/
    this.getGraphicsObjects = function() {
        return controller.getGraphicsObjects();
    }
	
	/**
		@ignore
	*/
    this.updateObject = function(id, propertyName, propertyValue) {
        // TODO: Implement or delete
    }

	/**
		Toggle whether an object is visible in the Universe
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled - whether the object is visible or not
	*/
	this.showObject = function(id, isEnabled) {
		core.showObject(id, isEnabled);
	}

	/**
		Basic setup method, needs to be called after all objects are removed from the Universe
		@public
	*/
    this.setup = function() {
        addSimStateObject();
    }

    this.setup();
};
