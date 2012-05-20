// SensorFootprintProjection.js

/**
 *
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.SensorFootprintProjection = function(sensor, object, universe, earthExtensions, objectLocation) {
    
    var objectMaterial = new THREE.LineBasicMaterial({
        color : Utilities.get_random_color(),
        opacity : 0.5,
        linewidth : 3
    });

    //console.log("sensor: " + JSON.stringify(spaceObject.sensors[i]));
    var objectGeometry = new THREE.Geometry();

    var points = sensor.buildPointsToDefineSensorShapeInECI(40, object);
    //var extendedPoints = sensors[0].extendSensorEndpointsInECIToConformToEarth(points, spaceObject, 1000, 10);
    var extendedPoints = sensor.findProjectionPoints(points, object, 1000);
        
    for(var j = 0; j< extendedPoints.length; j++) {
        var vector = new THREE.Vector3(-extendedPoints[j].x, extendedPoints[j].z, extendedPoints[j].y);
        objectGeometry.vertices.push(new THREE.Vertex(vector));
    }

    objectGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(-extendedPoints[0].x, extendedPoints[0].z, extendedPoints[0].y)));

    var line = new THREE.Line(objectGeometry, objectMaterial);

        
    var lineGraphicsObject = new UNIVERSE.GraphicsObject(
        object.id + "_footprint_" + sensor.name,
        undefined,
        undefined,
        function(elapsedTime) {
            if(earthExtensions.enableSensorFootprintProjections) {
                var points = this.sensor.buildPointsToDefineSensorShapeInECI(40, object);
                    
                var extendedPoints = this.sensor.findProjectionPoints(points, object, 1000);

                for(var k = 0; k < extendedPoints.length; k++) {
                    var convertedLocation = Utilities.eciTo3DCoordinates(extendedPoints[k], earthExtensions);
                    line.geometry.vertices[k].position = {
                        x: convertedLocation.x, 
                        y: convertedLocation.y, 
                        z: convertedLocation.z
                    };
                }
                                        
                var convertedLastPoint = Utilities.eciTo3DCoordinates(extendedPoints[0], earthExtensions);
                line.geometry.vertices[extendedPoints.length].position = {
                    x: convertedLastPoint.x, 
                    y: convertedLastPoint.y, 
                    z: convertedLastPoint.z
                };

                line.geometry.__dirtyVertices = true;
            }
        },
        function() {
            universe.draw(this.id, line, false) ;
        }
        );
    lineGraphicsObject.sensor = sensor;
    
    return lineGraphicsObject;
};
