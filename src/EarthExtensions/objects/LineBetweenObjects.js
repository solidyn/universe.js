// LineBetweenObjects.js

/**
 *
 */

/*jslint browser: true, sloppy: true, nomen: true */
/*global THREE, Utilities */

var UNIVERSE = UNIVERSE || {};

UNIVERSE.LineBetweenObjects = function (object1_id, object2_id, universe, earthExtensions, color, customIdentifier) {
    var objectGeometry, objectMaterial,
        object1 = universe.getGraphicsObjectById(object1_id),
        object2 = universe.getGraphicsObjectById(object2_id),
        object1Location,
        object2Location,
        line,
        identifier,
        lineGraphicsObject;

    if (!color) {
        color = 0x009900;
    }

    objectMaterial = new THREE.LineBasicMaterial({
        color : color,
        opacity : 1
    });

    if (!object1 || !object2) {
        return undefined;
    }

    object1Location = Utilities.eciTo3DCoordinates(object1.currentLocation, earthExtensions);
    object2Location = Utilities.eciTo3DCoordinates(object2.currentLocation, earthExtensions);

    if (!object1Location || !object2Location) {
        return undefined;
    }

    objectGeometry = new THREE.Geometry();
    objectGeometry.vertices.push(new THREE.Vector3(object1Location.x, object1Location.y, object1Location.z));

    objectGeometry.vertices.push(new THREE.Vector3(object2Location.x, object2Location.y, object2Location.z));

    line = new THREE.Line(objectGeometry, objectMaterial);

    identifier = "_to_";
    if (customIdentifier) {
        identifier = customIdentifier;
    }

    lineGraphicsObject = new UNIVERSE.GraphicsObject(
        object1_id + identifier + object2_id,
        undefined,
        undefined,
        function (elapsedTime) {
            var object1 = universe.getGraphicsObjectById(object1_id),
                object2 = universe.getGraphicsObjectById(object2_id),
                object1Location,
                object2Location;

            if (!object1 || !object2) {
                return;
            }

            object1Location = Utilities.eciTo3DCoordinates(object1.currentLocation, earthExtensions);
            object2Location = Utilities.eciTo3DCoordinates(object2.currentLocation, earthExtensions);

            if (object1Location && object2Location) {
                objectGeometry.vertices[0].position = new THREE.Vector3(
                    object1Location.x,
                    object1Location.y,
                    object1Location.z
                );

                objectGeometry.vertices[1] = new THREE.Vector3(
                    object2Location.x,
                    object2Location.y,
                    object2Location.z
                );

                objectGeometry.verticesNeedUpdate = true;
            }
        },
        function () {
            universe.draw(this.id, line, false);
        }
    );

    return lineGraphicsObject;
};