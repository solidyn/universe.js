// PropogationLine.js

/**
 *
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.PropogationLine = function(object, universe, earthExtensions, material, geometry) {
    
    var timeToPropogate = new Date(universe.getCurrentUniverseTime());
    var loopCount = 1440;

    var eciLocations = new Array();

    // draw a vertex for each minute in a 24 hour period
    // dropped this to a vertex for every 5 minutes.  This seems to be about the max that you can use for a LEO
    // and still look decent.  HEOs and GEOs look fine with much greater spans.  For performance reasons, may want
    // to make this a param that can be set per vehicle
    for(var j = 0; j < loopCount; j += 5) {
        var location = object.propagator(timeToPropogate, false);
        eciLocations.push(location);
        var convertedLocation = earthExtensions.eciTo3DCoordinates(location);
        if(convertedLocation != undefined) {
            var vector = new THREE.Vector3(convertedLocation.x, convertedLocation.y, convertedLocation.z);
            geometry.vertices.push(new THREE.Vertex(vector));
        }

        timeToPropogate.setMinutes(timeToPropogate.getMinutes() + 5);
    }

    var lineS = new THREE.Line(geometry, material);

    var lineGraphicsObject = new UNIVERSE.GraphicsObject(
        object.id + "_propogation",
        object.objectName,
        undefined,
        function(elapsedTime) {
            if(earthExtensions.lockCameraToWithEarthRotation) {
                var length = eciLocations.length;
                for(var i = 0; i < length; i++) {
                    var convertedLocation = earthExtensions.eciTo3DCoordinates(eciLocations[i]);
                    if(convertedLocation != undefined && lineS.geometry.vertices[i] != undefined) {
                        lineS.geometry.vertices[i].position = {
                            x: convertedLocation.x, 
                            y: convertedLocation.y, 
                            z: convertedLocation.z
                        }
                    }
                }
                lineS.geometry.__dirtyVertices = true;
            }

        },
        function() {
            universe.draw(this.id, lineS, false);
        }
    );
        
    return lineGraphicsObject;
}