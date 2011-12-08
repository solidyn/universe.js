
function LLACoordinates(lat, lon, alt) {

    // define variables as <var name>: <value>

    this.latitude =  lat ? lat : 0.0, //deg
    this.longitude = lon ? lon : 0.0, //deg
    this.altitude =  alt ? alt : 0.0  //km

    /**
     * Returns the altitude value.
     */
    this.getAltitude = function()
    {
        return this.altitude;
    }

    /**
     * Sets a new altitude value.
     */
    this.setAltitude = function(newAltitude)
    {
        this.altitude = newAltitude;
    }

    /**
     * Returns the latitude value.
     */
    this.getLatitude = function()
    {
        return this.latitude;
    }

    /**
     * Sets a new latitude value.
     */
    this.setLatitude = function(newLatitude)
    {
        this.latitude = newLatitude;
    }

    /**
     * Returns the longitude value.
     */
    this.getLongitude = function()
    {
        return this.longitude;
    }

    /**
     * Sets a new longitude value.
     */
    this.setLongitude = function(setLongitude)
    {
        this.longitude = setLongitude;
    }
}