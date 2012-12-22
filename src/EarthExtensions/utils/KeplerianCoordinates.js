/*jslint browser: true, sloppy: true */
/*global MathTools */

function KeplerianCoordinates(theSemimajorAxis, theMeanAnomaly, theEccentricAnomaly, theTrueAnomaly, theInclination, theEccentricity, theRaan, theArgOfPerigee, theMeanMotion) {

    this.semimajorAxis = theSemimajorAxis || 0.0; //km
    this.meanAnomaly = theMeanAnomaly || 0.0;
    this.eccentricAnomaly = theMeanAnomaly || 0.0;
    this.trueAnomaly = theTrueAnomaly || 0.0;
    this.inclination = theInclination || 0.0; //deg
    this.eccentricity = theEccentricity || 0.0; //unitless
    this.raan = theRaan || 0.0; //deg
    this.argOfPerigee = theArgOfPerigee || 0.0; //deg
    this.meanMotion = theMeanMotion || 0.0; //deg/sec

    this.updateAnglesUsingTrueAnomaly = function () {
        var nu = MathTools.toRadians(this.trueAnomaly),
            sinEA = Math.sin(nu) * Math.sqrt(1 - this.eccentricity * this.eccentricity) / (1 + this.eccentricity * Math.cos(nu)),
            cosEA = (this.eccentricity + Math.cos(nu)) / (1 + this.eccentricity * Math.cos(nu));

        this.EccentricAnomaly = MathTools.toDegrees(Math.atan2(sinEA, cosEA));
        this.MeanAnomaly = MathTools.toDegrees(MathTools.toRadians(this.EccentricAnomaly) - this.eccentricity * sinEA);
    };

    this.updateAnglesUsingMeanAnomaly = function () {
        /*
          reference vallado 2nd ed page 74 (example 2-1)
        */

        var requiredResolutionDeg = 0.00001,//deg
            currentError = 5000.00,//deg
            M = MathTools.toRadians(this.MeanAnomaly),//mean anomaly in radians
            Eprevious = M - this.eccentricity,
            Enew = 0.0,
            count = 0;

        while (currentError > requiredResolutionDeg) {
            Enew = Eprevious + (M - Eprevious + this.eccentricity * Math.sin(Eprevious)) / (1 - this.eccentricity * Math.cos(Eprevious));
            currentError = Math.abs(Enew - Eprevious);
            count += 1;
            if (count > 100) {
                break;
            }
            Eprevious = Enew;
        }
        this.EccentricAnomaly = MathTools.toDegrees(Enew);
        this.TrueAnomaly = MathTools.toDegrees(2 * Math.atan(Math.sqrt((1 + this.eccentricity) / (1 - this.eccentricity)) * Math.tan(Enew / 2)));
    };

    this.getSemimajorAxis = function () {
        return this.semimajorAxis;
    };

    this.getMeanAnomaly = function () {
        return this.meanAnomaly;
    };

    this.getEccentricAnomaly = function () {
        return this.eccentricAnomaly;
    };

    this.getTrueAnomaly = function () {
        return this.trueAnomaly;
    };

    this.getInclination = function () {
        return this.inclination;
    };

    this.getEccentricity = function () {
        return this.eccentricity;
    };

    this.getRaan = function () {
        return this.raan;
    };

    this.getArgOfPerigee = function () {
        return this.argOfPerigee;
    };

    this.getMeanMotion = function () {
        return this.meanMotion;
    };

    // setters
    this.setSemimajorAxis = function (theSemimajorAxis) {
        this.semimajorAxis = theSemimajorAxis;
    };

    this.setMeanAnomaly = function (theMeanAnomaly) {
        this.meanAnomaly = theMeanAnomaly;
        this.updateAnglesUsingMeanAnomaly();
    };

    this.setEccentricAnomaly = function (theEccentricAnomaly) {
        this.eccentricAnomaly = theEccentricAnomaly;
    };

    this.setTrueAnomaly = function (theTrueAnomaly) {
        this.trueAnomaly = theTrueAnomaly;
        this.updateAnglesUsingTrueAnomaly();
    };

    this.setInclination = function (theInclination) {
        this.inclination = theInclination;
    };

    this.setEccentricity = function (theEccentricity) {
        this.eccentricity = theEccentricity;
    };

    this.setRaan = function (theRaan) {
        this.raan = theRaan;
    };

    this.setArgOfPerigee = function (theArgOfPerigee) {
        this.argOfPerigee = theArgOfPerigee;
    };

    this.setMeanMotion = function (theMeanMotion) {
        this.meanMotion = theMeanMotion;
    };
}