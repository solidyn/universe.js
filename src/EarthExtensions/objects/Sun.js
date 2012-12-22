/*jslint browser: true, sloppy: true*/
/*global UNIVERSE, CoordinateConversionTools, Utilities */

UNIVERSE.Sun = function (universe, earthExtensions) {
    var sunGraphicsObject = new UNIVERSE.GraphicsObject(
        "sun",
        "sun",
        undefined,
        function (elapsedTime) {
            var sunLocation = CoordinateConversionTools.getSunPositionECIAtCurrentTime(universe.getCurrentUniverseTime()),
            //console.log("sun location: " + JSON.stringify(sunLocation));
                convertedLocation = Utilities.eciTo3DCoordinates({
                    x: sunLocation.x,
                    y: sunLocation.y,
                    z: sunLocation.z
                }, earthExtensions);

            universe.updateLight(convertedLocation.x, convertedLocation.y, convertedLocation.z, 1.5);
            this.currentLocation = sunLocation;
        },
        function () {
            //console.log("sun draw");
            universe.draw(this.id, undefined, false);
        }
    );
    return sunGraphicsObject;
};

