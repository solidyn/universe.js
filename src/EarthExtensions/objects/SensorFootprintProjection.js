/*jslint browser: true, sloppy: true, nomen: true */
/*global THREE, Utilities */

// SensorFootprintProjection.js

/**
 *
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.SensorFootprintProjection = function (sensor, object, universe, earthExtensions, objectLocation) {

    var objectMaterial = new THREE.LineBasicMaterial({
        color : Utilities.get_random_color(),
        opacity : 0.5,
        linewidth : 3
    }),
        objectGeometry = new THREE.Geometry(),

        points = sensor.buildPointsToDefineSensorShapeInECI(40, object),
    //var extendedPoints = sensors[0].extendSensorEndpointsInECIToConformToEarth(points, spaceObject, 1000, 10);
        extendedPoints = sensor.findProjectionPoints(points, object, 1000),
        j,
        vector,
        line,
        lineGraphicsObject;

    for (j = 0; j < extendedPoints.length; j += 1) {
        vector = new THREE.Vector3(-extendedPoints[j].x, extendedPoints[j].z, extendedPoints[j].y);
        objectGeometry.vertices.push(vector);
    }

    objectGeometry.vertices.push(new THREE.Vector3(-extendedPoints[0].x, extendedPoints[0].z, extendedPoints[0].y));

    line = new THREE.Line(objectGeometry, objectMaterial);
 
    lineGraphicsObject = new UNIVERSE.GraphicsObject(
        object.id + "_footprint_" + sensor.name,
        undefined,
        undefined,
        function (elapsedTime) {
            if (earthExtensions.enableSensorFootprintProjections) {
                var points = this.sensor.buildPointsToDefineSensorShapeInECI(40, object),
                    extendedPoints = this.sensor.findProjectionPoints(points, object, 1000),
                    k,
                    convertedLocation,
                    convertedLastPoint;

                for (k = 0; k < extendedPoints.length; k += 1) {
                    convertedLocation = Utilities.eciTo3DCoordinates(extendedPoints[k], earthExtensions);
                    line.geometry.vertices[k] = new THREE.Vector3(
                        convertedLocation.x,
                        convertedLocation.y,
                        convertedLocation.z
					);
                }

                convertedLastPoint = Utilities.eciTo3DCoordinates(extendedPoints[0], earthExtensions);
                line.geometry.vertices[extendedPoints.length] = new THREE.Vector3(
                    convertedLastPoint.x,
                    convertedLastPoint.y,
                    convertedLastPoint.z
                );

				line.geometry.verticesNeedUpdate = true;
            }
        },
        function () {
            universe.draw(this.id, line, false);
        }
    );
    lineGraphicsObject.sensor = sensor;

    return lineGraphicsObject;
};
