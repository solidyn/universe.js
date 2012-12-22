/*jslint browser: true, sloppy: true, nomen: true */
/*global THREE */

// SensorVisibilityLinesController.js

var UNIVERSE = UNIVERSE || {};

UNIVERSE.SensorVisibilityLinesController = function (object, universe, earthExtensions) {
    var visibilityLinesController = new UNIVERSE.GraphicsObject(
        object.id + "_visibilityLines",
        object.objectName,
        undefined,
        function (elapsedTime) {
            if (earthExtensions.enableVisibilityLines) {
                var sensorLength = object.sensors.length,
                    graphicsObjects = universe.getGraphicsObjects(),
                    objectsToDrawLinesTo = [],
                    i,
                    j,
                    k,
                    sensor,
                    obj,
                    inView;
                for (i = 0; i < sensorLength; i += 1) {
                    sensor = object.sensors[i];
                    for (j in graphicsObjects) {
                        obj = graphicsObjects[j];
                        if (obj.currentLocation !== undefined &&
                                obj.modelName !== "earth" &&
                                obj.modelName !== "moon" &&
                                obj.modelName !== "sun" &&
                                obj.id !== object.id &&
                                obj.id.indexOf("_groundPoint") === -1 &&
                                obj.id.indexOf("_propagation") === -1 &&
                                obj.id.indexOf("_to_") === -1 &&
                                obj.id.indexOf("_visibility_") === -1) {
                            // Now we're looking at a point 

                            inView = sensor.checkSensorVisibilityOfTargetPoint(object, obj.currentLocation);

                            if (!objectsToDrawLinesTo[obj.id]) {
                                objectsToDrawLinesTo[obj.id] = inView;
                            }
                        }
                    }
                }

                for (k in objectsToDrawLinesTo) {
                    if (objectsToDrawLinesTo[k]) {
                        if (universe.getGraphicsObjectById(object.id + "_visibility_" + k) === undefined) {
                            //console.log("adding line for object: " + object.id + " and " + k);
                            earthExtensions.addLineBetweenObjects(object.id, k, undefined, "_visibility_");
                        //universe.updateOnce();
                        }
                    } else {
                        earthExtensions.removeLineBetweenObjects(object.id, k, "_visibility_");
                    }
                //console.log("finished: " + k);
                }
            }
            earthExtensions.showAllSensorVisibilityLines(earthExtensions.enableVisibilityLines);
        },
        function () {
        // nothing to draw, this is a controller
        }
    );

    return visibilityLinesController;
};