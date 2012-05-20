var UNIVERSE = UNIVERSE || {};

UNIVERSE.ECICoordinates = function(xVal, yVal, zVal, vxVal, vyVal, vzVal, axVal, ayVal, azVal) {
    
    // define variables as <var name>: <value>

    this.x = xVal ? xVal : 0.0; //km
    this.y =  yVal ? yVal : 0.0; //km
    this.z =  zVal ? zVal : 0.0; //km
    this.vx = vxVal ? vxVal : 0.0; //km
    this.vy = vyVal ? vyVal : 0.0; //km
    this.vz = vzVal ? vzVal : 0.0; //km
    this.ax = axVal ? axVal : 0.0; //km
    this.ay = ayVal ? ayVal : 0.0; //km
    this.az = azVal ? azVal : 0.0; //km
};

UNIVERSE.ECICoordinates.prototype = {
    constructor: UNIVERSE.ECICoordinates,
    
    /**
     * Get the X value.
     */
    getX: function()
    {
        return this.x;
    },

    /**
     * Set the X value.
     */
    setX : function(newX)
    {
        this.x = newX;
    },

    /**
     * Get the Y value.
     */
    getY : function()
    {
        return this.y;
    },

    /**
     * Set the Y value.
     */
    setY : function(newY)
    {
        this.y = newY;
    },

    /**
     * Get the Z value.
     */
    getZ : function()
    {
        return this.z;
    },

    /**
     * Set the Z value.
     */
    setZ : function(newZ)
    {
        this.z = newZ;
    },

   /**
     * Get the VX value.
     */
    getVX : function()
    {
        return this.vx;
    },

    /**
     * Set the VX value.
     */
    setVX : function(newVX)
    {
        this.vx = newVX;
    },

    /**
     * Get the VY value.
     */
    getVY : function()
    {
        return this.vy;
    },

    /**
     * Set the VY value.
     */
    setVY : function(newVY)
    {
        this.vy = newVY;
    },

    /**
     * Get the VZ value.
     */
    getVZ : function()
    {
        return this.vz;
    },

    /**
     * Set the VZ value.
     */
    setVZ : function(newVZ)
    {
        this.vz = newVZ;
    },

    /**
     * Get the AX value.
     */
    getAX : function()
    {
        return this.ax;
    },

    /**
     * Set the AX value.
     */
    setAX : function(newAX)
    {
        this.ax = newAX;
    },

    /**
     * Get the AY value.
     */
    getAY : function()
    {
        return this.ay;
    },

    /**
     * Set the AY value.
     */
    setAY : function(newAY)
    {
        this.ay = newAY;
    },

    /**
     * Get the AZ value.
     */
    getAZ : function()
    {
        return this.az;
    },

    /**
     * Set the AZ value.
     */
    setAZ : function(newAZ)
    {
        this.az = newAZ;
    }
};