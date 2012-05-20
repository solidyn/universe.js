UNIVERSE.Sun = function(universe, earthExtensions) {
    var sunGraphicsObject = new UNIVERSE.GraphicsObject(
        "sun",
        "sun",
        undefined,
        function(elapsedTime) {
            //console.log("sun update");
            var sunLocation = CoordinateConversionTools.getSunPositionECIAtCurrentTime(universe.getCurrentUniverseTime());
            //console.log("sun location: " + JSON.stringify(sunLocation));
            var convertedLocation = Utilities.eciTo3DCoordinates({
                x: sunLocation.x, 
                y: sunLocation.y, 
                z: sunLocation.z
            }, earthExtensions);
            //sunLight.position.set({x: sunLocation.x, y: sunLocation.y, z: sunLocation.z});
            //console.log("sunLocation: " + JSON.stringify(sunLocation));
            universe.updateLight(convertedLocation.x, convertedLocation.y, convertedLocation.z, 1.5);
            this.currentLocation = sunLocation;
        },
        function() {
            //console.log("sun draw");
            universe.draw(this.id, undefined, false);
        }
    );
        
    return sunGraphicsObject;
};

