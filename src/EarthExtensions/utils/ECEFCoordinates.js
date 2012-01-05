var UNIVERSE = UNIVERSE || {};

UNIVERSE.ECEFCoordinates = function(xVal, yVal, zVal, vxVal, vyVal, vzVal, axVal, ayVal, azVal)  {

    // define variables as <var name>: <value>

    this.x = xVal ? xVal : 0.0, //km
    this.y =  yVal ? yVal : 0.0, //km
    this.z =  zVal ? zVal : 0.0, //km
    this.vx = vxVal ? vxVal : 0.0, //km
    this.vy = vyVal ? vyVal : 0.0, //km
    this.vz = vzVal ? vzVal : 0.0, //km
    this.ax = axVal ? axVal : 0.0, //km
    this.ay = ayVal ? ayVal : 0.0, //km
    this.az = azVal ? azVal : 0.0 //km

   /**
     * Get the X value.
     */
    this.getX = function()
    {
        return this.x;
    }

    /**
     * Set the X value.
     */
    this.setX = function(newX)
    {
        this.x = newX;
    }

    /**
     * Get the Y value.
     */
    this.getY = function()
    {
        return this.y;
    }

    /**
     * Set the Y value.
     */
    this.setY = function(newY)
    {
        this.y = newY;
    }

    /**
     * Get the Z value.
     */
    this.getZ = function()
    {
        return this.z;
    }

    /**
     * Set the Z value.
     */
    this.setZ = function(newZ)
    {
        this.z = newZ;
    }

   /**
     * Get the VX value.
     */
    this.getVX = function()
    {
        return this.vx;
    }

    /**
     * Set the VX value.
     */
    this.setVX = function(newVX)
    {
        this.vx = newVX;
    }

    /**
     * Get the VY value.
     */
    this.getVY = function()
    {
        return this.vy;
    }

    /**
     * Set the VY value.
     */
    this.setVY = function(newVY)
    {
        this.vy = newVY;
    }

    /**
     * Get the VZ value.
     */
    this.getVZ = function()
    {
        return this.vz;
    }

    /**
     * Set the VZ value.
     */
    this.setVZ = function(newVZ)
    {
        this.vz = newVZ;
    }

    /**
     * Get the AX value.
     */
    this.getAX = function()
    {
        return this.ax;
    }

    /**
     * Set the AX value.
     */
    this.setAX = function(newAX)
    {
        this.ax = newAX;
    }

    /**
     * Get the AY value.
     */
    this.getAY = function()
    {
        return this.ay;
    }

    /**
     * Set the AY value.
     */
    this.setAY = function(newAY)
    {
        this.ay = newAY;
    }

    /**
     * Get the AZ value.
     */
    this.getAZ = function()
    {
        return this.az;
    }

    /**
     * Set the AZ value.
     */
    this.setAZ = function(newAZ)
    {
        this.az = newAZ;
    }
};