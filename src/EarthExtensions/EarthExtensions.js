var UNIVERSE = UNIVERSE || {};

/** 
	Extensions for doing Earth-based 3D modeling with Universe.js
	@constructor
	@param {UNIVERSE.Universe} universe - The Universe to draw in
	@param {boolean} isSunLighting - Should the Earth be lit by the sun or not
 */
UNIVERSE.EarthExtensions = function(universe, isSunLighting) {
	var earthExtensions = this;
	
	// constants
	var earthSphereRadius = 6371;

	var centerPoint = new THREE.Vector3(0,0,0);
	
	// have to do this this way since the decision of whether to show or hide it has to be made at draw time
	var enableLinkLines = undefined;

	// Is the sun-lighting on the Earth enabled or disabled
	var useSunLighting = isSunLighting ? isSunLighting : true;

	universe.setObjectInLibrary("default_ground_object_geometry", new THREE.SphereGeometry(200, 20, 10));
	universe.setObjectInLibrary("default_ground_object_material", new THREE.MeshLambertMaterial({ color : 0xCC0000 }));

	universe.setObjectInLibrary("default_ground_track_material", new THREE.MeshBasicMaterial({
		color : 0xCC0000,
		transparent:true,
		opacity: 0.4,
		blending: THREE.AdditiveBlending
	}));


	var sensorColors = {
		colorList: [
		"0xff0000",
		"0x00cc00",
		"0x0066ff",
		"0x9900cc",
		"0xffff00",
		"0xff6666",
		"0xebebeb",
		"0xffaa00"
		],
		iterator: -1,
		// GRab the next color on the list and iterate to the next color
		nextColor: function() {
			this.iterator = (this.iterator + 1) % this.colorList.length;
			return this.colorList[this.iterator];	 
		}
	};

	universe.setObjectInLibrary("default_orbit_line_material", new THREE.LineBasicMaterial({
		color : 0x990000,
		opacity : 1
	}));
            
	universe.setObjectInLibrary("default_ground_object_tracing_line_material", new THREE.LineBasicMaterial({
		color : 0x009900,
		opacity : 1
	}));

	/**
		Add the Earth at the center of the Universe
		@public
		@param {string} dayImageURL - URL of the image to be used for the sun-facing side of the Earth
		@param {string} nightImageURL - URL of the image to be used for the dark side of the Earth
	*/
	this.addEarth = function(dayImageURL, nightImageURL) {
		var earthSphereSegments = 40, earthSphereRings = 30;

		// Create the sphere
		var geometry = new THREE.SphereGeometry(earthSphereRadius, earthSphereSegments, earthSphereRings);
		var dayImageTexture   = THREE.ImageUtils.loadTexture( dayImageURL );
		var earthAtNightTexture = THREE.ImageUtils.loadTexture( nightImageURL );
		var nightMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			overdraw: true,
			map: earthAtNightTexture,
			blending: THREE.AdditiveBlending
		});
        
		var nightEarthMesh = new THREE.Mesh(geometry, nightMaterial);

		//var normalTexture   = THREE.ImageUtils.loadTexture( "/assets/universe/earth_normal_2048.jpg" );
		//var specularTexture = THREE.ImageUtils.loadTexture( "/assets/universe/earth_specular_2048.jpg" );

		// planet
		//geometry.computeTangents();

		var dayMaterial = new THREE.MeshPhongMaterial({
			map: dayImageTexture,
			color: 0xffffff,
			// specular: 0xffffff,
			//ambient: 0xffffff,
			// shininess: 15,
			//opacity: 0.5,
			transparent: true,
			// reflectivity: 1
			blending: THREE.AdditiveBlending
		})

		var dayEarthMesh = new THREE.Mesh(geometry, dayMaterial);
		
		var earthMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			overdraw: true,
			map: dayImageTexture,
			blending: THREE.AdditiveBlending
		});
		
		var earthMesh = new THREE.Mesh(geometry, earthMaterial);

		var earthObject = new UNIVERSE.GraphicsObject(
			"earth", 
			"earth",
			{ x:0, y:0, z:0 },
			function(elapsedTime) {
				var rotationAngle = CoordinateConversionTools.convertTimeToGMST(universe.getCurrentUniverseTime());
				dayEarthMesh.rotation.y = rotationAngle * (2 * Math.PI / 360);
				nightEarthMesh.rotation.y = rotationAngle * (2 * Math.PI / 360);
				earthMesh.rotation.y = rotationAngle * (2 * Math.PI / 360);
			},
			function() {
				// for some reason these lines have to go in this order for night to be under day...
				universe.draw(this.id + "_day", dayEarthMesh, false);
				universe.draw(this.id + "_night", nightEarthMesh, false);
				universe.draw(this.id, earthMesh, false);
				earthExtensions.useSunLighting(useSunLighting);
                			
			});
		universe.addObject(earthObject);
	};
    
	/**
		Add the Moon to the Universe
		@public
		@param {string} moonImageURL - the URL of the Moon image to use
	*/
	this.addMoon = function(moonImageURL) {
		var moonSphereSegments = 40, moonSphereRings = 30;
		var moonSphereRadius = 1737.1;

		// Create the sphere
		var geometry = new THREE.SphereGeometry(moonSphereRadius, moonSphereSegments, moonSphereRings);

		var moonTexture = THREE.ImageUtils.loadTexture(moonImageURL);
		
		var dayMaterial = new THREE.MeshPhongMaterial({
			map: moonTexture,
			color: 0xffffff,
			// specular: 0xffffff,
			//ambient: 0xffffff,
			// shininess: 15,
			//opacity: 0.5,
			transparent: true,
			// reflectivity: 1
			blending: THREE.AdditiveBlending
		})

		var dayMoonMesh = new THREE.Mesh(geometry, dayMaterial);
		
		var moonMaterial = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			overdraw: true,
			map: moonTexture,
			blending: THREE.AdditiveBlending
		});
		
		var moonMesh = new THREE.Mesh(geometry, moonMaterial);

		var moonObject = new UNIVERSE.GraphicsObject(
			"moon", 
			"moon",
			undefined,
			function(elapsedTime) {
				var time = new Date(universe.getCurrentUniverseTime());
				var propagatedValue = CoordinateConversionTools.getMoonPositionECIAtCurrentTime(time);
				var convertedLocation = eciTo3DCoordinates({ x: propagatedValue.x, y: propagatedValue.y, z: propagatedValue.z });
				dayMoonMesh.position = { x: convertedLocation.x, y: convertedLocation.y, z: convertedLocation.z }; 
				moonMesh.position = { x: convertedLocation.x, y: convertedLocation.y, z: convertedLocation.z };
				this.currentLocation = { x: convertedLocation.x, y: convertedLocation.y, z: convertedLocation.z };
			},
			function() {
				universe.draw(this.id + "_day", dayMoonMesh, false);
				universe.draw(this.id, moonMesh, false);
				earthExtensions.useSunLighting(useSunLighting);
			}
			)
		universe.addObject(moonObject);
	}

	/**
		Add the sun to the Universe at the correct position relative to the Earth-centered universe
	*/
	this.addSun = function() {
		//var sunLight = new THREE.PointLight( 0xffffff, 1.5);
		
		var sunGraphicsObject = new UNIVERSE.GraphicsObject(
			"sun",
			"sun",
			undefined,
			function(elapsedTime) {
				//console.log("sun update");
				var sunLocation = CoordinateConversionTools.getSunPositionECIAtCurrentTime(universe.getCurrentUniverseTime());
				var convertedLocation = eciTo3DCoordinates({
					x: sunLocation.x, 
					y: sunLocation.y, 
					z: sunLocation.z
					});
				//sunLight.position.set({x: sunLocation.x, y: sunLocation.y, z: sunLocation.z});
				//console.log("sunLocation: " + JSON.stringify(sunLocation));
				universe.updateLight(convertedLocation.x, convertedLocation.y, convertedLocation.z, 1.5);
				this.currentLocation = {
					x: convertedLocation.x, 
					y: convertedLocation.y, 
					z: convertedLocation.z
					};
			},
			function() {
				//console.log("sun draw");
				universe.draw(this.id, undefined, false);
			}
			)
		universe.addObject(sunGraphicsObject);
	}

	/**
		Add a Space Object to the Universe
		@public
		@param {UNIVERSE.SpaceObject} spaceObject - An orbiting object to add to the Universe
	*/
	this.addSpaceObject = function(spaceObject) {
		var objectGeometry, material;
		universe.getObjectFromLibraryById(spaceObject.modelId, function(retrieved_geometry) {
			objectGeometry = retrieved_geometry;
			universe.getObjectFromLibraryById("default_material", function(retrieved_material) {
				material = retrieved_material;

				//objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( 0, 0, 0 ) ));
				var objectModel = new THREE.Mesh(objectGeometry, material);

				var spaceGraphicsObject = new UNIVERSE.GraphicsObject(
					spaceObject.id,
					spaceObject.objectName,
					undefined,
					function(elapsedTime) {
						// need to pass a time to the propagator
						var convertedLocation = eciTo3DCoordinates(spaceObject.propagator());
						if(convertedLocation != undefined) {
							objectModel.position.set(convertedLocation.x, convertedLocation.y, convertedLocation.z);

							//http://mrdoob.github.com/three.js/examples/misc_lookat.html
							objectModel.lookAt(centerPoint);
							this.currentLocation = {
								x: convertedLocation.x, 
								y: convertedLocation.y, 
								z: convertedLocation.z
								};
						}
					},
					function() {
						universe.draw(this.id, objectModel, false);
						earthExtensions.showModelForId(spaceObject.showVehicle, this.id);
					}
					)
				universe.addObject(spaceGraphicsObject);

				earthExtensions.addPropogationLineForObject(spaceObject);
				earthExtensions.showOrbitLineForObject(spaceObject.showPropogationLine, spaceObject.id);

				earthExtensions.addGroundTrackPointForObject(spaceObject);
				earthExtensions.showGroundTrackForId(spaceObject.showGroundTrackPoint, spaceObject.id);

				earthExtensions.addSensorProjections(spaceObject);
				earthExtensions.showSensorProjectionForId(spaceObject.showSensorProjections, spaceObject.id);

				earthExtensions.addSensorFootprintProjections(spaceObject);
				earthExtensions.showSensorFootprintProjectionsForId(spaceObject.showSensorFootprintProjections, spaceObject.id);
			});
		});
	};

	/**
		Add a Ground Object to the Earth
		@public
		@param {UNIVERSE.GroundObject} groundObject - an object to display on the Earth
	*/
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

				var groundGraphicsObject = new UNIVERSE.GraphicsObject(
					groundObject.id,
					groundObject.objectName,
					undefined,
					function(elapsedTime) {
						// check earth rotation and update location
						var position = eciTo3DCoordinates(groundObject.propagator());
						groundObjectMesh.position.set(position.x, position.y, position.z);
						this.currentLocation = {
							x: position.x, 
							y: position.y, 
							z: position.z
							};

						//http://mrdoob.github.com/three.js/examples/misc_lookat.html
						var scaled_position_vector = new THREE.Vector3(position.x, position.y, position.z);

						// arbitrary size, just a point along the position vector further out for the object to lookAt
						scaled_position_vector.multiplyScalar(1.4);

						groundObjectMesh.lookAt(scaled_position_vector);
					},
					function() {
						universe.draw(this.id, groundObjectMesh, true);
					}
					);
				universe.addObject(groundGraphicsObject);
			});
		});
	};

	/**
		Add a Ground Track Point for an Object
		@public
		@param {UNIVERSE.SpaceObject} object - The Space Object to add a ground track point for
	*/
	this.addGroundTrackPointForObject = function(object) {
		var objectGeometry, objectMaterial;
		universe.getObjectFromLibraryById("default_ground_object_geometry", function(retrieved_geometry) {
			objectGeometry = retrieved_geometry;
			universe.getObjectFromLibraryById("default_ground_track_material", function(retrieved_material) {
				objectMaterial = retrieved_material;


				var groundObjectMesh = new THREE.Mesh(objectGeometry, objectMaterial);

				var groundGraphicsObject = new UNIVERSE.GraphicsObject(
					object.id + "_groundPoint",
					object.objectName,
					undefined,
					function(elapsedTime) {
						var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));
						if(objectLocation != undefined) {
							var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);

							// move the vector to the surface of the earth
							vector.multiplyScalar(earthSphereRadius / vector.length())

							groundObjectMesh.position.copy(vector);
						}
						this.currentLocation = objectLocation;
					},
					function() {
						universe.draw(this.id, groundObjectMesh, true);
					}
					);
				universe.addObject(groundGraphicsObject);
			});
		});
	}

	/**
		Add a Propagation Line for an Object
		@public
		@param {UNIVERSE.SpaceObject} object - A Space Object to add a propagation line for
	*/
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

			var lineGraphicsObject = new UNIVERSE.GraphicsObject(
				object.id + "_propogation",
				object.objectName,
				undefined,
				function(elapsedTime) {
				// add points onto the end of the track?
				},
				function() {
					universe.draw(this.id, lineS, false);
				}
				);
			universe.addObject(lineGraphicsObject);
		});
	}

	/**
		Add a Sensor Projection for an Object
		@public
		@param {UNIVERSE.SpaceObject} object - A Space Object to add a Sensor Projection for
	*/
	this.addSensorProjection = function(sensor, spaceObject) {


		var objectGeometry, objectMaterial;

		// Determine the object's location in 3D space
		var objectLocation = eciTo3DCoordinates(spaceObject.propagator(undefined, false));
		if(objectLocation != undefined) {
			// Create a SensorPattern

			var sensorPointCount = 30;
			// obtain the points of the sensor
			var points = sensor.buildPointsToDefineSensorShapeInECI(sensorPointCount, spaceObject);
			//var extendedPoints = sensors[0].extendSensorEndpointsInECIToConformToEarth(points, spaceObject, 1000, 10);
			var extendedPoints = sensor.findProjectionPoints(points, spaceObject, 1000);


			var THREEPoints = new Array( extendedPoints.length );
			var pointCount = extendedPoints.length;
			for(var j = 0; j< pointCount; j++) {
				var coord = eciTo3DCoordinates(extendedPoints[j]);
				THREEPoints[j] = coord;
			}
			objectGeometry = new SensorProjection(objectLocation, THREEPoints);

			var objectMaterial = new THREE.MeshBasicMaterial({
				color: sensorColors.nextColor(),
				transparent: true,
				blending: THREE.AdditiveBlending,
				opacity: 0.15,
				overdraw: true
			});

			var sensorProjection = new THREE.Mesh(objectGeometry, objectMaterial);

			sensorProjection.doubleSided=true;

			var sensorProjectionGraphicsObject = new UNIVERSE.GraphicsObject(
				spaceObject.id + "_sensorProjection_" + sensor.name,
				spaceObject.objectName,
				undefined,
				function(elapsedTime) {

					var objectLocation = eciTo3DCoordinates(spaceObject.propagator(undefined, false));

					if(objectLocation != undefined) {

						var points = sensor.buildPointsToDefineSensorShapeInECI(sensorPointCount, spaceObject);
						var extendedPoints = sensor.findProjectionPoints(points, spaceObject, 1000);

						THREEPoints = [];
						for(var j = 0; j< pointCount; j++) {
							var coord = eciTo3DCoordinates(extendedPoints[j]);
							THREEPoints[j] = coord;
						}
						sensorProjection.geometry.recalculateVertices(objectLocation, THREEPoints);
					}
				},
				function() {
					universe.draw(this.id, sensorProjection, false);
				}
				);
			universe.addObject(sensorProjectionGraphicsObject);
		}
	}



	this.addSensorProjections = function(spaceObject) {
		if(spaceObject.sensors.length > 0 ) {
			for(var i = spaceObject.sensors.length-1; i >= 0; i--) {
				this.addSensorProjection(spaceObject.sensors[i], spaceObject)
			}
		}
	}
	
	this.addSensorFootprintProjections = function(spaceObject) {
		if(spaceObject.sensors.length > 0 ) {
			for(var i = 0; i < spaceObject.sensors.length; i++) {
				this.addSensorFootprintProjection(spaceObject.sensors[i], spaceObject)
			}
		}
	}
	
	this.addSensorFootprintProjection = function(sensor, spaceObject) {
		var objectMaterial = new THREE.LineBasicMaterial({
			color : get_random_color(),
			opacity : .5,
			linewidth : 3
		});

		//console.log("sensor: " + JSON.stringify(spaceObject.sensors[i]));
		var objectGeometry = new THREE.Geometry();

		var points = sensor.buildPointsToDefineSensorShapeInECI(40, spaceObject);
		//var extendedPoints = sensors[0].extendSensorEndpointsInECIToConformToEarth(points, spaceObject, 1000, 10);
		var extendedPoints = sensor.findProjectionPoints(points, spaceObject, 1000);
		
		for(var j = 0; j< extendedPoints.length; j++) {
			var vector = new THREE.Vector3(-extendedPoints[j].x, extendedPoints[j].z, extendedPoints[j].y);
			objectGeometry.vertices.push(new THREE.Vertex(vector));
		}

		objectGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(-extendedPoints[0].x, extendedPoints[0].z, extendedPoints[0].y)));

		var line = new THREE.Line(objectGeometry, objectMaterial);

        
		var lineGraphicsObject = new UNIVERSE.GraphicsObject(
			spaceObject.id + "_footprint_" + sensor.name,
			undefined,
			undefined,
			function(elapsedTime) {
				var points = this.sensor.buildPointsToDefineSensorShapeInECI(40, spaceObject);
				//var extendedPoints = sensors[0].extendSensorEndpointsInECIToConformToEarth(points, spaceObject, 1000, 10);
				var extendedPoints = this.sensor.findProjectionPoints(points, spaceObject, 1000);
				//console.log("points: " + JSON.stringify(extendedPoints));
	
				for(var k = 0; k < extendedPoints.length; k++) {
					line.geometry.vertices[k].position = {
						x: -extendedPoints[k].x, 
						y: extendedPoints[k].z, 
						z: extendedPoints[k].y
					}
				}
				
				line.geometry.vertices[extendedPoints.length].position = {
					x: -extendedPoints[0].x, 
					y: extendedPoints[0].z, 
					z: extendedPoints[0].y
				}
				
				line.geometry.__dirtyVertices = true;
			},
			function() {
				universe.draw(this.id, line, false) ;
			}
			);
		lineGraphicsObject.sensor = sensor;
		universe.addObject(lineGraphicsObject);
	}
    
	/**
		Add a Tracing Line to the closest ground object for an Object
		@public
		@param {UNIVERSE.SpaceObject} object - A Space Object to add a tracing line to the closest ground object for
	*/
	this.addClosestGroundObjectTracingLine = function(object) {
		var closestObject_id = undefined;
		var closestGroundObjectLineController = new UNIVERSE.GraphicsObject(
			object.id + "_controlLine",
			object.objectName,
			undefined,
			function(elapsedTime) {
				var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));

				var closestGroundObject = earthExtensions.findClosestGroundObject(objectLocation);

				if(closestGroundObject != undefined && closestGroundObject.id != closestObject_id) {
					earthExtensions.removeLineBetweenObjects(object.id, closestObject_id);
					closestObject_id = closestGroundObject.id;
					earthExtensions.addLineBetweenObjects(object.id, closestObject_id);
				}
			},
			function() {
				
			}
			)
		universe.addObject(closestGroundObjectLineController);
	}

	/**
		Add a Line between two graphics objects
		@public
		@param {string} object1_id - starting object of the line
		@param {string} object2_id - end object of the line
	*/
	this.addLineBetweenObjects = function(object1_id, object2_id, color) {
		var objectGeometry, objectMaterial;
        
		universe.getObjectFromLibraryById("default_ground_object_tracing_line_material", function(retrieved_material) {
			if(color) {
				objectMaterial = new THREE.LineBasicMaterial({
					color : color,
					opacity : 1
				});
			}
			else {
				objectMaterial = retrieved_material;
			}
			
			var object1 = universe.getGraphicsObjectById(object1_id);
			var object2 = universe.getGraphicsObjectById(object2_id);
			
			if(object1 == undefined || object2 == undefined) {
				return;
			}
			
			var object1Location = object1.currentLocation;
			var object2Location = object2.currentLocation;
			
			if(object1Location == undefined || object2Location == undefined) {
				return;
			}
            
			objectGeometry = new THREE.Geometry();
			objectGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(object1Location.x, object1Location.y, object1Location.z)));
                
			objectGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(object2Location.x, object2Location.y, object2Location.z)));
            
			var line = new THREE.Line(objectGeometry, objectMaterial);


			var lineGraphicsObject = new UNIVERSE.GraphicsObject(
				object1_id + "_to_" + object2_id,
				undefined,
				undefined,
				function(elapsedTime) {
					var object1 = universe.getGraphicsObjectById(object1_id);
					var object2 = universe.getGraphicsObjectById(object2_id);
					if(object1 == undefined || object2 == undefined) {
						return;
					}
					var object1Location = object1.currentLocation;
					var object2Location = object2.currentLocation;
					
					if(object1Location == undefined || object2Location == undefined) {
						return;
					}
                   
					objectGeometry.vertices[0].position = {
						x: object1Location.x, 
						y: object1Location.y, 
						z: object1Location.z
					};
					
					objectGeometry.vertices[1].position = {
						x: object2Location.x, 
						y: object2Location.y, 
						z: object2Location.z
					};
					
					objectGeometry.__dirtyVertices = true;
				},
				function() {
					universe.draw(this.id, line, false)	;
				}
				);
			universe.addObject(lineGraphicsObject);
		});
	}

	/**
		Remove a Line between two graphics objects
		@public
		@param {string} object1_id - starting object of the line
		@param {string} object2_id - end object of the line
	*/
	this.removeLineBetweenObjects = function(object1_id, object2_id) {
		universe.removeObject(object1_id + "_to_" + object2_id);
	}
	
	/**
		Remove all Lines between two graphics objects
		@public
	*/
	this.removeAllLinesBetweenObjects = function() {
		var graphicsObjects = universe.getGraphicsObjects();
		for(var i in graphicsObjects) {
			if(i.indexOf("_to_") > -1) {
				universe.removeObject(i);
			}
		}
	}
    
	/**
		Return the closest Ground Object to a location
		@public
		@param {UNIVERSE.ECICoordinates} location - the location to find the closest point to
	*/
	this.findClosestGroundObject = function(location) {
		// TODO: this undefined check may be covering up a bug where not everything gets removed in the 
		// removeAllExceptEarthAndMoon method
		if(location != undefined) {
			var location_vector = new THREE.Vector3(location.x, location.y, location.z);

			// move the vector to the surface of the earth
			location_vector.multiplyScalar(earthSphereRadius / location_vector.length())

			return earthExtensions.findClosestObject({
				x: location_vector.x, 
				y: location_vector.y, 
				z: location_vector.z
				});
		}
		return undefined;
	}
    
	/**
		Return the closest Object to a location
		@public
		@param {UNIVERSE.ECICoordinates} location - the location to find the closest point to
	*/
	this.findClosestObject = function(location) {
		var graphicsObjects = universe.getGraphicsObjects();
        
		var closestDistance = undefined;
		var closestObject = undefined;
		var location_vector = new THREE.Vector3(location.x, location.y, location.z);
        
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
    
	/**
		Enable or disable all orbit lines
		@public
		@param {boolean} isEnabled
	*/
	this.showAllOrbitLines = function(isEnabled) {
		var graphicsObjects = universe.getGraphicsObjects();

		for(var i in graphicsObjects) {
			if(graphicsObjects[i].id.indexOf("_propogation") != -1){
				universe.showObject(graphicsObjects[i].id, isEnabled);
			}
		}
	}

	/**
		Enable or disable orbit lines for a specific object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
	this.showOrbitLineForObject = function(isEnabled, id) {
		universe.showObject(id + "_propogation", isEnabled);
	}

	/**
		Enable or disable display of an object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
	this.showModelForId = function(isEnabled, id) {
		universe.showObject(id, isEnabled);
	}
    
	/**
		Enable or disable display of all ground tracks
		@public
		@param {boolean} isEnabled
	*/
	this.showAllGroundTracks = function(isEnabled) {
		var graphicsObjects = universe.getGraphicsObjects();

		for(var i in graphicsObjects) {
			if(graphicsObjects[i].id.indexOf("_groundPoint") != -1){
				universe.showObject(graphicsObjects[i].id, isEnabled);
			}
		}
	}

	/**
		Enable or disable display of a ground track for an object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
	this.showGroundTrackForId = function(isEnabled, id) {
		universe.showObject(id + "_groundPoint", isEnabled);
	}
    
	/**
		Enable or disable display of all sensor projections
		@public
		@param {boolean} isEnabled
	*/
	this.showAllSensorProjections = function(isEnabled) {
		var graphicsObjects = universe.getGraphicsObjects();

		for(var i in graphicsObjects) {
			if(graphicsObjects[i].id.indexOf("_sensorProjection") != -1){
				universe.showObject(graphicsObjects[i].id, isEnabled);
			}
		}
	}

	/**
		Enable or disable display of sensor projections for an object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
	this.showSensorProjectionForId = function(isEnabled, id) {
		//console.log("show/hiding sensorProjection");
		universe.showObject(id + "_sensorProjection", isEnabled);
	}

	/**
		Enable or disable display of all sensor projections
		@public
		@param {boolean} isEnabled
	*/
	this.showAllSensorFootprintProjections = function(isEnabled) {
		var graphicsObjects = universe.getGraphicsObjects();

		for(var i in graphicsObjects) {
			if(graphicsObjects[i].id.indexOf("_footprint") != -1){
				universe.showObject(graphicsObjects[i].id, isEnabled);
			}
		}
	}

	/**
		Enable or disable display of sensor projections for an object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
	this.showSensorFootprintProjectionsForId = function(isEnabled, id) {
		//console.log("show/hiding sensorProjection");
		var graphicsObjects = universe.getGraphicsObjects();

		for(var i in graphicsObjects) {
			if(graphicsObjects[i].id.indexOf(id) != -1 && graphicsObjects[i].id.indexOf("_footprint") != -1 ){
				universe.showObject(graphicsObjects[i].id, isEnabled);
			}
		}
	}
    
	/**
		Enable or disable display of all lines between objects
		@public
		@param {boolean} isEnabled
	*/
	this.showAllLinesBetweenObjects = function(isEnabled) {
		var graphicsObjects = universe.getGraphicsObjects();

		for(var i in graphicsObjects) {
			if(graphicsObjects[i].id.indexOf("_to_") != -1){
				universe.showObject(graphicsObjects[i].id, isEnabled);
			}
		}
	}
    
	/**
		Enable or disable display of lines for an object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
	this.showLineBetweenObjectsForId = function(isEnabled, id) {
		var graphicsObjects = universe.getGraphicsObjects();

		for(var i in graphicsObjects) {
			if(graphicsObjects[i].id.indexOf(id + "_to_") != -1 || graphicsObjects[i].id.indexOf("_to_" + id) != -1 ){
				universe.showObject(graphicsObjects[i].id, isEnabled);
			}
		}
	}

	/**
		Turn on or off sun lighting
		@public
		@param {boolean} isSunLighting
	*/
	this.useSunLighting = function(isSunLighting) {
		useSunLighting = isSunLighting;
		universe.showObject("earth", !isSunLighting);
		universe.showObject("earth_day", isSunLighting);
		universe.showObject("earth_night", isSunLighting);
	}

	/**
		Remove all objects from the Universe except the Earth and Moon
		@public
	*/
	this.removeAllExceptEarthAndMoon = function() {
		var graphicsObjects = universe.getGraphicsObjects();
        
		for(var i in graphicsObjects) {
			if(graphicsObjects[i].id != "earth" && graphicsObjects[i].id != "moon" && graphicsObjects[i].id != "sun") {
				universe.removeObject(graphicsObjects[i].id);
			}
		}
	}

	/**
		Set up the Universe with the Earth Extensions
		@public
	*/
	this.setup = function() {
		this.removeAllExceptEarthAndMoon();
		universe.setup();
	}

	/**
		Converts ECI to THREE.js 3D coordinate system. Compare these two websites for details on why we have to do this:
    	http://celestrak.com/columns/v02n01/
    	http://stackoverflow.com/questions/7935209/three-js-3d-coordinates-system
		@private
	*/
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

	function get_random_color() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '0x';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.round(Math.random() * 15)];
		}
		return color;
	}
}
