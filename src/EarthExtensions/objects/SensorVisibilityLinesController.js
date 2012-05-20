// SensorVisibilityLinesController.js

/**
 *
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.SensorVisibilityLinesController = function(object, universe, earthExtensions) {
    var visibilityLinesController = new UNIVERSE.GraphicsObject(
        object.id + "_visibilityLines",
        object.objectName,
        undefined,
        function(elapsedTime) {
            if(earthExtensions.enableVisibilityLines) {
                var sensorLength = object.sensors.length;
						
                var graphicsObjects = universe.getGraphicsObjects();
                var objectsToDrawLinesTo = new Array();
                for(var i = 0; i < sensorLength; i++) {
                    var sensor = object.sensors[i];
                    for(var j in graphicsObjects) {
                        var obj = graphicsObjects[j];
                        //console.log("obj.id: " + obj.id + " obj.id: " + obj.obj + " object.modelName: " + obj.modelName);
                        //console.log("currentLocation: " + obj.currentLocation);
                        //console.log("obj: " + JSON.stringify(obj));
                        if ( obj.currentLocation != undefined && 
                            obj.modelName != "earth" && 
                            obj.modelName != "moon" && 
                            obj.modelName != "sun" && 
                            obj.id != object.id && 
                            obj.id.indexOf("_groundPoint") == -1 && 
                            obj.id.indexOf("_propagation") == -1 &&
                            obj.id.indexOf("_to_") == -1 && 
                            obj.id.indexOf("_visibility_") == -1)
                            {
                            // Now we're looking at a point 
                            //console.log(obj.id);
                            //var currentLocationInEci = Utilities.threeDToEciCoordinates(obj.currentLocation);
                            //var targetPosition = new UNIVERSE.ECICoordinates(currentLocationInEci.x, currentLocationInEci.y, currentLocationInEci.z, 0,0,0,0,0,0);	
                            //var targetPosition = new UNIVERSE.ECICoordinates(-obj.currentLocation.x, obj.currentLocation.z, obj.currentLocation.y, 0,0,0,0,0,0);	
                            var inView = sensor.checkSensorVisibilityOfTargetPoint(object, obj.currentLocation );
                            //console.log('VISIBILITY CHECK [' + object.objectName + ":" + sensor.name + ']  to '+ obj.modelName + " inview: " + inView);
                            if(!objectsToDrawLinesTo[obj.id]) {
                                objectsToDrawLinesTo[obj.id] = inView;
                            }
                        }
                    }
                }

                for(var k in objectsToDrawLinesTo) {
                    if(objectsToDrawLinesTo[k] ) {
                        if(universe.getGraphicsObjectById(object.id + "_visibility_" + k) == undefined)
                        {
                            //console.log("adding line for object: " + object.id + " and " + k);
                            earthExtensions.addLineBetweenObjects(object.id, k, undefined, "_visibility_");	
                        //universe.updateOnce();
                        }
                        else {
                        //console.log("line already there for: " + k);
                        }
                    }
                    else {
                        earthExtensions.removeLineBetweenObjects(object.id, k, "_visibility_");
                    }
                //console.log("finished: " + k);
                }

						
            }
            earthExtensions.showAllSensorVisibilityLines(earthExtensions.enableVisibilityLines);
					
        },
        function() {
        // nothing to draw, this is a controller
        }
    )
    
    return visibilityLinesController;
}