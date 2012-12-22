/*jslint browser: true, sloppy: true */
/*global UNIVERSE, Quaternion, MathTools, QuaternionMath, THREE, Constants, CoordinateConversionTools */

// Sensor.js

/**
 *
 * @author Justin
 */

UNIVERSE.Sensor = function (name, shape) {

    this.name = name;
    this.shape = shape;

    //default the sensor to orient along the satellite's nadir (it defaults to align with RSW where R would be equivalent to the sensor's centerline)
    this.quaternionFromRSWToSensor = new Quaternion(); //(equivalent to R3, R2, R1)
    this.rotationRadians = MathTools.toRadians(180.0);

    // http://www.cprogramming.com/tutorial/3d/quaternions.html
    this.rotationAxis = {
        x: 0.0,
        y: 0.0,
        z: 1.0
    };

    this.quaternionFromRSWToSensor.setW(Math.cos(this.rotationRadians / 2.0));
    this.quaternionFromRSWToSensor.setX(Math.sin(this.rotationRadians / 2.0) * this.rotationAxis.x);
    this.quaternionFromRSWToSensor.setY(Math.sin(this.rotationRadians / 2.0) * this.rotationAxis.y);
    this.quaternionFromRSWToSensor.setZ(Math.sin(this.rotationRadians / 2.0) * this.rotationAxis.z);


    this.rotateSensorAboutRadialVector = function (rotationAngle) {
        if (rotationAngle && rotationAngle !== 0) {
            var rotationQuaternion = new Quaternion(),
                rotationRadians = MathTools.toRadians(rotationAngle),
                rotationAxis = {
                    x: 1.0,
                    y: 0.0,
                    z: 0.0
                };

            rotationQuaternion.setW(Math.cos(rotationRadians / 2.0));
            rotationQuaternion.setX(Math.sin(rotationRadians / 2.0) * rotationAxis.x);
            rotationQuaternion.setY(Math.sin(rotationRadians / 2.0) * rotationAxis.y);
            rotationQuaternion.setZ(Math.sin(rotationRadians / 2.0) * rotationAxis.z);

            //figure out the new quaternion for the sensor coordinate system
            this.quaternionFromRSWToSensor = QuaternionMath.multiplyQuaternions(rotationQuaternion, this.quaternionFromRSWToSensor);
        }
    };

    this.rotateSensorAboutAlongTrackVector = function (rotationAngle) {
        if (rotationAngle && rotationAngle !== 0) {
            var rotationQuaternion = new Quaternion(),
                rotationRadians = MathTools.toRadians(rotationAngle),
                rotationAxis = {
                    x: 0.0,
                    y: 1.0,
                    z: 0.0
                };

            rotationQuaternion.setW(Math.cos(rotationRadians / 2.0));
            rotationQuaternion.setX(Math.sin(rotationRadians / 2.0) * rotationAxis.x);
            rotationQuaternion.setY(Math.sin(rotationRadians / 2.0) * rotationAxis.y);
            rotationQuaternion.setZ(Math.sin(rotationRadians / 2.0) * rotationAxis.z);

            //figure out the new quaternion for the sensor coordinate system
            this.quaternionFromRSWToSensor = QuaternionMath.multiplyQuaternions(rotationQuaternion, this.quaternionFromRSWToSensor);
        }
    };

    this.rotateSensorAboutCrossTrackVector = function (rotationAngle) {
        if (rotationAngle && rotationAngle !== 0) {
            var rotationQuaternion = new Quaternion(),
                rotationRadians = MathTools.toRadians(rotationAngle),
                rotationAxis = {
                    x: 0.0,
                    y: 0.0,
                    z: 1.0
                };

            rotationQuaternion.setW(Math.cos(rotationRadians / 2.0));
            rotationQuaternion.setX(Math.sin(rotationRadians / 2.0) * rotationAxis.x);
            rotationQuaternion.setY(Math.sin(rotationRadians / 2.0) * rotationAxis.y);
            rotationQuaternion.setZ(Math.sin(rotationRadians / 2.0) * rotationAxis.z);

            //figure out the new quaternion for the sensor coordinate system
            this.quaternionFromRSWToSensor = QuaternionMath.multiplyQuaternions(rotationQuaternion, this.quaternionFromRSWToSensor);
        }
    };

    this.getSensorQuaternionRSW = function () {
        return this.quaternionFromRSWToSensor;
    };

    this.setSensorQuaternionRSW = function (sensorQuaternionRSW) {
        this.quaternionFromRSWToSensor = sensorQuaternionRSW;
    };

    this.getName = function () {
        return this.name;
    };

    this.setName = function (name) {
        this.name = name;
    };

    this.getShape = function () {
        return this.shape;
    };

    this.setShape = function (shape) {
        this.shape = shape;
    };

    this.determineTargetAzElRelativeToSensor = function (satellite, targetPosition) {
        //define the target position as a vectors
        //console.log("satellite: " + satellite.getEci().getX() + ", " + satellite.getEci().getY() + ", " + satellite.getEci().getZ() +  '      ' + 
        //            "targetpos: " + targetPosition.getX() + ", " + targetPosition.getY() + ", " + targetPosition.getZ());
        //System.out.println("targetpos: " + targetPosition.getX() + ", " + targetPosition.getY() + ", " + targetPosition.getZ());

        var satelliteEci = satellite.getEci(),
            deltaECI = new THREE.Vector3(
                targetPosition.x - satelliteEci.getX(),
                targetPosition.y - satelliteEci.getY(),
                targetPosition.z - satelliteEci.getZ()
            ),
            r = new THREE.Vector3(
                satelliteEci.getX(),
                satelliteEci.getY(),
                satelliteEci.getZ()
            ),
            v = new THREE.Vector3(
                satelliteEci.getVX(),
                satelliteEci.getVY(),
                satelliteEci.getVZ()
            ),
            rmag = r.length(),
            rcrossv = new THREE.Vector3(),
            rvec = new THREE.Vector3(),
            w = new THREE.Vector3(),
            s = new THREE.Vector3(),
            deltaECIdotR,
            deltaECIdotS,
            deltaECIdotW,
            targetInRSWCoordinates,
            targetInSensorCoordinates,
            centerline,
            rightline,
            topline,
            a,
            b,
            c,
            d,
            e,
            S,
            C,
            az,
            el;

        rcrossv.cross(r, v);

        rvec.copy(r);
        rvec.divideScalar(rmag);

        w.copy(rcrossv);
        w.divideScalar(rcrossv.length());

        s.cross(w, r);

        deltaECIdotR = deltaECI.dot(rvec);

        deltaECIdotS = deltaECI.dot(s);

        deltaECIdotW = deltaECI.dot(w);

        targetInRSWCoordinates = new THREE.Vector3(
            deltaECIdotR / rvec.length(),
            deltaECIdotS / s.length(),
            deltaECIdotW / w.length()
        );

        //get the quaternion to convert the ECI coordinate of the target into an RSW coordinate triplet
        targetInSensorCoordinates = QuaternionMath.applyQuaternionRotation(this.quaternionFromRSWToSensor, targetInRSWCoordinates);

        //---determine the three vectors that define the extent of the sensor shape in the sensor coordinate system
        //these are the non-rotated vectors
        //vector along the centerline of the sensor (RSW)
        centerline = new THREE.Vector3(
            1.0,//center (radial)
            0.0,//left
            0.0//top
        );

        rightline = new THREE.Vector3(
            1.0,//center
            -Math.tan(MathTools.toRadians(this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(0.0))),//left
            0.0//top
        );

        topline = new THREE.Vector3(
            1.0,//center
            0.0,//left
            Math.tan(MathTools.toRadians(this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(90.0)))//top
        );

        //calculate the azimuth and elevation angles of the target relative to the centerline of the sensor FOV
        //assume it's an oblique spherical triangle
        //reference http://mathworld.wolfram.com/SphericalTrigonometry.html
        //a is the angle between the centerline and the right hand side
        a = MathTools.toRadians(MathTools.angleBetweenTwoVectorsVector(centerline, rightline));//radians

        //b is the angle between the centerline and the target
        b = MathTools.toRadians(MathTools.angleBetweenTwoVectorsVector(centerline, targetInSensorCoordinates));//radians

        //c is the angle between the right hand side and the target
        c = MathTools.toRadians(MathTools.angleBetweenTwoVectorsVector(rightline, targetInSensorCoordinates));//radians

        //d is the angle between the top side and the target
        d = MathTools.toRadians(MathTools.angleBetweenTwoVectorsVector(topline, targetInSensorCoordinates));//radians

        //e is the angle between the top side and the target
        e = MathTools.toRadians(MathTools.angleBetweenTwoVectorsVector(topline, centerline));//radians

        S = 0.5 * (a + b + c);
        C = 2 * Math.asin(Math.sqrt((Math.sin(Math.abs(S - a)) * Math.sin(Math.abs(S - b)) / (Math.sin(a) * Math.sin(b)))));

        //double C=Math.acos(Math.cos(c)-Math.cos(a)*Math.cos(b))/(Math.sin(a)*Math.sin(b));//radians
        az = MathTools.toDegrees(C);
        el = MathTools.toDegrees(b);

        if (d > b && d > e) {
            az = 360 - az;
        }
        //correct the azimuth
        //System.out.println("a (CL-RL): " + MathTools.toDegrees(a) + " b (CL-TGTL): " + MathTools.toDegrees(b) + " c (RL-TGTL): " + MathTools.toDegrees(c) + " d (TL-TGTL): " + MathTools.toDegrees(d) + " e (TL-CL): " + MathTools.toDegrees(e) + " C (az):" + MathTools.toDegrees(C));


        //return the azimuth and elevation
        return {
            az: az,
            el: el
        };
    };

    this.checkToSeeIfEarthObscuresLineBetweenSatelliteAndTargetSphericalEarth = function (satellite, targetPosition) {
        //sight algorithm Vallado 295
        var haveSight = false,
            radEarth = Constants.radiusEarth,
            satelliteEci = satellite.getEci(),
            r1 = new THREE.Vector3(
                satelliteEci.getX() / radEarth,
                satelliteEci.getY() / radEarth,
                satelliteEci.getZ() / radEarth
            ),
            r2 = new THREE.Vector3(
                targetPosition.getX() / radEarth,
                targetPosition.getY() / radEarth,
                targetPosition.getZ() / radEarth
            ),

            r1mag = r1.length(),
            r2mag = r2.length(),
            tmin = 0.5,
            ctmin = 0.0,
            r1DotR2;

        if (r1mag < 1 || r2mag < 1) { //one of the points is inside the earth
            haveSight = false;
        } else {
            r1DotR2 = r1.dot(r2);
            tmin = (r1mag * r1mag - r1DotR2) / (r1mag * r1mag + r2mag * r2mag - 2 * r1DotR2);
            if (tmin < 0 || tmin > 1) {
                haveSight = true;
            } else {
                ctmin = (1 - tmin) * r1mag * r1mag + r1DotR2 * tmin;
                if (ctmin >= 1.0) {
                    haveSight = true;
                }
            }

        }
        return !haveSight;
    };

    this.checkToSeeIfEarthObscuresLineBetweenSatelliteAndTargetOblateEarth = function (satellite, targetPosition) {

        //sight algorithm Vallado 295
        var haveSight = false,
            radEarth = Constants.radiusEarth,
            satelliteEci = satellite.getEci(),
            r1 = new THREE.Vector3(
                satelliteEci.getX() / radEarth,
                satelliteEci.getY() / radEarth,
                satelliteEci.getZ() / radEarth
            ),
            r2 = new THREE.Vector3(
                targetPosition.getX() / radEarth,
                targetPosition.getY() / radEarth,
                targetPosition.getZ() / radEarth
            ),
            r1mag = r1.length(),
            r2mag = r2.length(),
            tmin = 0.5,
            ctmin = 0.0,
            r1DotR2;

        //disable the radius magnitude check because it doesn't account for the oblateness of the earth which the LLAcoordinates do account for
        //this can cause points on the surface of the earth to appear inside of a non-oblate earth, causing this check to fail
        //if (r1mag < 1 || r2mag < 1)
        //{ //one of the points is inside the earth
        //    haveSight = false;
        //}
        //else
        //{
        r1DotR2 = r1.dot(r2);
        tmin = (r1mag * r1mag - r1DotR2) / (r1mag * r1mag + r2mag * r2mag - 2 * r1DotR2);
        if (tmin < 0 || tmin > 1) {
            haveSight = true;
        } else {
            ctmin = (1 - tmin) * r1mag * r1mag + r1DotR2 * tmin;
            if (ctmin >= 1.0) {
                haveSight = true;
            }
        }

        //}
        return !haveSight;
    };

    this.checkSensorVisibilityOfTargetPoint = function (satellite, targetPosition) {
        //first, correct the target azimuth and elevation to be in the same frame of reference as the sensor FOV
        var azel = this.determineTargetAzElRelativeToSensor(satellite, targetPosition),

        //then check to see if this point is in the field of view of the sensor
            inFOV = this.shape.canSensorSeePointAtAzEl(azel.az, azel.el),
            earthObscured = this.checkToSeeIfEarthObscuresLineBetweenSatelliteAndTargetOblateEarth(satellite, targetPosition);

        //console.log("earth obscured:" + earthObscured + "    inFOV:" + inFOV);
        if (earthObscured) {
            return false;
        } else {
            if (inFOV === true && earthObscured === false) { //if it's in the field of view and not obscured, indicate that you can see the target
                return true;
            } else {
                return false;
            }
        }
    };

    this.buildPointsToDefineSensorShapeInECI = function (NumPoints, satellite) {
        //returns the instantaneous field of view of the sensor as represented by 
        //a set of 'NumPoints' unit vectors from the center of the satellite to the boundaries
        //of the sensor field of view in ECI coordinates
        //it is assumed that each xyz pair 
        var FOV = [],
            azimuthStep = 360.0 / NumPoints, //the azimuth separation between each point
            i,
            az,
            el,
            FOVboundary,
            FOVmagnitude,
            rswPoint,
            satelliteEci,
            satXpos,
            satYpos,
            satZpos,
            eciTemp;

        for (i = 0; i < NumPoints; i += 1) {
            az = i * azimuthStep;
            el = MathTools.toRadians(this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(az));
            //build the sensor field of view vector in RSW

            //define the vector to the sensor boundary
            FOVboundary = new THREE.Vector3(
                1.0, // radial
                el * Math.cos(MathTools.toRadians(az)), //along
                el * Math.sin(MathTools.toRadians(az))  //cross
            );

            //ensure that it is a unit vector
            FOVmagnitude = FOVboundary.length();

            FOVboundary = FOVboundary.divideScalar(FOVmagnitude);

            //console.log("FOVboundary1: " + JSON.stringify(FOVboundary));

            FOVboundary = QuaternionMath.applyQuaternionRotation(this.quaternionFromRSWToSensor, FOVboundary);

            //console.log("FOVboundary2: " + JSON.stringify(FOVboundary));

            rswPoint = new UNIVERSE.RSWCoordinates(FOVboundary.x, FOVboundary.y, FOVboundary.z);

            satelliteEci = satellite.getEci();
            satXpos = satelliteEci.getX();
            satYpos = satelliteEci.getY();
            satZpos = satelliteEci.getZ();

            //convert the RSW to ECI
            eciTemp = CoordinateConversionTools.convertRSWToECI(satellite, rswPoint);
            FOV[i] = new THREE.Vector3(
                satXpos + eciTemp.getX(),
                satYpos + eciTemp.getY(),
                satZpos + eciTemp.getZ()
            );
        }

        return FOV;
    };

    this.findProjectionPoints = function (endpoints, satellite, distancePastEarthToDraw) {
        var satellitePositionTemp = satellite.getEci(),
            satellitePosition = new THREE.Vector3(satellitePositionTemp.x, satellitePositionTemp.y, satellitePositionTemp.z),

            shiftedEarthCenter = new THREE.Vector3(
                -satellitePosition.x,
                -satellitePosition.y,
                -satellitePosition.z
            ),

            pointsOnEarth = [],

            endPointLen = endpoints.length,
            i,
            shiftedBoundaryPoint,
            satelliteDistanceFromCenterOfEarth,
            depth,
            I,
            c,
            aboveTheEarth = 100,
            r = Constants.radiusEarth + aboveTheEarth, // r is the radius above the earth to project the points....this adds an arbitrary number above the earth to minimize drawing collisions
            Idotc,
            cdotc,
            valueToBeSqrtd,
            sqrtValue,
            distanceToIntersectionPlus,
            distanceToIntersectionMinus,
            pointOnEarth,
            extendedEndPoint,
            unitShiftedEarthCenter,
            angleBetweenEarthCenterAndExtendedEndPoint,
            height,
            distanceToTangentPoint,
            scaleFromEndPointToTangentPoint,
            tangentPoint,
            tangentPointMagnitude,
            scaleToEarthSurface,
            tangentPointOnSurface;

        for (i = 0; i < endPointLen; i += 1) {
            // shift everything to the satellite position as the origin
            shiftedBoundaryPoint = new THREE.Vector3(
                endpoints[i].x - satellitePosition.x,
                endpoints[i].y - satellitePosition.y,
                endpoints[i].z - satellitePosition.z
            );

            satelliteDistanceFromCenterOfEarth = satellitePosition.length();
            depth = satelliteDistanceFromCenterOfEarth + distancePastEarthToDraw;

            // Based on this: http://en.wikipedia.org/wiki/Line%E2%80%93sphere_intersection
            // d = ((I*c) +/- sqrt((I*c)^2 - c*c + r*r))
            I = shiftedBoundaryPoint;
            c = shiftedEarthCenter;

            Idotc = I.dot(c);

            cdotc = c.dot(c);

            valueToBeSqrtd = Idotc * Idotc - cdotc + r * r;

            // Line does intersect the earth so find the point
            if (valueToBeSqrtd >= 0) {
                sqrtValue = Math.sqrt(Idotc * Idotc - cdotc + r * r);
                distanceToIntersectionPlus = Idotc + sqrtValue;
                distanceToIntersectionMinus = Idotc - sqrtValue;

                pointOnEarth = new THREE.Vector3(
                    shiftedBoundaryPoint.x * distanceToIntersectionMinus + satellitePosition.x,
                    shiftedBoundaryPoint.y * distanceToIntersectionMinus + satellitePosition.y,
                    shiftedBoundaryPoint.z * distanceToIntersectionMinus + satellitePosition.z
                );
                if (pointOnEarth.x) {
                    pointsOnEarth.push(pointOnEarth);
                }

            } else { // This means the line does not intersect the earth and we will find the nearest tangent point
                // Scale the boundary point out to the depth
                extendedEndPoint = new THREE.Vector3();
                extendedEndPoint.copy(shiftedBoundaryPoint);
                extendedEndPoint.multiplyScalar(depth);

                // Get a unit vector pointed at the earth center from the satellite coordinate system
                unitShiftedEarthCenter = new THREE.Vector3();
                unitShiftedEarthCenter.copy(shiftedEarthCenter);
                unitShiftedEarthCenter.divideScalar(satelliteDistanceFromCenterOfEarth);

                // Find the angle between the two
                angleBetweenEarthCenterAndExtendedEndPoint = Math.acos(shiftedBoundaryPoint.dot(unitShiftedEarthCenter));

                // http://www.algebralab.org/studyaids/studyaid.aspx?file=Trigonometry_LawSines.xml
                height = satelliteDistanceFromCenterOfEarth * Math.sin(angleBetweenEarthCenterAndExtendedEndPoint);

                // Distance along the line where the tangent point is.  i.e. where the height touches the line
                distanceToTangentPoint = height / Math.atan(angleBetweenEarthCenterAndExtendedEndPoint);

                // Scale to the point and then shift back to earth-centered
                scaleFromEndPointToTangentPoint = distanceToTangentPoint / depth;
                tangentPoint = new THREE.Vector3(
                    (extendedEndPoint.x) * scaleFromEndPointToTangentPoint + satellitePosition.x,
                    (extendedEndPoint.y) * scaleFromEndPointToTangentPoint + satellitePosition.y,
                    (extendedEndPoint.z) * scaleFromEndPointToTangentPoint + satellitePosition.z
                );

                // scale down to the earth's surface, plus an arbitrary distance above the earth
                tangentPointMagnitude = tangentPoint.length();
                scaleToEarthSurface = (Constants.radiusEarth + aboveTheEarth) / tangentPointMagnitude;

                tangentPointOnSurface = new THREE.Vector3();
                tangentPointOnSurface.copy(tangentPoint);
                tangentPointOnSurface.multiplyScalar(scaleToEarthSurface);

                pointsOnEarth.push(tangentPointOnSurface);
            }

        }

        return pointsOnEarth;
    };
};