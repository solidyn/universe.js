var CoordinateFunctionHelper = {

    /**
     * Uses a true anomoly to update the eccentric anomoly and mean anomoly.
     */
    updateKeplerianAnglesUsingTrueAnomaly: function(keplerianCoords)
    {
        var nu = Math.toRadians(trueAnomaly);
        var sinEA = Math.sin(nu) * Math.sqrt(1 - keplerianCoords.eccentricity * keplerianCoords.eccentricity) /
            (1 + keplerianCoords.eccentricity * Math.cos(nu));
        var cosEA = (keplerianCoords.eccentricity + Math.cos(nu)) /
            (1 + keplerianCoords.eccentricity * Math.cos(nu));

        keplerianCoords.eccentricAnomaly = Math.toDegrees(Math.atan2(sinEA, cosEA));
        keplerianCoords.meanAnomaly = Math.toDegrees(Math.toRadians(keplerianCoords.eccentricAnomaly) -
            keplerianCoords.eccentricity * sinEA);
    },

    /**
     * Sets a new true anomoly and updates the eccentric and mean anomoly vals.
     */
    setKeplerianTrueAnomaly: function(keplerianCoords, newTrueAnomaly)
    {
        keplerianCoords.trueAnomaly = newTrueAnomaly;
        updateAnglesUsingTrueAnomaly(keplerianCoords);
    }
};