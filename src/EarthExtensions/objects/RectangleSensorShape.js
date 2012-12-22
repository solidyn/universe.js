/*jslint browser: true, sloppy: true, nomen: true */
/*global MathTools */

/**
 * RectangleSensorShape.js
 * @author Justin
 */

var UNIVERSE = UNIVERSE || {};

UNIVERSE.RectangleSensorShape = function (shapeName, width, height) {
    this.shapeName = shapeName;
    this.width = width;
    this.height = height;

    this.getHeight = function () {
        return this.height;
    };

    this.setHeight = function (height) {
        this.height = height;
    };

    this.getWidth = function () {
        return this.width;
    };

    this.setWidth = function (width) {
        this.width = width;
    };

    this.getAngularExtentOfSensorAtSpecifiedAzimuth = function (checkAngle) {

        if ((this.height === 0) && (this.width === 0)) {
            return 0;
        } else {
            var upperRightCorner = MathTools.toDegrees(Math.atan(this.height / this.width)),  //the azimuth (from the x-axis) of the corner
                upperLeftCorner = 180 - upperRightCorner,
                lowerLeftCorner = 180 + upperRightCorner,
                lowerRightCorner = 360 - upperRightCorner,
                r1,
                r2;

            if (checkAngle < 0) {
                checkAngle += 360;
            }

            r1 = Math.abs(this.width / (2 * Math.cos(MathTools.toRadians(checkAngle))));
            r2 = Math.abs(this.height / (2 * Math.sin(MathTools.toRadians(checkAngle))));

            //determine which quadrant the azimuth is in
            if (checkAngle < upperRightCorner) {
                return r1;
            } else if (checkAngle < upperLeftCorner) {
                return r2;
            } else if (checkAngle < lowerLeftCorner) {
                return r1;
            } else if (checkAngle < lowerRightCorner) {
                return r2;
            } else {
                return r1;
            }

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
