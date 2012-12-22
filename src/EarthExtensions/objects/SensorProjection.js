/*jslint browser: true, sloppy: true */
/*global THREE, Utilities */

// SensorProjection.js

/**
 *
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.SensorProjection = function (sensor, object, universe, earthExtensions, objectLocation) {
    // Create a SensorPattern

    var sensorPointCount = 30,
        // obtain the points of the sensor
        points = sensor.buildPointsToDefineSensorShapeInECI(sensorPointCount, object),
        extendedPoints = sensor.findProjectionPoints(points, object, 1000),
        THREEPoints = new Array(extendedPoints.length),
        pointCount = extendedPoints.length,
        j,
        coord,
        objectGeometry,
        objectMaterial,
        sensorProjection,
        sensorProjectionGraphicsObject;

    for (j = 0; j < pointCount; j += 1) {
        coord = Utilities.eciTo3DCoordinates(extendedPoints[j], earthExtensions);
        THREEPoints[j] = coord;
    }

    objectGeometry = new UNIVERSE.SensorProjectionGeometry(objectLocation, THREEPoints);

    objectMaterial = new THREE.MeshBasicMaterial({
        color: earthExtensions.defaultObjects.sensorColors.nextColor(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.15,
        overdraw: true
    });

    sensorProjection = new THREE.Mesh(objectGeometry, objectMaterial);

    sensorProjection.doubleSided = true;

    sensorProjectionGraphicsObject = new UNIVERSE.GraphicsObject(
        object.id + "_sensorProjection_" + sensor.name,
        object.objectName,
        undefined,
        function (elapsedTime) {
            if (earthExtensions.enableSensorProjections) {
                var objectLocation = Utilities.eciTo3DCoordinates(object.propagator(undefined, false), earthExtensions),
                    points,
                    extendedPoints,
                    j,
                    coord;

                if (objectLocation) {
                    points = sensor.buildPointsToDefineSensorShapeInECI(sensorPointCount, object);
                    extendedPoints = sensor.findProjectionPoints(points, object, 1000);

                    THREEPoints = [];
                    for (j = 0; j < pointCount; j += 1) {
                        coord = Utilities.eciTo3DCoordinates(extendedPoints[j], earthExtensions);
                        THREEPoints[j] = coord;
                    }
                    sensorProjection.geometry.recalculateVertices(objectLocation, THREEPoints);
                }
            }
        },
        function () {
            universe.draw(this.id, sensorProjection, false);
        }
    );

    return sensorProjectionGraphicsObject;
};