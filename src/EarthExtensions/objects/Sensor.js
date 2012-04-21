// Sensor.js

/**
 *
 * @author Justin
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.Sensor = function(name, shape) {

    this.name = name;
    this.shape = shape;

    //default the sensor to orient along the satellite's nadir (it defaults to align with RSW where R would be equivalent to the sensor's centerline)
    this.quaternionFromRSWToSensor = new Quaternion(); //(equivalent to R3, R2, R1)
    this.rotationRadians = MathTools.toRadians(180.0);

    // http://www.cprogramming.com/tutorial/3d/quaternions.html
    this.rotationAxis = new Array();
    this.rotationAxis[0] = 0.0;
    this.rotationAxis[1] = 0.0;
    this.rotationAxis[2] = 1.0;

    this.quaternionFromRSWToSensor.setW(Math.cos(this.rotationRadians / 2.0));
    this.quaternionFromRSWToSensor.setX(Math.sin(this.rotationRadians / 2.0) * this.rotationAxis[0]);
    this.quaternionFromRSWToSensor.setY(Math.sin(this.rotationRadians / 2.0) * this.rotationAxis[1]);
    this.quaternionFromRSWToSensor.setZ(Math.sin(this.rotationRadians / 2.0) * this.rotationAxis[2]);

	
    this.rotateSensorAboutRadialVector = function(rotationAngle)
    {
        if (rotationAngle && rotationAngle != 0)
        {
            var rotationQuaternion = new Quaternion();
            var rotationRadians = MathTools.toRadians(rotationAngle);
            var rotationAxis = new Array();
            rotationAxis[0] = 1.0;
            rotationAxis[1] = 0.0;
            rotationAxis[2] = 0.0;
            rotationQuaternion.setW(Math.cos(rotationRadians / 2.0));
            rotationQuaternion.setX(Math.sin(rotationRadians / 2.0) * rotationAxis[0]);
            rotationQuaternion.setY(Math.sin(rotationRadians / 2.0) * rotationAxis[1]);
            rotationQuaternion.setZ(Math.sin(rotationRadians / 2.0) * rotationAxis[2]);
            //figure out the new quaternion for the sensor coordinate system
            this.quaternionFromRSWToSensor = QuaternionMath.multiplyQuaternions(rotationQuaternion, this.quaternionFromRSWToSensor);
        }
    }

    this.rotateSensorAboutAlongTrackVector = function(rotationAngle)
    {
        if (rotationAngle && rotationAngle != 0)
        {
            var rotationQuaternion = new Quaternion();
            var rotationRadians = MathTools.toRadians(rotationAngle);
            var rotationAxis = new Array();
            rotationAxis[0] = 0.0;
            rotationAxis[1] = 1.0;
            rotationAxis[2] = 0.0;
            rotationQuaternion.setW(Math.cos(rotationRadians / 2.0));
            rotationQuaternion.setX(Math.sin(rotationRadians / 2.0) * rotationAxis[0]);
            rotationQuaternion.setY(Math.sin(rotationRadians / 2.0) * rotationAxis[1]);
            rotationQuaternion.setZ(Math.sin(rotationRadians / 2.0) * rotationAxis[2]);
            //figure out the new quaternion for the sensor coordinate system
            this.quaternionFromRSWToSensor = QuaternionMath.multiplyQuaternions(rotationQuaternion, this.quaternionFromRSWToSensor);
        }
    }

    this.rotateSensorAboutCrossTrackVector = function(rotationAngle)
    {
        if (rotationAngle && rotationAngle != 0)
        {
            var rotationQuaternion = new Quaternion();
            var rotationRadians = MathTools.toRadians(rotationAngle);
            var rotationAxis = new Array();
            rotationAxis[0] = 0.0;
            rotationAxis[1] = 0.0;
            rotationAxis[2] = 1.0;
            rotationQuaternion.setW(Math.cos(rotationRadians / 2.0));
            rotationQuaternion.setX(Math.sin(rotationRadians / 2.0) * rotationAxis[0]);
            rotationQuaternion.setY(Math.sin(rotationRadians / 2.0) * rotationAxis[1]);
            rotationQuaternion.setZ(Math.sin(rotationRadians / 2.0) * rotationAxis[2]);
            //figure out the new quaternion for the sensor coordinate system
            this.quaternionFromRSWToSensor = QuaternionMath.multiplyQuaternions(rotationQuaternion, this.quaternionFromRSWToSensor);
        }
    }

    this.getSensorQuaternionRSW = function()
    {
        return this.quaternionFromRSWToSensor;
    }

    this.setSensorQuaternionRSW = function(sensorQuaternionRSW)
    {
        this.quaternionFromRSWToSensor = sensorQuaternionRSW;
    }

    this.getName = function()
    {
        return this.name;
    }

    this.setName = function(name)
    {
        this.name = name;
    }

    this.getShape = function()
    {
        return this.shape;
    }

    this.setShape = function(shape)
    {
        this.shape = shape;
    }

    this.determineTargetAzElRelativeToSensor = function(satellite, targetPosition)
    {
        //define the target position as a vectors
        //console.log("satellite: " + satellite.getEci().getX() + ", " + satellite.getEci().getY() + ", " + satellite.getEci().getZ() +  '      ' + 
        //            "targetpos: " + targetPosition.getX() + ", " + targetPosition.getY() + ", " + targetPosition.getZ());
        //System.out.println("targetpos: " + targetPosition.getX() + ", " + targetPosition.getY() + ", " + targetPosition.getZ());
        ;
        var satelliteEci = satellite.getEci();
        var deltaECI = {
            x: targetPosition.x - satelliteEci.getX(),
            y: targetPosition.y - satelliteEci.getY(),
            z: targetPosition.z - satelliteEci.getZ()
        }
        
        //console.log("delta ECI: " + deltaECI[0] + ", " + deltaECI[1] + ", " + deltaECI[2]);
		
        var r = {
            x: satelliteEci.getX(), 
            y: satelliteEci.getY(), 
            z: satelliteEci.getZ()
        };
        
        var v = {
            x: satelliteEci.getVX(),
            y: satelliteEci.getVY(),
            z: satelliteEci.getVZ()
        }
        
        var rmag = MathTools.magnitudeVector(r);
        var rcrossv = MathTools.crossVector(r, v);
        var rvec = MathTools.scalarMultiplyVector(r, 1/rmag);
        var w = MathTools.scalarMultiplyVector(rcrossv, 1/MathTools.magnitudeVector(rcrossv));
        var s = MathTools.crossVector(w, r);
        
        var deltaECIdotR = MathTools.dotMultiplyVector(deltaECI, rvec);
        var deltaECIdotS = MathTools.dotMultiplyVector(deltaECI, s);
        var deltaECIdotW = MathTools.dotMultiplyVector(deltaECI, w);
        
        var targetInRSWCoordinates = [deltaECIdotR/MathTools.magnitudeVector(rvec),deltaECIdotS/MathTools.magnitudeVector(s),deltaECIdotW/MathTools.magnitudeVector(w)];
		

        //get the quaternion to convert the ECI coordinate of the target into an RSW coordinate triplet
        var targetInSensorCoordinatesArray = QuaternionMath.applyQuaternionRotation(this.quaternionFromRSWToSensor, targetInRSWCoordinates);
        
        var targetInSensorCoordinates = {
            x: targetInSensorCoordinatesArray[0],
            y: targetInSensorCoordinatesArray[1],
            z: targetInSensorCoordinatesArray[2]
        }
        //console.log("targetInSensorCoordinates: " + JSON.stringify(targetInSensorCoordinates));

        //---determine the three vectors that define the extent of the sensor shape in the sensor coordinate system
        //these are the non-rotated vectors
        //vector along the centerline of the sensor (RSW)
        var centerline = {
            x: 1.0,//center (radial)
            y: 0.0,//left
            z: 0.0//top
        }

        var rightline = {
            x : 1.0,//center
            y : -Math.tan(MathTools.toRadians(this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(0.0))),//left
            z : 0.0//top
        }

        var topline = {
            x : 1.0,//center
            y : 0.0,//left
            z : Math.tan(MathTools.toRadians(this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(90.0)))//top
        };
        
        //calculate the azimuth and elevation angles of the target relative to the centerline of the sensor FOV
        //assume it's an oblique spherical triangle
        //reference http://mathworld.wolfram.com/SphericalTrigonometry.html
        //a is the angle between the centerline and the right hand side
        var a = MathTools.toRadians(MathTools.angleBetweenTwoVectorsVector(centerline, rightline));//radians
        //b is the angle between the centerline and the target
        var b = MathTools.toRadians(MathTools.angleBetweenTwoVectorsVector(centerline, targetInSensorCoordinates));//radians
        //c is the angle between the right hand side and the target
        var c = MathTools.toRadians(MathTools.angleBetweenTwoVectorsVector(rightline, targetInSensorCoordinates));//radians
        //d is the angle between the top side and the target
        var d = MathTools.toRadians(MathTools.angleBetweenTwoVectorsVector(topline, targetInSensorCoordinates));//radians
        //e is the angle between the top side and the target
        var e = MathTools.toRadians(MathTools.angleBetweenTwoVectorsVector(topline, centerline));//radians

        var S = 0.5 * (a + b + c);
        var C = 2 * Math.asin(Math.sqrt((Math.sin(Math.abs(S - a)) * Math.sin(Math.abs(S - b)) / (Math.sin(a) * Math.sin(b)))));

        //double C=Math.acos(Math.cos(c)-Math.cos(a)*Math.cos(b))/(Math.sin(a)*Math.sin(b));//radians
        var az = MathTools.toDegrees(C);
        var el = MathTools.toDegrees(b);

        if (d > b && d > e)
        {
            az = 360 - az;
        }
        //correct the azimuth
        //System.out.println("a (CL-RL): " + MathTools.toDegrees(a) + " b (CL-TGTL): " + MathTools.toDegrees(b) + " c (RL-TGTL): " + MathTools.toDegrees(c) + " d (TL-TGTL): " + MathTools.toDegrees(d) + " e (TL-CL): " + MathTools.toDegrees(e) + " C (az):" + MathTools.toDegrees(C));


        //return the azimuth and elevation
        return {
            az: az, 
            el: el
        };
    }

    this.checkToSeeIfEarthObscuresLineBetweenSatelliteAndTargetSphericalEarth = function(satellite, targetPosition)
    {
        //sight algorithm Vallado 295
        var haveSight = false;
        var radEarth = Constants.radiusEarth;
        var satelliteEci = satellite.getEci();
        var r1 = {
            x: satelliteEci.getX() / radEarth,
            y: satelliteEci.getY() / radEarth,
            z: satelliteEci.getZ() / radEarth
        }
        var r2 = {
            x: targetPosition.getX() / radEarth,
            y: targetPosition.getY() / radEarth,
            z: targetPosition.getZ() / radEarth
        }
        
        var r1mag = MathTools.magnitudeVector(r1);
        var r2mag = MathTools.magnitudeVector(r2);
        var tmin = 0.5;
        var ctmin = 0.0;
        if (r1mag < 1 || r2mag < 1)
        { //one of the points is inside the earth
            haveSight = false;
        }
        else
        {
            var r1DotR2 = MathTools.dotMultiplyVector(r1, r2);
            tmin = (r1mag * r1mag - r1DotR2) / (r1mag * r1mag + r2mag * r2mag - 2 * r1DotR2);
            if (tmin < 0 || tmin > 1)
            {
                haveSight = true;
            }
            else
            {
                ctmin = (1 - tmin) * r1mag * r1mag + r1DotR2 * tmin;
                if (ctmin >= 1.0)
                {
                    haveSight = true;
                }
            }

        }
        return !haveSight;
    }

    this.checkToSeeIfEarthObscuresLineBetweenSatelliteAndTargetOblateEarth = function(satellite, targetPosition)
    {

        //sight algorithm Vallado 295
        var haveSight = false;
        var radEarth = Constants.radiusEarth;
        var satelliteEci = satellite.getEci();
        var r1 = {
            x: satelliteEci.getX() / radEarth,
            y: satelliteEci.getY() / radEarth,
            z: satelliteEci.getZ() / radEarth
        }
        var r2 = {
            x: targetPosition.getX() / radEarth,
            y: targetPosition.getY() / radEarth,
            z: targetPosition.getZ() / radEarth
        }
        var r1mag = MathTools.magnitudeVector(r1);
        var r2mag = MathTools.magnitudeVector(r2);
        var tmin = 0.5;
        var ctmin = 0.0;

        //disable the radius magnitude check because it doesn't account for the oblateness of the earth which the LLAcoordinates do account for
        //this can cause points on the surface of the earth to appear inside of a non-oblate earth, causing this check to fail
        //if (r1mag < 1 || r2mag < 1)
        //{ //one of the points is inside the earth
        //    haveSight = false;
        //}
        //else
        //{
        var r1DotR2 = MathTools.dotMultiplyVector(r1, r2);
        tmin = (r1mag * r1mag - r1DotR2) / (r1mag * r1mag + r2mag * r2mag - 2 * r1DotR2);
        if (tmin < 0 || tmin > 1)
        {
            haveSight = true;
        }
        else
        {
            ctmin = (1 - tmin) * r1mag * r1mag + r1DotR2 * tmin;
            if (ctmin >= 1.0)
            {
                haveSight = true;
            }
        }

        //}
        return !haveSight;
    }

    this.checkSensorVisibilityOfTargetPoint = function(satellite, targetPosition)
    {
        //console.log("targetPosition: " + JSON.stringify(targetPosition));
        //console.log("satellite.getECI: " + JSON.stringify(satellite.getEci()));
        //first, correct the target azimuth and elevation to be in the same frame of reference as the sensor FOV
        var azel = this.determineTargetAzElRelativeToSensor(satellite, targetPosition);
        
        //console.log("az: " + azel[0] + " el: " + azel[1] + " shape El extent: " + this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(azel[0]));

        //then check to see if this point is in the field of view of the sensor
        var inFOV = this.shape.canSensorSeePointAtAzEl(azel.az, azel.el);
        var earthObscured = this.checkToSeeIfEarthObscuresLineBetweenSatelliteAndTargetOblateEarth(satellite, targetPosition);

        //console.log("earth obscured:" + earthObscured + "    inFOV:" + inFOV);
        if (earthObscured)
        {
            return false;
        }
        else
        {
            if (inFOV == true && earthObscured == false)  //if it's in the field of view and not obscured, indicate that you can see the target
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }

    this.buildPointsToDefineSensorShapeInECI = function(NumPoints, satellite)
    {
        //returns the instantaneous field of view of the sensor as represented by 
        //a set of 'NumPoints' unit vectors from the center of the satellite to the boundaries
        //of the sensor field of view in ECI coordinates
        //it is assumed that each xyz pair 
        var FOV = new Array(NumPoints)
//        for(var i = 0; i < NumPoints; i++) {
//            FOV[i] = new Array(3);
//        }

        var azimuthStep = 360.0 / NumPoints; //the azimuth separation between each point
        for (var i = 0; i < NumPoints; i++)
        {
            var az = i * azimuthStep;
            var el = MathTools.toRadians(this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(az));

            //console.log("az: " + az + " el: " + el);

            //build the sensor field of view vector in RSW

            //define the vector to the sensor boundary
            var FOVboundary = new Array(3);

            FOVboundary[0] = 1.0;  //radial
            FOVboundary[1] = el * Math.cos(MathTools.toRadians(az)); //along
            FOVboundary[2] = el * Math.sin(MathTools.toRadians(az));  //cross

            //ensure that it is a unit vector
            var FOVmagnitude = MathTools.magnitude(FOVboundary);
			
            FOVboundary[0] = FOVboundary[0] / FOVmagnitude;
            FOVboundary[1] = FOVboundary[1] / FOVmagnitude;
            FOVboundary[2] = FOVboundary[2] / FOVmagnitude;

            //console.log("FOVboundary1: " + JSON.stringify(FOVboundary));

            FOVboundary = QuaternionMath.applyQuaternionRotation(this.quaternionFromRSWToSensor, FOVboundary);

            //console.log("FOVboundary2: " + JSON.stringify(FOVboundary));

            var rswPoint = new UNIVERSE.RSWCoordinates(FOVboundary[0], FOVboundary[1], FOVboundary[2]);
			
            //console.log("rswPoint: " + JSON.stringify(rswPoint));

            var satelliteEci = satellite.getEci();
            var satXpos = satelliteEci.getX();
            var satYpos = satelliteEci.getY();
            var satZpos = satelliteEci.getZ();
	
            //convert the RSW to ECI
            var eciTemp = CoordinateConversionTools.convertRSWToECI(satellite, rswPoint);
            FOV[i] = {
                x: satXpos + eciTemp.getX(),
                y: satYpos + eciTemp.getY(),
                z: satZpos + eciTemp.getZ()
            }

        //System.out.println(i + "," + az + "," + el + "," + FOV[i][0] + "," + FOV[i][1] + "," + FOV[i][2]);
        }

        return FOV;
    }

    this.findProjectionPoints = function(endpoints, satellite, distancePastEarthToDraw) {
        var satellitePosition = satellite.getEci();

        var shiftedEarthCenter = {
            x: - satellitePosition.x,
            y: - satellitePosition.y,
            z: - satellitePosition.z
        };

        var pointsOnEarth = new Array();

        var endPointLen = endpoints.length;
        for(var i = 0; i < endPointLen; i++) {
            // shift everything to the satellite position as the origin
            var shiftedBoundaryPoint = {
                x: endpoints[i].x - satellitePosition.x,
                y: endpoints[i].y - satellitePosition.y,
                z: endpoints[i].z - satellitePosition.z
            };

            var satelliteDistanceFromCenterOfEarth = MathTools.magnitudeVector(satellitePosition);
            var depth = satelliteDistanceFromCenterOfEarth + distancePastEarthToDraw;

            // Based on this: http://en.wikipedia.org/wiki/Line%E2%80%93sphere_intersection
            // d = ((I*c) +/- sqrt((I*c)^2 - c*c + r*r))
            var I = shiftedBoundaryPoint;
            var c = shiftedEarthCenter;

            var aboveTheEarth = 100;
            // r is the radius above the earth to project the points....this adds an arbitrary number above the earth to minimize drawing collisions
            var r = Constants.radiusEarth + aboveTheEarth;

            var Idotc = MathTools.dotMultiplyVector(I, c);

            var cdotc = MathTools.dotMultiplyVector(c, c);

            var valueToBeSqrtd = Idotc*Idotc - cdotc + r*r;

            // Line does intersect the earth so find the point
            if(valueToBeSqrtd >= 0) {
                var sqrtValue = Math.sqrt(Idotc*Idotc - cdotc + r*r);
                var distanceToIntersectionPlus = Idotc + sqrtValue;
                var distanceToIntersectionMinus = Idotc - sqrtValue;

                var pointOnEarth = {
                    x: shiftedBoundaryPoint.x * distanceToIntersectionMinus + satellitePosition.x,
                    y: shiftedBoundaryPoint.y * distanceToIntersectionMinus + satellitePosition.y,
                    z: shiftedBoundaryPoint.z * distanceToIntersectionMinus + satellitePosition.z
                };
                if(pointOnEarth.x != null) {
                    pointsOnEarth.push(pointOnEarth);
                }

            }
            // This means the line does not intersect the earth and we will find the nearest tangent point
            else {
                // Scale the boundary point out to the depth
                var extendedEndPoint = MathTools.scalarMultiplyVector(shiftedBoundaryPoint, depth);

                // Get a unit vector pointed at the earth center from the satellite coordinate system
                var unitShiftedEarthCenter = MathTools.scalarMultiplyVector(shiftedEarthCenter, 1/satelliteDistanceFromCenterOfEarth);

                // Find the angle between the two
                var angleBetweenEarthCenterAndExtendedEndPoint = Math.acos(MathTools.dotMultiplyVector(shiftedBoundaryPoint, unitShiftedEarthCenter));

                // http://www.algebralab.org/studyaids/studyaid.aspx?file=Trigonometry_LawSines.xml
                var height = satelliteDistanceFromCenterOfEarth * Math.sin(angleBetweenEarthCenterAndExtendedEndPoint);

                // Distance along the line where the tangent point is.  i.e. where the height touches the line
                var distanceToTangentPoint = height / Math.atan(angleBetweenEarthCenterAndExtendedEndPoint);

                // Scale to the point and then shift back to earth-centered
                var scaleFromEndPointToTangentPoint = distanceToTangentPoint/ depth;
                var tangentPoint = {
                    x: (extendedEndPoint.x)*scaleFromEndPointToTangentPoint + satellitePosition.x,
                    y: (extendedEndPoint.y)*scaleFromEndPointToTangentPoint + satellitePosition.y,
                    z: (extendedEndPoint.z)*scaleFromEndPointToTangentPoint + satellitePosition.z
                }

                // scale down to the earth's surface, plus an arbitrary distance above the earth
                var tangentPointMagnitude = MathTools.magnitudeVector(tangentPoint);
                var scaleToEarthSurface = (Constants.radiusEarth + aboveTheEarth)/tangentPointMagnitude;

                var tangentPointOnSurface = MathTools.scalarMultiplyVector(tangentPoint, scaleToEarthSurface)

                pointsOnEarth.push(tangentPointOnSurface);
            }

        }

        return pointsOnEarth;
    }

    // TODO: This method is not currently used by anything...  Do not know for sure that it works or what it would be used for
    this.getQuaternionFromECIToSensor = function(eciXYZvector, satellite)
    {
        var refMagnitude = MathTools.magnitudeVector(eciXYZvector);
        var startVec = {
            x: eciXYZvector.x / refMagnitude,
            y: eciXYZvector.y / refMagnitude,
            z: eciXYZvector.z / refMagnitude
        }
        
        //determine the quaternion from the reference vector to the satellite position vector
        
        var satelliteEci = satellite.getEci();
        var x = satelliteEci.getX();
        var y = satelliteEci.getY();
        var z = satelliteEci.getZ();
        var satelliteMagnitude = Math.sqrt(x*x+y*y+z*z);
        
        var satelliteVec = {
            x: x / satelliteMagnitude,
            y: y / satelliteMagnitude,
            z: z / satelliteMagnitude
        }
        
        //figure out the quaternion from RSW to the default sensor axis (nadir)
        var nadirQuaternion = new Quaternion();
        var rotationRadians = MathTools.toRadians(180.0);
        var rotationAxis = {
            x: 0.0,
            y: 0.0,
            z: 1.0
        }
        
        nadirQuaternion.setW(Math.cos(rotationRadians / 2.0));
        nadirQuaternion.setX(Math.sin(rotationRadians / 2.0) * rotationAxis.x);
        nadirQuaternion.setY(Math.sin(rotationRadians / 2.0) * rotationAxis.y);
        nadirQuaternion.setZ(Math.sin(rotationRadians / 2.0) * rotationAxis.z);

        //figure out the quaternion from the satellite's coordinate system to the sensor
        var crossproduct = MathTools.crossVector(startVec, satelliteVec);
        var crossproductmagnitude = MathTools.magnitudeVector(crossproduct);
        var quaternionFromECIToRSW = new Quaternion();
        
        quaternionFromECIToRSW.setX(crossproduct.x / crossproductmagnitude);
        quaternionFromECIToRSW.setY(crossproduct.y / crossproductmagnitude);
        quaternionFromECIToRSW.setZ(crossproduct.z / crossproductmagnitude);
        quaternionFromECIToRSW.setW(Math.acos(MathTools.dotMultiplyVector(startVec, satelliteVec)));
        
        var result = QuaternionMath.multiplyQuaternions(quaternionFromECIToRSW,nadirQuaternion);
        result = QuaternionMath.multiplyQuaternions(result,this.quaternionFromRSWToSensor);

        return result;
    }
};