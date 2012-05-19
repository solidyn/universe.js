// SensorProjection.js

/**
 *
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.SensorProjection = function(sensor, object, universe, earthExtensions, objectLocation) {
    // Create a SensorPattern

    var sensorPointCount = 30;
    // obtain the points of the sensor
    var points = sensor.buildPointsToDefineSensorShapeInECI(sensorPointCount, object);
    //var extendedPoints = sensors[0].extendSensorEndpointsInECIToConformToEarth(points, spaceObject, 1000, 10);
    var extendedPoints = sensor.findProjectionPoints(points, object, 1000);


    var THREEPoints = new Array( extendedPoints.length );
    var pointCount = extendedPoints.length;
    for(var j = 0; j< pointCount; j++) {
        var coord = earthExtensions.eciTo3DCoordinates(extendedPoints[j]);
        THREEPoints[j] = coord;
    }
    
    var objectGeometry = new UNIVERSE.SensorProjectionGeometry(objectLocation, THREEPoints);

    var objectMaterial = new THREE.MeshBasicMaterial({
        color: earthExtensions.defaultObjects.sensorColors.nextColor(),
        transparent: true,
        blending: THREE.AdditiveBlending,
        opacity: 0.15,
        overdraw: true
    });

    var sensorProjection = new THREE.Mesh(objectGeometry, objectMaterial);

    sensorProjection.doubleSided=true;

    var sensorProjectionGraphicsObject = new UNIVERSE.GraphicsObject(
        object.id + "_sensorProjection_" + sensor.name,
        object.objectName,
        undefined,
        function(elapsedTime) {
            if(earthExtensions.enableSensorProjections) {
                var objectLocation = earthExtensions.eciTo3DCoordinates(object.propagator(undefined, false));

                if(objectLocation != undefined) {

                    var points = sensor.buildPointsToDefineSensorShapeInECI(sensorPointCount, object);
                    var extendedPoints = sensor.findProjectionPoints(points, object, 1000);

                    THREEPoints = [];
                    for(var j = 0; j< pointCount; j++) {
                        var coord = earthExtensions.eciTo3DCoordinates(extendedPoints[j]);
                        THREEPoints[j] = coord;
                    }
                    sensorProjection.geometry.recalculateVertices(objectLocation, THREEPoints);
                }
            }
        },
        function() {
            universe.draw(this.id, sensorProjection, false);
        }
        );
                
    return sensorProjectionGraphicsObject;
};