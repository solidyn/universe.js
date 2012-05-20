var UNIVERSE = UNIVERSE || {};

/** 
    A Ground Object to be drawn on the Earth
    @constructor
    @param {string} id - Identifier for the object to be referenced later
    @param {string} objectName - A name for the object if different than id.  Set to the id if not defined
    @param {function} propagator - A function(time) to give the object's position at a time.  No time passed in means the current Universe time
    @param {string} modelId - Identifier for the model to use that has been added to the Universe's object library
 */

UNIVERSE.GroundObject = function(id, objectName, modelId, propagator) {
    if(!id)
    { 
        return undefined;
    }
    this.id = id;
    this.objectName = objectName || id;
    this.propagator = propagator;
    this.modelId = modelId;
};

UNIVERSE.GroundObject.prototype = {
    constructor: UNIVERSE.GroundObject,
    
    set: function ( id, objectName, propagator, modelId ) {

        this.id = id;
        this.objectName = objectName || id;
        this.propagator = propagator;
        this.modelId = modelId;

        return this;
    },
        
        getGraphicsObject: function(objectMaterial, objectGeometry, universe, earthExtensions) {
            objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( Math.PI / 2, Math.PI, 0 ) ));
            
            var groundObjectMesh = new THREE.Mesh(objectGeometry, objectMaterial);

            var groundObject = this;
            
            var groundGraphicsObject = new UNIVERSE.GraphicsObject(
                this.id,
                this.objectName,
                undefined,
                function(elapsedTime) {
                    // check earth rotation and update location
                    var propagatedPosition = groundObject.propagator();
                    var position = earthExtensions.eciTo3DCoordinates(propagatedPosition);
                    groundObjectMesh.position.set(position.x, position.y, position.z);
                    groundObject.currentLocation = propagatedPosition;

                    //http://mrdoob.github.com/three.js/examples/misc_lookat.html
                    var scaled_position_vector = new THREE.Vector3(position.x, position.y, position.z);

                    // arbitrary size, just a point along the position vector further out for the object to lookAt
                    scaled_position_vector.multiplyScalar(1.4);

                    groundObjectMesh.lookAt(scaled_position_vector);
                },
                function() {
                    universe.draw(groundObject.id, groundObjectMesh, true);
                }
            );
                
            return groundGraphicsObject;
        }
};