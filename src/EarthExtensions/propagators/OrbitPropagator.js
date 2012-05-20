 
var OrbitPropagator = {

    /**
     *
     * @param eci                      ECICoordinates
     * @param elapsedTime              double
     * @param dt                       double, time-step
     * @param timeAtStartOfPropagation Date
     *
     * @returns {UNIVERSE.ECICoordinates} 
     */
    propagateOrbit: function(eci, elapsedTime, dt, timeAtStartOfPropagation)
    {
        
        var kep = CoordinateConversionTools.convertECIToKeplerian(eci);
        //console.log('eccentricity: ' + JSON.stringify(kep.getEccentricity()));
        //timespan is in seconds
        if (elapsedTime === 0.0 || isNaN(kep.getEccentricity()))
        {
            return eci;
        }
        else if(kep.getEccentricity() <= 0.1) {
            return NearCircularPropagator.propagateOrbit(kep, elapsedTime, dt, timeAtStartOfPropagation);
        }
        else
        {
            return RungeKuttaFehlbergPropagator.propagateOrbit(eci, elapsedTime, dt, timeAtStartOfPropagation);
        }
    }
};