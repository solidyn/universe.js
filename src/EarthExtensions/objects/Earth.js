/*jslint browser: true, sloppy: true */
/*global UNIVERSE, THREE, Constants, CoordinateConversionTools, MathTools */
/** 
    The Earth positioned at the center of the Universe
    @constructor
    @param {UNIVERSE.Universe} universe - A Universe instance to draw the Earth in
    @param {UNIVERSE.EarthExtensions} earthExtensions - An EarthExtensions instance to draw the Earth with
    @param {URL} dayImageURL - Image to be used for the day-side of the Earth
    @param {URL} nightImageURL - Image to be used for the night-side of the Earth
 */

UNIVERSE.Earth = function (universe, earthExtensions, dayImageURL, nightImageURL) {
    var earthSphereSegments = 40,
        earthSphereRings = 30,

    // Create the sphere
        geometry = new THREE.SphereGeometry(Constants.radiusEarth, earthSphereSegments, earthSphereRings),
        dayImageTexture   = THREE.ImageUtils.loadTexture(dayImageURL),
        earthAtNightTexture = THREE.ImageUtils.loadTexture(nightImageURL),
        nightMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            overdraw: true,
            map: earthAtNightTexture,
            blending: THREE.AdditiveBlending
        }),

        nightEarthMesh = new THREE.Mesh(geometry, nightMaterial),

        dayMaterial = new THREE.MeshPhongMaterial({
            map: dayImageTexture,
            color: 0xffffff,
            // specular: 0xffffff,
            //ambient: 0xffffff,
            // shininess: 15,
            //opacity: 0.5,
            transparent: true,
            // reflectivity: 1
            blending: THREE.AdditiveBlending
        }),

        dayEarthMesh = new THREE.Mesh(geometry, dayMaterial),

        earthMaterial = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            overdraw: true,
            map: dayImageTexture,
            blending: THREE.AdditiveBlending
        }),

        earthMesh = new THREE.Mesh(geometry, earthMaterial),

        previousRotation = CoordinateConversionTools.convertTimeToGMST(universe.getCurrentUniverseTime()),

        earthObject = new UNIVERSE.GraphicsObject(
            "earth",
            "earth",
            {
                x: 0,
                y: 0,
                z: 0
            },
            function (elapsedTime) {
                var rotationAngle = MathTools.toRadians(CoordinateConversionTools.convertTimeToGMST(universe.getCurrentUniverseTime()));

                // TODO: This works ok with low-speed and low number of objects, not good with high speed or large number of objects
                // Idea to fix it:
                // Leave the camera where it is and turn on/off rotating the earth
                // This will require that each will have to be converted from ECI to a rotated ECI location
                // This can be buryied in the eciTo3DCoordinates method and should work so long as the math isn't overly intensive
                // since it will be called A LOT

                if (earthExtensions.lockCameraToWithEarthRotation) {
                    // move camera along with Earth
                    //universe.addRotationToCamera(rotationAngle - previousRotation);
                    earthExtensions.rotationOffsetFromXAxis += (rotationAngle - previousRotation);
                    if (earthExtensions.rotationOffsetFromXAxis > (2 * Math.PI)) {
                        earthExtensions.rotationOffsetFromXAxis -= (2 * Math.PI);
                    }
                } else {
                    dayEarthMesh.rotation.y = rotationAngle - earthExtensions.rotationOffsetFromXAxis;
                    nightEarthMesh.rotation.y = rotationAngle - earthExtensions.rotationOffsetFromXAxis;
                    earthMesh.rotation.y = rotationAngle - earthExtensions.rotationOffsetFromXAxis;
                }

                previousRotation = rotationAngle;
            },
            function () {
                // for some reason these lines have to go in this order for night to be under day...
                universe.draw(this.id + "_day", dayEarthMesh, false);
                universe.draw(this.id + "_night", nightEarthMesh, false);
                universe.draw(this.id, earthMesh, false);
                earthExtensions.setSunLighting(earthExtensions.useSunLighting);

            }
        );

    return earthObject;
};