/*jslint browser: true, sloppy: true */
/*global MathTools */
// EllipseSensorShape.js

var UNIVERSE = UNIVERSE || {};

/** 
    Represents an Ellipse sensor shape to be used in Sensor projection and visibility calculation
    @constructor
    @param {string} shapeName - Name of the sensor shape
    @param {double} semiMajorAngle - SMA of the ellipse sensor
    @param {double} semiMinorAngle - SMI of the elipse sensor
 */
UNIVERSE.EllipseSensorShape = function (shapeName, semiMajorAngle, semiMinorAngle) {
    this.shapeName = shapeName;
    this.semiMajorAngle = semiMajorAngle;
    this.semiMinorAngle = semiMinorAngle;

    this.getSemiMajorAngle = function () {
        return this.semiMajorAngle;
    };

    this.setSemiMajorAngle = function (semiMajorAngle) {
        this.semiMajorAngle = semiMajorAngle;
    };

    this.getSemiMinorAngle = function () {
        return this.semiMinorAngle;
    };

    this.setSemiMinorAngle = function (semiMinorAngle) {
        this.semiMinorAngle = semiMinorAngle;
    };

    this.getAngularExtentOfSensorAtSpecifiedAzimuth = function (checkAngle) {
        if ((this.semiMajorAngle === 0) && (this.semiMinorAngle === 0)) {
            return 0;
        } else {
            var a = MathTools.toRadians(this.semiMajorAngle),
                b = MathTools.toRadians(this.semiMinorAngle),
                cosTheta = Math.cos(MathTools.toRadians(checkAngle)),
                sinTheta = Math.sin(MathTools.toRadians(checkAngle));
            return MathTools.toDegrees(a * b / Math.sqrt((b * cosTheta) * (b * cosTheta) + (a * sinTheta) * (a * sinTheta)));
        }
    };

    this.canSensorSeePointAtAzEl = function (relativeAzimuth, relativeRadius) {
        var canSee = false,
            radiusSensor = this.getAngularExtentOfSensorAtSpecifiedAzimuth(relativeAzimuth);

        if (radiusSensor > relativeRadius) {
            canSee = true;
        }
        return canSee;
    };
};