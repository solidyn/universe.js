var SSI = SSI || {};

SSI.Universe = function(options, container) {
	var controller = new SSI.UniverseController({});
	var core = new SSI.Core3D(container);
	var objectLibrary = new SSI.ObjectLibrary();

	// constants
	var earthSphereRadius = 6371;

	// options
	
	var currentUniverseTime = new Date(options.currentUniverseTime);
	var playbackSpeed = 1;

	// function to call when we have a new state object
	var stateChangedCallback = function() {
	};
	// milliseconds between updating our state object that we broadcast
	// to any listeners
	var timeBetweenStateUpdatesMs = 1000;

	// timeout for updating state
	var updateStateTimeout;

	controller.addGraphicsObject({
		id : "simState",
		objectName : "simState",
		update : function(elapsedTime) {
			currentUniverseTime.setTime(currentUniverseTime.getTime() + playbackSpeed*elapsedTime);
		},
		draw : function() {
		}
	});

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
				earthMesh.rotation.y += 0.01;
			},
			draw : function() {
				core.draw(this.id, earthMesh);
			}
		});
	};
	// adds a model to the universe with an ID and url to retrieve
	// the model's geometry
	this.addJsonMeshModel = function(modelId, modelUrl, material, callback) {
		logger.debug("Adding mesh model to universe; id: [" + modelId + "] url: [" + modelUrl + "], material: [" + material + "]");
		objectLibrary.addMeshObjectFromUrl(modelId, modelUrl, material, callback);
	};
	// spaceObject:
	// id
	// stateVector
	//   time
	//   x, y, z
	// objectName
	// propogator
	// modelId
	// showPropogationLine
	// showGroundTrackPoint
	this.addSpaceObject = function(spaceObject) {
		var objectModel = objectLibrary.getObjectById(spaceObject.modelId);

		controller.addGraphicsObject({
			id : spaceObject.id,
			objectName : spaceObject.objectName,
			update : function(elapsedTime) {
				// need to pass a time to the propogator
				var location = eciTo3DCoordinates(spaceObject.propogator());
				objectModel.position.set(location.x, location.y, location.z);
			},
			draw : function() {
				core.draw(this.id, objectModel);
			}
		});

		if(spaceObject.showPropogationLine == true) {
			this.addPropogationLineForObject(spaceObject);
		}

		if(spaceObject.showGroundTrackPoint) {
			this.addGroundTrackPointForObject(spaceObject);
		}
	};
	// groundObject:
	// id
	// propogator
	// object
	this.addGroundObject = function(groundObject) {
		var geometry = new THREE.SphereGeometry(100, 20, 10);

		var sphereMaterial = new THREE.MeshLambertMaterial({
			color : 0xCC0000
		});

		var groundObjectMesh = new THREE.Mesh(geometry, sphereMaterial);

		controller.addGraphicsObject({
			id : groundObject.id,
			objectName : groundObject.objectName,
			update : function(elapsedTime) {
				// check earth rotation and update location
				var position = eciTo3DCoordinates(groundObject.propogator());
				groundObjectMesh.position.set(position.x, position.y, position.z);
			},
			draw : function() {
				core.draw(this.id, groundObjectMesh);
			}
		});
	};
	
	// method to add an orbit line
	this.addPropogationLineForObject = function(object) {
		var geometry = new THREE.Geometry();
		
		var timeToPropogate = new Date(currentUniverseTime);
		
		// draw a vertex for each minute in a 24 hour period
		for(var j = 0; j < 1440; j++) {
			var location = eciTo3DCoordinates(object.propogator(timeToPropogate));
			var vector = new THREE.Vector3(location.x, location.y, location.z);
			geometry.vertices.push(new THREE.Vertex(vector));
			
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
				core.draw(this.id, lineS);
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
				var objectLocation = eciTo3DCoordinates(object.propogator());
		
				var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);
		
				// move the vector to the surface of the earth
				vector.multiplyScalar(earthSphereRadius / vector.length())
		
				// give it a random x and y position between -500 and 500
				groundObjectMesh.position.x = vector.x;
				groundObjectMesh.position.y = vector.y;
				groundObjectMesh.position.z = vector.z;
				
			},
			draw : function() {
				core.draw(this.id, groundObjectMesh);
			}
		})
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
