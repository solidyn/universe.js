var keplerianCoordinates = {

    // define variables as <var name>: type = value

    semimajorAxis:    double = 0.0, //km
    meanAnomaly:      double = 0.0, //deg
    eccentricAnomaly: double = 0.0,
    trueAnomaly:      double = 0.0,
    inclination:      double = 0.0, //deg
    eccentricity:     double = 0.0, //unitless
    raan:             double = 0.0, //deg
    argOfPerigee:     double = 0.0, //deg
    meanMotion:       double = 0.0, //deg/sec

    /**
     * Uses a true anomoly to update the eccentric anomoly and mean anomoly.
     */
    updateAnglesUsingTrueAnomaly: function()
    {
        var nu = Math.toRadians(trueAnomaly);
        var sinEA = Math.sin(nu) * Math.sqrt(1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(nu));
        var cosEA = (eccentricity + Math.cos(nu)) / (1 + eccentricity * Math.cos(nu));

        eccentricAnomaly = Math.toDegrees(Math.atan2(sinEA, cosEA));
        meanAnomaly = Math.toDegrees(Math.toRadians(eccentricAnomaly) - eccentricity * sinEA);
    },

    /**
     * Sets a new true anomoly and updates the eccentric and mean anomoly vals.
     */
    setTrueAnomaly: function(newTrueAnomaly)
    {
        trueAnomaly = newTrueAnomaly;
        updateAnglesUsingTrueAnomaly();
    },

    /**
     * Returns the eccentric anomoly value.
     */
    getEccentricAnomaly: function()
    {
        return eccentricAnomaly;
    },

    /**
     * Sets a new eccentric anomoly value.
     */
    setEccentricAnomaly: function(newEccentricAnomaly)
    {
        eccentricAnomaly = newEccentricAnomaly;
    },

    /**
     * Returns the true anomoly value.
     */
    getTrueAnomaly: function()
    {
        return trueAnomaly;
    },

    /**
     * Returns the argument of perigee value.
     */
    getArgOfPerigee: function()
    {
        return argOfPerigee;
    },

    /**
     * Sets a new argument of perigee value.
     */
    setArgOfPerigee: function(newArgOfPerigee)
    {
        argOfPerigee = newArgOfPerigee;
    },

    /**
     * Returns the eccentricity value.
     */
    getEccentricity: function()
    {
        return eccentricity;
    },

    /**
     * Sets a new eccentricity value.
     */
    setEccentricity: function(newEccentricity)
    {
        eccentricity = newEccentricity;
    },

    /**
     * Returns the inclination value.
     */
    getInclination: function()
    {
        return inclination;
    },

    /**
     * Sets a new inclination value.
     */
    setInclination: function(newInclination)
    {
        inclination = newInclination;
    },

    /**
     * Returns the mean motion value.
     */
    getMeanMotion: function()
    {
        return meanMotion;
    },

    /**
     * Sets a new mean motion value.
     */
    setMeanMotion: function(newMeanMotion)
    {
        meanMotion = newMeanMotion;
    },

    /**
     * Returns the right ascension of ascening node value.
     */
    getRaan: function()
    {
        return raan;
    },

    /**
     * Sets a new right ascension of ascending node value.
     */
    setRaan: function(newRaan)
    {
        raan = newRaan;
    },

    /**
     * Returns the semi major axis value.
     */
    getSemimajorAxis: function()
    {
        return semimajorAxis;
    },

    /**
     * Sets a new semi major axis value.
     */
    setSemimajorAxis: function(newSemimajorAxis)
    {
        semimajorAxis = newSemimajorAxis;
    },

    /**
     * Returns the mean anomoly value.
     */
    getMeanAnomaly: function()
    {
        return meanAnomaly;
    },

    /**
     * Sets a new mean anomoly value.
     */
    setMeanAnomaly: function(newMeanAnomaly)
    {
        meanAnomaly = newMeanAnomaly;
    }
}