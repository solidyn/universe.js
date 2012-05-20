// GroundTrackPoint.js

/**
 *
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.GroundTrackPoint = function(object, universe, earthExtensions, material, geometry) {

    var groundObjectMesh = new THREE.Mesh(geometry, material);

    var groundGraphicsObject = new UNIVERSE.GraphicsObject(
        object.id + "_groundPoint",
        object.objectName,
        undefined,
        function(elapsedTime) {
            //if(enableSubSatellitePoints) {
            var propagatedLocation = object.propagator(undefined, false);
            var objectLocation = Utilities.eciTo3DCoordinates(propagatedLocation, earthExtensions);
            if(objectLocation) {
                var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);

                // move the vector to the surface of the earth
                vector.multiplyScalar(Constants.radiusEarth / vector.length());

                groundObjectMesh.position.copy(vector);
            }
            this.currentLocation = propagatedLocation;
            
        //}
        },
        function() {
            universe.draw(this.id, groundObjectMesh, true);
        }
    );
        
    return groundGraphicsObject;
};
