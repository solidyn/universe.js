var CoordinateFunctionHelper = {

    /**
     * Uses a true anomoly to update the eccentric anomoly and mean anomoly.
     */
    updateKeplerianAnglesUsingTrueAnomaly: function(keplerianCoords)
    {
        var nu = MathTools.toRadians(trueAnomaly);
        var sinEA = Math.sin(nu) * Math.sqrt(1 - keplerianCoords.eccentricity * keplerianCoords.eccentricity) /
            (1 + keplerianCoords.eccentricity * Math.cos(nu));
        var cosEA = (keplerianCoords.eccentricity + Math.cos(nu)) /
            (1 + keplerianCoords.eccentricity * Math.cos(nu));

        keplerianCoords.eccentricAnomaly = MathTools.toDegrees(Math.atan2(sinEA, cosEA));
        keplerianCoords.meanAnomaly = MathTools.toDegrees(MathTools.toRadians(keplerianCoords.eccentricAnomaly) -
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