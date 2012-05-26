/** 
    An object to be drawn in orbit around the Earth
    @constructor
    @param {string} id - Identifier for the object to be referenced later
    @param {string} objectName - A name for the object if different than id.  Set to the id if not defined
    @param {function} propagator - A function(time) to give the object's position at a time.  No time passed in means the current Universe time
    @param {string} modelId - Identifier for the model to use that has been added to the Universe's object library
    @param {boolean} showPropagationLine - should a propagation line be shown for the object
    @param {boolean} showGroundTrackPoint - should the ground track point be shown for the object
 */

UNIVERSE.SpaceObject = function(id, objectName, modelId, propagator, showPropagationLine, showGroundTrackPoint, sensors, currentLocation, universe, earthExtensions) {
    if(!id)
    { 
        return undefined;
    }
    this.id = id;
    this.objectName = objectName || id;
    this.propagator = propagator;
    this.modelId = modelId;
    this.showPropagationLine = showPropagationLine || false;
    this.showGroundTrackPoint = showGroundTrackPoint || false;
    this.sensors = sensors || undefined;
    
    this.currentLocation = currentLocation || undefined;
        this.universe = universe || undefined;
        this.earthExtensions = earthExtensions || undefined;
};

UNIVERSE.SpaceObject.prototype = {
    constructor: UNIVERSE.SpaceObject,
    
    set: function ( id, objectName, propagator, modelId, showPropogationLine, showGroundTrackPoint, sensors, currentLocation, universe, earthExtensions) {

        this.id = id;
        this.objectName = objectName || id;
        this.propagator = propagator;
        this.modelId = modelId;
        this.showPropagationLine = showPropogationLine || false;
        this.showGroundTrackPoint = showGroundTrackPoint || false;
        this.sensors = sensors || undefined;
        this.currentLocation = currentLocation || undefined;
                this.universe = universe || undefined;
                this.earthExtensions = earthExtensions || undefined;

        return this;
    },
    
    getEci: function () {
        //var location = this.propagator();
        
        return this.currentLocation;
    },
        
        getGraphicsObject: function(material, objectGeometry, universe, earthExtensions) {

            this.universe = universe;
            this.earthExtensions = earthExtensions;
            var spaceObject = this;
            
            objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( -Math.PI/2, 0, 0 ) ));
            var objectModel = new THREE.Mesh(objectGeometry, material);

            var spaceGraphicsObject = new UNIVERSE.GraphicsObject(
                this.id,
                this.objectName,
                undefined,
                function(elapsedTime) {
                    // need to pass a time to the propagator
                    var propagatedLocation = spaceObject.propagator();
                    var convertedLocation = Utilities.eciTo3DCoordinates(propagatedLocation, earthExtensions);
                    if(convertedLocation) {
                        objectModel.position.set(convertedLocation.x, convertedLocation.y, convertedLocation.z);

                        //http://mrdoob.github.com/three.js/examples/misc_lookat.html
                        objectModel.lookAt(new THREE.Vector3(0,0,0));
                        this.currentLocation = propagatedLocation;
                        //console.log("currentLocation: " + spaceObject.currentLocation);
                    }
                },
                function() {
                    spaceObject.universe.draw(this.id, objectModel, false);
                    spaceObject.earthExtensions.showModelForId(spaceObject.showVehicle, this.id);
                }
            );
            return spaceGraphicsObject;
        }
};