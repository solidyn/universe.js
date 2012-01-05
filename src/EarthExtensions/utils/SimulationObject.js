var SimulationObject = {

    // define variables as <var name>: value

    name:         "",
    eciCoords:    UNIVERSE.ECICoordinates,
    ecefCoords:   UNIVERSE.ECEFCoordinates,
    keplerCoords: KeplerianCoordinates,
    llaCoords:    UNIVERSE.LLACoordinates,
    sensorList:   new Array(),

    /**
     * Returns the Ecef Coordinates of this object.
     */
    getEcefCoordinates: function()
    {
        return ecefCoords;
    },

    /**
     * Sets the Ecef Coordinates of this object.
     */
    setEcefCoordinates: function(newEcefCoords)
    {
        ecefCoords = newEcefCoords;
    },

    /**
     * Returns the Eci Coordinates of this object.
     */
    getEciCoordinates: function()
    {
        return eciCoords;
    },

    /**
     * Sets the Eci Coordinates of this object.
     */
    setEciCoordinates: function(newEciCoords)
    {
        eciCoords = newEciCoords;
    },

    /**
     * Returns the Keplerian Coordinates of this object.
     */
    getKeplerianCoordinates: function()
    {
        return keplerCoords;
    },

    /**
     * Sets the Keplerian Coordinates of this object.
     */
    setKeplerianCoordinates: function(newKeplerCoords)
    {
        kepler = newKeplerCoords;
    },

    /**
     *  Returns the Lla Coordinates of this object.
     */
    getLlaCoordinates: function()
    {
        return llaCoords;
    },

    /**
     * Sets the Lla Coordinates of this object.
     */
    setLlaCoordinates: function(newLlaCoords)
    {
        lla = newLlaCoords;
    },

    /**
     * Returns the name of this object.
     */
    getName: function()
    {
        return name;
    },

    /**
     * Sets the name of this object.
     */
    setName: function(name)
    {
        this.name = name;
    },

    /**
     * Returns the Sesnors for this object.
     */
    getSensors: function()
    {
        return sensors;
    },

    /**
     * Sets the sensors for this object.
     */
    setSensors: function(newSensorList)
    {
        sensorList = newSensorList;
    },

    /**
     * Propagates the state of a Simulation object.
     *
     * @param timeToPropagate          double
     * @param dt                       double
     * @param timeAtStartOfPropagation date
     */
    propagateState: function(timeToPropagate, dt, timeAtStartOfPropagation)
    {
        eciCoords = OrbitPropagator.propagateOrbit(eci, timeToPropagate,dt, timeAtStartOfPropagation);
        keplerCoords = CoordinateConversionTools.convertECIToKeplerian(eci);

        //calculate the greenwich hour angle from the current time plus the elapsed time 'dt'
        var newMilliseconds = (timeAtStartOfPropagation.getTime() +
            (timeToPropagate * 1000.0));         //long
        var simTime = new Date(newMilliseconds); //Date
        var GST = CoordinateConversionTools.convertTimeToGMST(simTime); //double

        //calculate the ECEF and LLA coordinates based upon the new ECI coordinates
        ecefCoords = CoordinateConversionTools.convertECItoECEF(eci, GST);
        llaCoords = CoordinateConversionTools.convertECItoLLA(eci, GST);
    }
};