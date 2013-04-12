/*jslint browser: true, sloppy: true, nomen: true */
/*global Utilities */

// PropogationLine.js

/**
 *
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.PropogationLine = function (object, universe, earthExtensions, material, geometry) {
    var timeToPropogate = new Date(universe.getCurrentUniverseTime()),
        loopCount = 1440,
        eciLocations = [],
        j,
        location,
        convertedLocation,
        vector,
        lineS,
        lineGraphicsObject;

    // draw a vertex for each minute in a 24 hour period
    // dropped this to a vertex for every 5 minutes.  This seems to be about the max that you can use for a LEO
    // and still look decent.  HEOs and GEOs look fine with much greater spans.  For performance reasons, may want
    // to make this a param that can be set per vehicle
    for (j = 0; j < loopCount; j += 5) {
        location = object.propagator(timeToPropogate, false);
        eciLocations.push(location);
        convertedLocation = Utilities.eciTo3DCoordinates(location, earthExtensions);
        if (convertedLocation) {
            vector = new THREE.Vector3(convertedLocation.x, convertedLocation.y, convertedLocation.z);
            geometry.vertices.push(vector);
        }

        timeToPropogate.setMinutes(timeToPropogate.getMinutes() + 5);
    }

    lineS = new THREE.Line(geometry, material);

    lineGraphicsObject = new UNIVERSE.GraphicsObject(
        object.id + "_propogation",
        object.objectName,
        undefined,
        function (elapsedTime) {
            if (earthExtensions.lockCameraToWithEarthRotation) {
                var length = eciLocations.length,
                    i,
                    convertedLocation;
                for (i = 0; i < length; i += 1) {
                    convertedLocation = Utilities.eciTo3DCoordinates(eciLocations[i], earthExtensions);
                    if (convertedLocation && lineS.geometry.vertices[i]) {
                        lineS.geometry.vertices[i].position = {
                            x: convertedLocation.x,
                            y: convertedLocation.y,
                            z: convertedLocation.z
                        };
                    }
                }
                lineS.geometry.__dirtyVertices = true;
            }

        },
        function () {
            universe.draw(this.id, lineS, false);
        }
    );

    return lineGraphicsObject;
};
