UNIVERSE.Moon = function(universe, earthExtensions, moonImageURL) {

    var moonSphereSegments = 40, moonSphereRings = 30;
    var moonSphereRadius = 1737.1;

    // Create the sphere
    var geometry = new THREE.SphereGeometry(moonSphereRadius, moonSphereSegments, moonSphereRings);

    var moonTexture = THREE.ImageUtils.loadTexture(moonImageURL);

    var dayMaterial = new THREE.MeshPhongMaterial({
        map: moonTexture,
        color: 0xffffff,
        // specular: 0xffffff,
        //ambient: 0xffffff,
        // shininess: 15,
        //opacity: 0.5,
        transparent: true,
        // reflectivity: 1
        blending: THREE.AdditiveBlending
    });

    var dayMoonMesh = new THREE.Mesh(geometry, dayMaterial);

    var moonMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        overdraw: true,
        map: moonTexture,
        blending: THREE.AdditiveBlending
    });

    var moonMesh = new THREE.Mesh(geometry, moonMaterial);

    var moonObject = new UNIVERSE.GraphicsObject(
        "moon", 
        "moon",
        undefined,
        function(elapsedTime) {
            var time = new Date(universe.getCurrentUniverseTime());
            var propagatedValue = CoordinateConversionTools.getMoonPositionECIAtCurrentTime(time);
            var convertedLocation = earthExtensions.eciTo3DCoordinates({
                x: propagatedValue.x, 
                y: propagatedValue.y, 
                z: propagatedValue.z
            });
            dayMoonMesh.position = {
                x: convertedLocation.x, 
                y: convertedLocation.y, 
                z: convertedLocation.z
            }; 
            moonMesh.position = {
                x: convertedLocation.x, 
                y: convertedLocation.y, 
                z: convertedLocation.z
            };
            this.currentLocation = propagatedValue;
        },
        function() {
            universe.draw(this.id + "_day", dayMoonMesh, false);
            universe.draw(this.id, moonMesh, false);
            earthExtensions.setSunLighting(earthExtensions.useSunLighting);
        }
    );
    return moonObject;
};