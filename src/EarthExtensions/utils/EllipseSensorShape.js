/**
 *
 * @author Justin
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.EllipseSensorShape = function(shapeName, semiMajorAngle, semiMinorAngle)
{
	this.shapeName = shapeName;
    this.semiMajorAngle = semiMajorAngle;
    this.semiMinorAngle = semiMinorAngle;
    
    this.getSemiMajorAngle = function()
    {
        return this.semiMajorAngle;
    }

	this.setSemiMajorAngle = function(semiMajorAngle)
    {
        this.semiMajorAngle = semiMajorAngle;
    }

    this.getSemiMinorAngle = function()
    {
        return this.semiMinorAngle;
    }

    this.setSemiMinorAngle = function(semiMinorAngle)
    {
        this.semiMinorAngle = semiMinorAngle;
    }

    this.getAngularExtentOfSensorAtSpecifiedAzimuth = function(checkAngle)
    {
        if ((this.semiMajorAngle==0)&&(this.semiMinorAngle==0)){
            return 0;
        }
        else{
            var a=MathTools.toRadians(this.semiMajorAngle);
            var b=MathTools.toRadians(this.semiMinorAngle);
            var cosTheta=Math.cos(MathTools.toRadians(checkAngle));
            var sinTheta=Math.sin(MathTools.toRadians(checkAngle));
            return MathTools.toDegrees(a*b/Math.sqrt((b*cosTheta)*(b*cosTheta)+(a*sinTheta)*(a*sinTheta)));
        }
    }

    this.canSensorSeePointAtAzEl = function(relativeAzimuth, relativeRadius){
        var canSee = false;
        
        var radiusSensor = this.getAngularExtentOfSensorAtSpecifiedAzimuth(relativeAzimuth);
        if(radiusSensor > relativeRadius){
            canSee = true;
        }
        return canSee;
    }
};