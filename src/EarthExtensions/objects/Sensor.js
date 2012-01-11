// package SensorPackage;
// 
// import SatelliteFlyer.Constants;
// import SatelliteFlyer.CoordinateConversionTools;
// import SatelliteFlyer.ECIcoordinates;
// import SatelliteFlyer.MathTools;
// import SatelliteFlyer.Quaternion;
// import SatelliteFlyer.QuaternionMath;
// import SatelliteFlyer.RSWcoordinates;
// import SatelliteFlyer.SimulationObject;

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
        var azel = new Array();

        //define the target position as a vectors
        //System.out.println("targetpos: " + targetPosition.getX() + ", " + targetPosition.getY() + ", " + targetPosition.getZ());
        var targetline = new Array();
        targetline[0] = targetPosition.getX() - satellite.getEci().getX();
        targetline[1] = targetPosition.getY() - satellite.getEci().getY();
        targetline[2] = targetPosition.getZ() - satellite.getEci().getZ();
        //console.log("delta ECI: " + targetline[0] + ", " + targetline[1] + ", " + targetline[2]);


        //get the quaternion to convert the ECI coordinate of the target into an RSW coordinate triplet
        var eciToRSWquaternion = QuaternionMath.convertRotationMatrixToQuaternion(CoordinateConversionTools.buildRotationMatrixToConvertECItoRSW(satellite));
		//console.log("eciToRSWquaternion: " + JSON.stringify(eciToRSWquaternion));
		
        var targetInSensorCoordinates = QuaternionMath.applyQuaternionRotation(QuaternionMath.multiplyQuaternions(eciToRSWquaternion, this.quaternionFromRSWToSensor), targetline);
		//console.log("targetInSensorCoordinates: " + JSON.stringify(targetInSensorCoordinates));

        //convert the RSW coordinates of the target into the sensor coordinate system
        //Double[] targetInSensorCoordinates = QuaternionMath.applyQuaternionRotation(quaternionFromRSWToSensor, targetInRSWCoordinates);

        //System.out.println("quaternion: " + quaternionFromRSWToSensor.toString());
        targetline[0] = targetInSensorCoordinates[0];
        targetline[1] = targetInSensorCoordinates[1];
        targetline[2] = targetInSensorCoordinates[2];
        //console.log("targetline in sensor coords: " + targetline[0] + ", " + targetline[1] + ", " + targetline[2]);

        //---determine the three vectors that define the extent of the sensor shape in the sensor coordinate system
        //vector along the centerline of the sensor (RSW)
        var centerline = new Array();
        centerline[0] = 1.0;//center
        centerline[1] = 0.0;//left
        centerline[2] = 0.0;//top
        //System.out.println("centerline: " + centerline[0] + ", " + centerline[1] + ", " + centerline[2]);

        var rightline = new Array();
        rightline[0] = 1.0;//center
        rightline[1] = -Math.tan(MathTools.toRadians(this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(0.0)));//left
        rightline[2] = 0.0;//top
        //console.log("rightline: " + rightline[0] + ", " + rightline[1] + ", " + rightline[2]);


        var topline = new Array();
        topline[0] = 1.0;//center
        topline[1] = 0.0;//left
        topline[2] = Math.tan(MathTools.toRadians(this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(90.0)));//top
        //console.log("topline: " + topline[0] + ", " + topline[1] + ", " + topline[2]);

        //calculate the azimuth and elevation angles of the target relative to the centerline of the sensor FOV
        //assume it's an oblique spherical triangle
        //reference http://mathworld.wolfram.com/SphericalTrigonometry.html
        //a is the angle between the centerline and the right hand side
        var a = MathTools.toRadians(MathTools.angleBetweenTwoVectors(centerline, rightline));//radians
        //b is the angle between the centerline and the target
        var b = MathTools.toRadians(MathTools.angleBetweenTwoVectors(centerline, targetline));//radians
        //c is the angle between the right hand side and the target
        var c = MathTools.toRadians(MathTools.angleBetweenTwoVectors(rightline, targetline));//radians
        //d is the angle between the top side and the target
        var d = MathTools.toRadians(MathTools.angleBetweenTwoVectors(topline, targetline));//radians
        //e is the angle between the top side and the target
        var e = MathTools.toRadians(MathTools.angleBetweenTwoVectors(topline, centerline));//radians

        var s = 0.5 * (a + b + c);
        var C = 2 * Math.asin(Math.sqrt((Math.sin(s - a) * Math.sin(s - b) / (Math.sin(a) * Math.sin(b)))));

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
        azel[0] = az; //deg
        azel[1] = el; //deg
        return azel;
    }

    this.checkToSeeIfEarthObscuresLineBetweenSatelliteAndTarget = function(satellite, targetPosition)
    {

        //sight algorithm Vallado 295
        var haveSight = false;
        var r1 = new Array();
        var r2 = new Array();
        var radEarth = Constants.radiusEarth;
        r1[0] = satellite.getEci().getX() / radEarth;
        r1[1] = satellite.getEci().getY() / radEarth;
        r1[2] = satellite.getEci().getZ() / radEarth;
        r2[0] = targetPosition.getX() / radEarth;
        r2[1] = targetPosition.getY() / radEarth;
        r2[2] = targetPosition.getZ() / radEarth;
        var r1mag = MathTools.magnitude(r1);
        var r2mag = MathTools.magnitude(r2);
        var tmin = 0.5;
        var ctmin = 0.0;
        if (r1mag < 1 || r2mag < 1)
        { //one of the points is inside the earth
            haveSight = false;
        }
        else
        {
            tmin = (r1mag * r1mag - MathTools.dotMultiply(r1, r2)) / (r1mag * r1mag + r2mag * r2mag - 2 * MathTools.dotMultiply(r1, r2));
            if (tmin < 0 || tmin > 1)
            {
                haveSight = true;
            }
            else
            {
                ctmin = (1 - tmin) * r1mag * r1mag + MathTools.dotMultiply(r1, r2) * tmin;
                if (ctmin >= 1.0)
                {
                    haveSight = true;
                }
            }

        }
        return !haveSight;
    }

    this.checkSensorVisibilityOfTargetPoint = function(satellite, targetPosition)
    {
		//console.log("targetPosition: " + JSON.stringify(targetPosition));
		//console.log("satellite.getECI: " + JSON.stringify(satellite.getEci()));
        //first, correct the target azimuth and elevation to be in the same frame of reference as the sensor FOV
        var azel = this.determineTargetAzElRelativeToSensor(satellite, targetPosition);

        //System.out.println("az: " + azel[0] + " el: " + azel[1] + " shape El extent: " + this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(azel[0]));
		console.log("az: " + azel[0] + " el: " + azel[1] + " shape El extent: " + this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(azel[0]));

        //then check to see if this point is in the field of view of the sensor
        var inFOV = this.shape.canSensorSeePointAtAzEl(azel[0], azel[1]);
        var earthObscured = this.checkToSeeIfEarthObscuresLineBetweenSatelliteAndTarget(satellite, targetPosition);
        if (earthObscured)
        {
			console.log("earth obscured")
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
				console.log("not in FOV");
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
		for(var i = 0; i < NumPoints; i++) {
			FOV[i] = new Array(3);
		}

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

            /*
            //rotate about along track
            FOVboundary = MathTools.applyRot2(this.alongtrackRotationAngle, FOVboundary);
            //rotate about cross track
            FOVboundary = MathTools.applyRot3(this.crosstrackRotationAngle, FOVboundary);
            //rotate about radial
            FOVboundary = MathTools.applyRot1(this.radialRotationAngle, FOVboundary);
             */
            //var rswPoint = new UNIVERSE.RSWCoordinates(FOVboundary[0], FOVboundary[1], FOVboundary[2]);
			var rswPoint = new UNIVERSE.RSWCoordinates(FOVboundary[0], FOVboundary[1], FOVboundary[2]);
			
			//console.log("rswPoint: " + JSON.stringify(rswPoint));

			
	        var satXpos = satellite.getEci().getX();
	        var satYpos = satellite.getEci().getY();
	        var satZpos = satellite.getEci().getZ();
	
            //convert the RSW to ECI
            var eciTemp = CoordinateConversionTools.convertRSWToECI(satellite, rswPoint);
            FOV[i][0] = satXpos + eciTemp.getX();
            FOV[i][1] = satYpos + eciTemp.getY();
            FOV[i][2] = satZpos + eciTemp.getZ();

            //System.out.println(i + "," + az + "," + el + "," + FOV[i][0] + "," + FOV[i][1] + "," + FOV[i][2]);
        }

        return FOV;
    }

	this.findProjectionPoints = function(endpoints, satellite, distancePastEarthToDraw) {
		var satellitePosition = {
			x: satellite.getEci().getX(),
			y: satellite.getEci().getY(),
			z: satellite.getEci().getZ()
		};
		
		var shiftedEarthCenter = {
			x: - satellitePosition.x,
			y: - satellitePosition.y,
			z: - satellitePosition.z
		};
		
		var pointsOnEarth = new Array();
		
		for(var i = 0; i < endpoints.length; i++) {
			// shift everything to the satellite position as the origin
			var shiftedBoundaryPoint = {
				x: endpoints[i][0] - satellitePosition.x,
				y: endpoints[i][1] - satellitePosition.y,
				z: endpoints[i][2] - satellitePosition.z
			};
			
			var satelliteDistanceFromCenterOfEarth = MathTools.magnitudeVector(satellitePosition);
			var depth = satelliteDistanceFromCenterOfEarth + distancePastEarthToDraw;
			
			// Based on this: http://en.wikipedia.org/wiki/Line%E2%80%93sphere_intersection
			// d = ((I*c) +/- sqrt((I*c)^2 - c*c + r*r))
			var I = shiftedBoundaryPoint;
			var c = shiftedEarthCenter;
			var r = Constants.radiusEarth + 20;
			
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
				
				// scale down to the earth's surface
				var tangentPointMagnitude = MathTools.magnitudeVector(tangentPoint);
				var scaleToEarthSurface = (Constants.radiusEarth + 20)/tangentPointMagnitude;
				
				var tangentPointOnSurface = MathTools.scalarMultiplyVector(tangentPoint, scaleToEarthSurface)

				pointsOnEarth.push(tangentPointOnSurface);
			}
			
		}
		
		return pointsOnEarth;
	}

	this.extendSensorEndpointsInECIToConformToEarth = function(endpoints, satellite, distancePastEarthToDraw, maximumAcceptableMissDistance) {
		var correctedEndpoints = new Array(endpoints.length);
		
		for(var i = 0; i < endpoints.length; i++) {
			correctedEndpoints[i] = new Array(3);
		}
		
		var x = satellite.getEci().getX();
		var y = satellite.getEci().getY();
		var z = satellite.getEci().getZ();
		
		var depth = Math.sqrt(x*x + y*y + z*z) + distancePastEarthToDraw;
		
		for(var i = 0; i < endpoints.length; i++) {
			var newX = x + (endpoints[i][0] - x)*depth;
			var newY = y + (endpoints[i][1] - y)*depth;
			var newZ = z + (endpoints[i][2] - z)*depth;
			var testPoint = new UNIVERSE.ECICoordinates(newX, newY, newZ, 0,0,0,0,0,0);
			
	            var earthObscuring = this.checkToSeeIfEarthObscuresLineBetweenSatelliteAndTarget(satellite, testPoint);
	            if (earthObscuring == false)
	            {
	                correctedEndpoints[i][0] = newX;
	                correctedEndpoints[i][1] = newY;
	                correctedEndpoints[i][2] = newZ;
	            }
	            else  //need to shorten the line to where it intersects the earth (or close to that point)
	            {
	                //console.log("recursively searching for intersection point");
	                var rEarth = Constants.radiusEarth;//(km)
	                var earthSurfaceMissDistance = 1000000;
	                var trateofchange = depth ;  //for any incremental change in T, how much does the line's length change? (km)
	                var tguess = 0.5;
	                var count = 0;
	                while (Math.abs(earthSurfaceMissDistance) > maximumAcceptableMissDistance)
	                {
	                    var xguess = x + (newX - x) * tguess;  //km
	                    var yguess = y + (newZ - y) * tguess;  //km
	                    var zguess = z + (newZ - z) * tguess;  //km
	                    var rguess = Math.sqrt(xguess * xguess + yguess * yguess + zguess * zguess);
	                    earthSurfaceMissDistance = rEarth - rguess;  //if positive, it's inside earth, negative is short of the earth
	                    //System.out.println("count: "+count+" miss distance: "+earthSurfaceMissDistance+" tguess: "+tguess+" trateofchange(0-1): "+trateofchange);
	                    count++;
	                    if (count > 50)
	                    {
	                        break;
	                    }

	                    //adjust tguess based upon how much you missed
	                    if (earthSurfaceMissDistance > 0)//overshot, now inside the earth
	                    {
	                        tguess = tguess - 0.95 * Math.abs(earthSurfaceMissDistance) / trateofchange;
	                    }
	                    else if (earthSurfaceMissDistance < 0)//undershot, need to go further
	                    {
	                        tguess = tguess + 1.05 * Math.abs(earthSurfaceMissDistance) / trateofchange;
	                    }
	                    else
	                    {
	                        break;
	                    }
	                }
	                //adjust the point so that it is definitely outside of the Earth
	                if(earthSurfaceMissDistance>0){
	                    tguess = tguess - 1.05 * Math.abs(earthSurfaceMissDistance) / trateofchange;
	                }
	                var xintersect = x + (newX - x) * tguess;  //km
	                var yintersect = y + (newZ - y) * tguess;  //km
	                var zintersect = z + (newZ - z) * tguess;  //km
	                correctedEndpoints[i][0]=xintersect;
	                correctedEndpoints[i][1]=yintersect;
	                correctedEndpoints[i][2]=zintersect;
	                var rintersect = Math.sqrt(xintersect * xintersect + yintersect * yintersect + zintersect * zintersect);
	                earthSurfaceMissDistance = rEarth - rintersect;  //if positive, it's inside earth, negative is short of the earth

	                //console.log("final--- miss distance: "+earthSurfaceMissDistance+" tguess: "+tguess+" trateofchange(0-1): "+trateofchange);

	            }
	        }


	        return correctedEndpoints;
	    }

    this.getQuaternionFromECIToSensor = function(eciXYZvector, satellite)
    {
        var refMagnitude = MathTools.magnitude(eciXYZvector);
        var startVec = new Array(3);
        startVec[0] = eciXYZvector[0] / refMagnitude;
        startVec[1] = eciXYZvector[1] / refMagnitude;
        startVec[2] = eciXYZvector[2] / refMagnitude;

        //determine the quaternion from the reference vector to the satellite position vector
        var satelliteVec = new Array(3);
        var x=satellite.getEci().getX();
        var y=satellite.getEci().getY();
        var z=satellite.getEci().getZ();
        var satelliteMagnitude=Math.sqrt(x*x+y*y+z*z);
        satelliteVec[0] = x / satelliteMagnitude;
        satelliteVec[1] = y / satelliteMagnitude;
        satelliteVec[2] = z / satelliteMagnitude; 
        
        //figure out the quaternion from RSW to the default sensor axis (nadir)
        var nadirQuaternion = new Quaternion();
        var rotationRadians = MathTools.toRadians(180.0);
        var rotationAxis = new Array();
        rotationAxis[0] = 0.0;
        rotationAxis[1] = 0.0;
        rotationAxis[2] = 1.0;
        nadirQuaternion.setW(Math.cos(rotationRadians / 2.0));
        nadirQuaternion.setX(Math.sin(rotationRadians / 2.0) * rotationAxis[0]);
        nadirQuaternion.setY(Math.sin(rotationRadians / 2.0) * rotationAxis[1]);
        nadirQuaternion.setZ(Math.sin(rotationRadians / 2.0) * rotationAxis[2]);

        //figure out the quaternion from the satellite's coordinate system to the sensor
        var crossproduct = MathTools.cross(startVec, satelliteVec);
        var crossproductmagnitude=MathTools.magnitude(crossproduct);
        var quaternionFromECIToRSW=new Quaternion();
        quaternionFromECIToRSW.setX(crossproduct[0]/crossproductmagnitude);
        quaternionFromECIToRSW.setY(crossproduct[1]/crossproductmagnitude);
        quaternionFromECIToRSW.setZ(crossproduct[2]/crossproductmagnitude);
        quaternionFromECIToRSW.setW(Math.acos(MathTools.dotMultiply(startVec, satelliteVec)));
        
        //Quaternion sensorQuaternion = new Quaternion();
        //rotationRadians = Math.toRadians(Math.acos(MathTools.dotMultiply(startVec, satelliteVec)));
        //rotationAxis = new Double[3];
        //Double[] crossproduct = MathTools.cross(startVec, satelliteVec);
        //double crossproductmagnitude=MathTools.magnitude(crossproduct);
        //if(crossproductmagnitude==0){
        //    sensorQuaternion.setW(0.00000000001);
        //    sensorQuaternion.setX(0.0);
        //    sensorQuaternion.setY(0.0);
        //    sensorQuaternion.setZ(1.0);
        //}
        //else{
        //    rotationAxis[0] = crossproduct[0]/crossproductmagnitude;
        //    rotationAxis[1] = crossproduct[1]/crossproductmagnitude;
        //    rotationAxis[2] = crossproduct[2]/crossproductmagnitude;
        //    sensorQuaternion.setW(Math.cos(rotationRadians / 2.0));
        //    sensorQuaternion.setX(Math.sin(rotationRadians / 2.0) * rotationAxis[0]);
        //   sensorQuaternion.setY(Math.sin(rotationRadians / 2.0) * rotationAxis[1]);
        //    sensorQuaternion.setZ(Math.sin(rotationRadians / 2.0) * rotationAxis[2]);
        //}

        //System.out.println("nadir: "+nadirQuaternion.toString());
        //System.out.println("quaternionFromECIToRSW: "+quaternionFromECIToRSW.toString());
        //System.out.println("this.quaternionFromRSWToSensor: "+this.quaternionFromRSWToSensor.toString());
        var result=QuaternionMath.multiplyQuaternions(quaternionFromECIToRSW,nadirQuaternion);
        result=QuaternionMath.multiplyQuaternions(result,this.quaternionFromRSWToSensor);
        
        //result=QuaternionMath.multiplyQuaternions(result,this.quaternionFromRSWToSensor);

        return result;
    }
};