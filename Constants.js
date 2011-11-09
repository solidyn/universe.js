var constants = {

    // define variables as <var name>: type = value

    radiusEarth:    double = 6378.1363, //km
    muEarth:        double = 398600.4418, //km3/s2
    pi:             double = 3.1415926535897932384626433,
    eccEarthSphere: double = 0.081819221456, //vallado page 141


    /**
     *
     */
    getMuEarth: function()
    {
        return muEarth;
    },

    /**
     *
     */
    setMuEarth: function(muEarth)
    {
        this.muEarth = muEarth;
    },

    /**
     *
     */
    getPi: function()
    {
        return pi;
    },

    /**
     *
     */
    getRadiusEarth: function()
    {
        return radiusEarth;
    },

    /**
     *
     */
    getEccEarthSphere: function()
    {
        return eccEarthSphere;
    }
}