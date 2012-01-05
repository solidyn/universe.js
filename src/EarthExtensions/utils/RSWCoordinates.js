var UNIVERSE = UNIVERSE || {};

UNIVERSE.RSWCoordinates = function(radial, alongTrack, crossTrack) {
 
    // define variables as <var name>: <value>

    this.radial = radial ? radial : 0.0; //radial vector (km)
    this.alongTrack = alongTrack ? alongTrack : 0.0; //along track vector (km)
    this.crossTrack = crossTrack ? crossTrack : 0.0; //cross track vector (km)

    /**
     * Get the radial value.
     */
    this.getRadial = function()
    {
        return this.radial;
    }

    /**
     * Set the radial value.
     */
    this.setRadial = function(radial)
    {
        this.radial = radial;
    }

    /**
     * Get the alongTrack value.
     */
    this.getAlongTrack = function()
    {
        return this.alongTrack;
    }

    /**
     * Set the alongTrack value.
     */
    this.setAlongTrack = function(alongTrack)
    {
        this.alongTrack = alongTrack;
    }

    /**
     * Get the crossTrack value.
     */
    this.getCrossTrack = function()
    {
        return this.crossTrack;
    }

    /**
     * Set the crossTrack value.
     */
    this.setCrossTrack = function(crossTrack)
    {
        this.crossTrack = crossTrack;
    }
};