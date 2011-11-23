function KeplerianCoordinates(theSemimajorAxis, theMeanAnomaly, theEccentricAnomaly, theTrueAnomaly, theInclination, theEccentricity, theRaan, theArgOfPerigee, theMeanMotion) {

    this.semimajorAxis = theSemimajorAxis ? theSemimajorAxis : 0.0, //km
    this.meanAnomaly = theMeanAnomaly ? theMeanAnomaly : 0.0,
    this.eccentricAnomaly = theMeanAnomaly ? theMeanAnomaly : 0.0,
    this.trueAnomaly = theTrueAnomaly ? theTrueAnomaly : 0.0,
    this.inclination = theInclination ? theInclination : 0.0, //deg
    this.eccentricity = theEccentricity ? theEccentricity : 0.0, //unitless
    this.raan = theRaan ? theRaan : 0.0, //deg
    this.argOfPerigee = theArgOfPerigee ? theArgOfPerigee : 0.0, //deg
    this.meanMotion = theMeanMotion ? theMeanMotion : 0.0 //deg/sec
    
    this.getSemimajorAxis = function()
    {
        return this.semimajorAxis;
    }
    
    this.getMeanAnomaly = function()
    {
        return this.meanAnomaly;
    }

    this.getEccentricAnomaly = function()
    {
        return this.eccentricAnomaly;
    }
    
    this.getTrueAnomaly = function()
    {
        return this.trueAnomaly;
    }

    this.getInclination = function()
    {
        return this.inclination;
    }
    
    this.getEccentricity = function()
    {
        return this.eccentricity;
    }
    
    this.getRaan = function() {
        return this.raan;
    }
    
    this.getArgOfPerigee = function() {
        return this.argOfPerigee;
    }
    
    this.getMeanMotion = function() {
        return this.meanMotion;
    }

    // setters
    this.setSemimajorAxis = function(theSemimajorAxis)
    {
         this.semimajorAxis = theSemimajorAxis;
    }
    
    this.setMeanAnomaly = function(theMeanAnomaly)
    {
         this.meanAnomaly = theMeanAnomaly;
    }

    this.setEccentricAnomaly = function(theEccentricAnomaly)
    {
         this.eccentricAnomaly = theEccentricAnomaly;
    }
    
    this.setTrueAnomaly = function(theTrueAnomaly)
    {
         this.trueAnomaly = theTrueAnomaly;
    }

    this.setInclination = function(theInclination)
    {
         this.inclination = theInclination;
    }
    
    this.setEccentricity = function(theEccentricity)
    {
         this.eccentricity = theEccentricity;
    }
    
    this.setRaan = function(theRaan) {
         this.raan = theRaan;
    }
    
    this.setArgOfPerigee = function(theArgOfPerigee) {
         this.argOfPerigee;
    }
    
    this.setMeanMotion = function(theMeanMotion) {
         this.meanMotion;
    }
}