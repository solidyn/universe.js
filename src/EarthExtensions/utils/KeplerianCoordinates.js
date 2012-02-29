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
    
    this.updateAnglesUsingTrueAnomaly =function()
    {
        /*
        double nu=Math.toRadians(this.TrueAnomaly);
        double sinEA=Math.sin(nu)*Math.sqrt(1-this.eccentricity*this.eccentricity)/(1+this.eccentricity*Math.cos(nu));
        double cosEA=(this.eccentricity+Math.cos(nu))/(1+this.eccentricity*Math.cos(nu));
        this.EccentricAnomaly=Math.toDegrees(Math.atan2(sinEA,cosEA));
        this.MeanAnomaly = Math.toDegrees(Math.toRadians(this.EccentricAnomaly) - this.eccentricity * sinEA);
        */
       var nu=MathTools.toRadians(this.trueAnomaly);
       var sinEA=Math.sin(nu)*Math.sqrt(1-this.eccentricity*this.eccentricity)/(1+this.eccentricity*Math.cos(nu));
       var cosEA=(this.eccentricity+Math.cos(nu))/(1+this.eccentricity*Math.cos(nu));
       this.EccentricAnomaly=MathTools.toDegrees(Math.atan2(sinEA,cosEA));
       this.MeanAnomaly = MathTools.toDegrees(MathTools.toRadians(this.EccentricAnomaly) - this.eccentricity * sinEA);
    }
    
    this.updateAnglesUsingMeanAnomaly= function()
    {
        /*
        //reference vallado 2nd ed page 74 (example 2-1)
        double requiredResolutionDeg=0.00001;//deg
        double currentError=5000.00;//deg
        double M=Math.toRadians(this.MeanAnomaly);//mean anomaly in radians
        double Eprevious=M-this.eccentricity;
        double Enew=0.0;
        int count=0;
        while(currentError>requiredResolutionDeg){
            Enew=Eprevious+(M-Eprevious+this.eccentricity*Math.sin(Eprevious))/(1-this.eccentricity*Math.cos(Eprevious));
            currentError=Math.abs(Enew-Eprevious);
            count++;
            if(count>100){
                break;
            }
            Eprevious=Enew;
        }
        this.EccentricAnomaly=Math.toDegrees(Enew);
        this.TrueAnomaly=Math.toDegrees(2*Math.atan(Math.sqrt((1+this.eccentricity)/(1-this.eccentricity))*Math.tan(Enew/2)));
        //System.out.println("Mean Anomaly: "+this.MeanAnomaly);
        //System.out.println("Ecc Anomaly: "+this.EccentricAnomaly);
        //System.out.println("True Anomaly: "+this.TrueAnomaly);
        */
       
        var requiredResolutionDeg=0.00001;//deg
        var currentError=5000.00;//deg
        var M=MathTools.toRadians(this.MeanAnomaly);//mean anomaly in radians
        var Eprevious=M-this.eccentricity;
        var Enew=0.0;
        var count=0;
        while(currentError>requiredResolutionDeg){
            Enew=Eprevious+(M-Eprevious+this.eccentricity*Math.sin(Eprevious))/(1-this.eccentricity*Math.cos(Eprevious));
            currentError=Math.abs(Enew-Eprevious);
            count++;
            if(count>100){
                break;
            }
            Eprevious=Enew;
        }
        this.EccentricAnomaly=MathTools.toDegrees(Enew);
        this.TrueAnomaly=MathTools.toDegrees(2*Math.atan(Math.sqrt((1+this.eccentricity)/(1-this.eccentricity))*Math.tan(Enew/2)));
        
    }
    
    
    
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
         this.updateAnglesUsingMeanAnomaly();
    }
    
    this.setEccentricAnomaly = function(theEccentricAnomaly)
    {
         this.eccentricAnomaly = theEccentricAnomaly;
    }
    
    this.setTrueAnomaly = function(theTrueAnomaly)
    {
         this.trueAnomaly = theTrueAnomaly;
         this.updateAnglesUsingTrueAnomaly();
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
         this.argOfPerigee = theArgOfPerigee;
    }
    
    this.setMeanMotion = function(theMeanMotion) {
         this.meanMotion = theMeanMotion;
    }
}