// GroundTrackPoint.js
/*jslint browser: true, sloppy: true */
/*global THREE, Utilities, Constants */

/** 
    A Ground Track (Sub-satellite) point to be drawn on the Earth
    @constructor
    @param {UNIVERSE.SpaceObject} object - the object to draw a ground tracking point for
    @param {UNIVERSE.Universe} universe - a Universe instance to draw the ground track point in
    @param {UNIVERSE.EarthExtensions} earthExtensions - An EarthExtensions instance to draw the ground track point in
    @param {THREE.Material} material - Material for the ground track point
    @param {THREE.Geometry} geometry - Geometry for the ground track point
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.GroundTrackPoint = function (object, universe, earthExtensions, material, geometry) {

    var groundObjectMesh = new THREE.Mesh(geometry, material),
        groundGraphicsObject = new UNIVERSE.GraphicsObject(
            object.id + "_groundPoint",
            object.objectName,
            undefined,
            function (elapsedTime) {
                //if(enableSubSatellitePoints) {
                var propagatedLocation = object.propagator(undefined, false),
                    objectLocation = Utilities.eciTo3DCoordinates(propagatedLocation, earthExtensions),
                    vector;
                if (objectLocation) {
                    vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);

                    // move the vector to the surface of the earth
                    vector.multiplyScalar(Constants.radiusEarth / vector.length());

                    groundObjectMesh.position.copy(vector);
                }
                this.currentLocation = propagatedLocation;

            //}
            },
            function () {
                universe.draw(this.id, groundObjectMesh, true);
            }
        );

    return groundGraphicsObject;
};
