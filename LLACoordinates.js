var llaCoordinates = {

    // define variables as <var name>: type = value

    latitude:  double = 0.0, //deg
    longitude: double = 0.0, //deg
    altitude:  double = 0.0,  //km

    /**
     * Returns the altitude value.
     */
    getAltitude: function()
    {
        return altitude;
    },

    /**
     * Sets a new altitude value.
     */
    setAltitude: function(newAltitude)
    {
        altitude = newAltitude;
    },

    /**
     * Returns the latitude value.
     */
    getLatitude: function()
    {
        return latitude;
    },

    /**
     * Sets a new latitude value.
     */
    setLatitude: function(newLatitude)
    {
        latitude = newLatitude;
    },

    /**
     * Returns the longitude value.
     */
    getLongitude: function()
    {
        return longitude;
    },

    /**
     * Sets a new longitude value.
     */
    setLongitude: function(setLongitude)
    {
        longitude = setLongitude;
    }
}