var ECEFCoordinates = {

    // define variables as <var name>: <value>

    x:  0.0, //km
    y:  0.0, //km
    z:  0.0, //km
    vx: 0.0, //km/s
    vy: 0.0, //km/s
    vz: 0.0, //km/s
    ax: 0.0, //km/s2
    ay: 0.0, //km/s2
    az: 0.0, //km/s2

    /**
     * Get the X value.
     */
    getX: function()
    {
        return x;
    },

    /**
     * Set the X value.
     */
    setX: function(newX)
    {
        x = newX;
    },

    /**
     * Get the Y value.
     */
    getY: function()
    {
        return y;
    },

    /**
     * Set the Y value.
     */
    setY: function(newY)
    {
        y = newY;
    },

    /**
     * Get the Z value.
     */
    getZ: function()
    {
        return z;
    },

    /**
     * Set the Z value.
     */
    setZ: function(newZ)
    {
        z = newZ;
    },

   /**
     * Get the VX value.
     */
    getVX: function()
    {
        return vx;
    },

    /**
     * Set the VX value.
     */
    setVX: function(newVX)
    {
        vx = newVX;
    },

    /**
     * Get the VY value.
     */
    getVY: function()
    {
        return vy;
    },

    /**
     * Set the VY value.
     */
    setVY: function(newVY)
    {
        vy = newVY;
    },

    /**
     * Get the VZ value.
     */
    getVZ: function()
    {
        return vz;
    },

    /**
     * Set the VZ value.
     */
    setVZ: function(newVZ)
    {
        vz = newVZ;
    },

    /**
     * Get the AX value.
     */
    getAX: function()
    {
        return ax;
    },

    /**
     * Set the AX value.
     */
    setAX: function(newAX)
    {
        ax = newAX;
    },

    /**
     * Get the AY value.
     */
    getAY: function()
    {
        return ay;
    },

    /**
     * Set the AY value.
     */
    setAY: function(newAY)
    {
        ay = newAY;
    },

    /**
     * Get the AZ value.
     */
    getAZ: function()
    {
        return az;
    },

    /**
     * Set the AZ value.
     */
    setAZ: function(newAZ)
    {
        az = newAZ;
    }
}