var rswCoordinates = {

    // define variables as <var name>: type = value

    radial:     double = 0.0, //radial vector (km)
    alongTrack: double = 0.0, //along track vector (km)
    crossTrack: double = 0.0, //cross track vector (km)

    /**
     * Returns the along track value.
     */
    getAlongTrack: function()
    {
        return alongTrack;
    },

    /**
     * Sets a new along track value.
     */
    setAlongTrack: function(newAlongTrack)
    {
        alongTrack = newAlongTrack;
    },

    /**
     * Returns the cross track value.
     */
    getCrossTrack: function()
    {
        return crossTrack;
    },

    /**
     * Sets a new cross track value.
     */
    setCrossTrack: function(newCrossTrack)
    {
        crossTrack = newCrossTrack;
    },

    /**
     * Returns the radial value.
     */
    getRadial: function()
    {
        return radial;
    },

    /**
     * Sets a new radial value.
     */
    setRadial: function(newRadial)
    {
        radial = newRadial;
    }
}