/*jslint browser: true, sloppy: true */
/*global MathTools, Constants, UNIVERSE, KeplerianCoordinates, THREE, RSWcoordinates */

var CoordinateConversionTools = {

    /**
     * returns the Julian date equivalent of the date provided
     * @param {Date} currentEpoch the time to be converted
     *
     * @returns {double} julianDate julian date in days
     */
    convertCurrentEpochToJulianDate: function (currentEpoch) {
        //convert a date to the Julian Date
        //this is the time since January 1, 4713 BC (12:00)
        //unit of measure = days
        //console.log("convertCurrentEpochToJulianDate:currentEpoch: " + currentEpoch);
        var JD = 0, //double
            year = currentEpoch.getUTCFullYear(),  //int
            month = currentEpoch.getUTCMonth() + 1,      //int
            day = currentEpoch.getUTCDate(),         //int
            hour = currentEpoch.getUTCHours(),       //int
            minute = currentEpoch.getUTCMinutes(),   //int
            second = currentEpoch.getUTCSeconds() + (currentEpoch.getUTCMilliseconds() / 1000);   //double

        // console.log("year: " + year);
        //         console.log("month: " + month);
        //         console.log("day: " + day);
        //         console.log("hour: " + hour);
        //         console.log("minute: " + minute);
        //         console.log("second: " + second);

        JD = 367 * year - Math.floor((7 * (year + Math.floor(((month + 9) / 12))) / 4)) +
            Math.floor((275 * month / 9)) + (day) + 1721013.5 +
            ((second / 60 + minute) / 60 + hour) / 24;

        return JD;
    },

    /**
     * returns the Greenwich mean sideral time for the current epoch
     * @param {Date} currentEpoch the time to be converted
     *
     * @returns {double} GST angle in degrees
     */
    convertTimeToGMST: function (currentEpoch) {
        var JD = this.convertCurrentEpochToJulianDate(currentEpoch), //double

            //double - julian centuries since January 1, 2000 12h UT1
            TUT = (JD - 2451545.0) / 36525.0,

            //this is in seconds
            GMST = 67310.54841 + (876600.0 * 3600 + 8640184.812866) * TUT +
                0.093104 * TUT * TUT - (0.0000062) * TUT * TUT * TUT,  //double

            multiples = Math.floor(GMST / 86400.0); //double

        GMST = GMST - multiples * 86400.00;   //reduce it to be within the range of one day
        GMST = GMST / 240.0; //convert to degrees

        if (GMST < 0) {
            GMST = GMST + 360;
        }

        return GMST;  //degrees
    },

    /**
     * returns the Earth Centered Earth Fixed XYZ equivalent of a passed
     * lat/lon/alt coordinate. Note that the returned velocity terms in ECEF
     * are set to zero (ignores Earth's rotation)
     * @param {LLACoordinates} lla lat/lon/alt
     *
     * @returns {ECEFCoordinates} ecef Earth Centered Earth Fixed XYZ coordinates (km)
     */
    convertLLAtoECEF: function (lla) {
        //lat = ground station latitude (deg)
        //lon = ground station longitude (deg)
        //alt = ground station altitude (km)

        var lat = MathTools.toRadians(lla.getLatitude()),  //double
            lon = MathTools.toRadians(lla.getLongitude()), //double
            Re = Constants.radiusEarth,          //double - radius of the earth (mean) in kilometers
            eearth = Constants.eccEarthSphere,   //double - eccentricity of the Earth's shape
            sinLat = Math.sin(lat),                   //double
            hellp = lla.getAltitude(),                //double - height above the elliptical earth

            //REFER TO VALLADO PAGE 144 and 150
            cearth = Re / Math.sqrt(1 - eearth * eearth * sinLat * sinLat), //double
            searth = Re * (1 - eearth * eearth) /
                Math.sqrt(1 - eearth * eearth * sinLat * sinLat), //double

            x = (cearth + hellp) * (Math.cos(lat) * Math.cos(lon)), //double
            y = (cearth + hellp) * (Math.cos(lat) * Math.sin(lon)), //double
            z = (searth + hellp) * (Math.sin(lat)),                 //double

            ecef = new UNIVERSE.ECEFCoordinates(x, y, z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

        return ecef;
    },

    /**
     * returns the lat/lon/alt equivalent of an Earth Centered Earth Fixed coordinate
     * @param {ECEFCoordinates} ecef Earth Centered Earth Fixed XYZ coordinates (km)
     *
     * @returns {LLACoordinates} lla lat/lon/alt
     */
    convertECEFtoLLA: function (ecef) {
        //lat = ground station latitude (deg)
        //lon = ground station longitude (deg)
        //alt = ground station altitude (km)

        //REFER TO VALLADO PAGE 177
        var lla = new UNIVERSE.LLACoordinates(),

            ri = ecef.getX(), //double
            rj = ecef.getY(), //double
            rk = ecef.getZ(), //double

            ecc = Constants.eccEarthSphere, //double - eccentricity of the Earth's surface
            Re = Constants.radiusEarth,     //double - radius of the earth (mean) in kilometers

            rdelta = Math.sqrt((ri * ri) + (rj * rj)),  //double
            sinalpha = rj / rdelta,                 //double
            cosalpha = ri / rdelta,                 //double
            alpha = Math.atan(sinalpha / cosalpha), //double

            lambda = alpha,              //double - same as the longitude
            tandelta = rk / rdelta,      //double
            delta = Math.atan(tandelta), //double

            tolerance = 1e-8, //double
            c = 0,            //double
            lat = delta,      //double
            latOld = 2000,    //double
            sinLat,           //double
            tanLat,           //double
            count = 0;        //int

        while (Math.abs(lat - latOld) > tolerance) {
            latOld = lat;
            sinLat = Math.sin(latOld);
            c = Re / Math.sqrt(1 - (ecc * ecc * sinLat * sinLat));
            tanLat = (rk + c * ecc * ecc * sinLat) / rdelta;
            lat = Math.atan(tanLat);

            count += 1;

            if (count > 500) {
                lat = 0;
                latOld = 0;
            }
        }

        //correct the quadrants
        if (lambda < -Math.PI) {
            lambda = lambda + 2 * Math.PI;
        }

        if (lambda > Math.PI) {
            lambda = lambda - 2 * Math.PI;
        }

        lla.setLatitude(MathTools.toDegrees(lat));
        lla.setLongitude(MathTools.toDegrees(lambda));
        lla.setAltitude(rdelta / Math.cos(lat) - c);

        return lla;
    },

    /**
     * returns the Earth Centered Earth Fixed coordinate equivalent of the 
     * provided Earth Centered Inertial coordinate at a given point in time
     * represented by the Greenwich Mean Sideral Time angle
     * @param {ECICoordinates} eci Earth Centered Intertial XYZ coordinates (km)
     * @param {double} GST Greenwich Mean Sideral Time angle in degrees
     *
     * @returns {ECEFCoordinates} ecef Earth Centered Earth Fixed XYZ coordinates (km)
     */
    convertECItoECEF: function (eci, GST) {
        //GST is in degrees
        var ecef = new UNIVERSE.ECEFCoordinates(),

        //convert the position
            eciPos = [], //Double[3];
            xyz,
            eciVel,
            eciAcc;

        eciPos[0] = eci.getX();
        eciPos[1] = eci.getY();
        eciPos[2] = eci.getZ();

        xyz = MathTools.rot3(GST, eciPos); //Double[3];
        ecef.setX(xyz[0]);
        ecef.setY(xyz[1]);
        ecef.setZ(xyz[2]);

        //convert the velocity
        eciVel = []; //Double[3];
        eciVel[0] = eci.getVX();
        eciVel[1] = eci.getVY();
        eciVel[2] = eci.getVZ();

        xyz = MathTools.rot3(GST, eciVel);

        ecef.setVX(xyz[0]);
        ecef.setVY(xyz[1]);
        ecef.setVZ(xyz[2]);

        //convert the acceleration
        eciAcc = []; //Double[3];
        eciAcc[0] = eci.getAX();
        eciAcc[1] = eci.getAY();
        eciAcc[2] = eci.getAZ();

        xyz = MathTools.rot3(GST, eciAcc);

        ecef.setAX(xyz[0]);
        ecef.setAY(xyz[1]);
        ecef.setAZ(xyz[2]);

        return ecef;
    },

    /**
     * returns the Earth Centered Inertial coordinate equivalent of the 
     * provided Earth Centered Earth Fixed coordinate at a given point in time
     * represented by the Greenwich Mean Sideral Time angle
     * @param {ECEFCoordinates} ecef Earth Centered Earth Fixed XYZ coordinates (km)
     * @param {double} GST Greenwich Mean Sideral Time angle in degrees
     *
     * @returns {ECICoordinates} eci Earth Centered Intertial XYZ coordinates (km)
     */
    convertECEFtoECI: function (ecef,  GST) {
        //GST is in degrees
        var eci = new UNIVERSE.ECICoordinates(),
            eciPos,
            xyz,
            eciVel,
            eciAcc;

        //convert the position
        eciPos = []; //Double[3];
        eciPos[0] = ecef.getX();
        eciPos[1] = ecef.getY();
        eciPos[2] = ecef.getZ();

        xyz = MathTools.rot3(-GST, eciPos);
        eci.setX(xyz[0]);
        eci.setY(xyz[1]);
        eci.setZ(xyz[2]);

        //convert the velocity
        eciVel = []; //Double[3];
        eciVel[0] = ecef.getVX();
        eciVel[1] = ecef.getVY();
        eciVel[2] = ecef.getVZ();

        xyz = MathTools.rot3(-GST, eciVel);

        eci.setVX(xyz[0]);
        eci.setVY(xyz[1]);
        eci.setVZ(xyz[2]);

        //convert the acceleration
        eciAcc = []; //Double[3];
        eciAcc[0] = ecef.getAX();
        eciAcc[1] = ecef.getAY();
        eciAcc[2] = ecef.getAZ();

        xyz = MathTools.rot3(-GST, eciAcc);

        eci.setAX(xyz[0]);
        eci.setAY(xyz[1]);
        eci.setAZ(xyz[2]);

        return eci;
    },

    /**
     * returns the Lat/Lon/Alt coordinate equivalent of the 
     * provided Earth Centered Inertial coordinate at a given point in time
     * represented by the Greenwich Mean Sideral Time angle
     * @param {ECICoordinates} eci Earth Centered Intertial XYZ coordinates (km)
     * @param {double} GST Greenwich Mean Sideral Time angle in degrees
     *
     * @returns {LLACoordinates} lla lat/lon/alt
     */
    convertECItoLLA: function (eci, GST) {
        var ecef = this.convertECItoECEF(eci, GST); //ECEFCoordinates
        return this.convertECEFtoLLA(ecef);
    },

    /**
     * returns the Earth Centered Inertial coordinate equivalent of the 
     * provided Lat/Lon/Alt coordinate at a given point in time
     * represented by the Greenwich Mean Sideral Time angle
     * @param {LLACoordinates} lla lat/lon/alt
     * @param {double} GST Greenwich Mean Sideral Time angle in degrees
     *
     * @returns {ECICoordinates} eci Earth Centered Intertial XYZ coordinates (km)
     */
    convertLLAtoECI: function (lla, GST) {
        var ecef = this.convertLLAtoECEF(lla); //ECEFCoordinates
        return this.convertECEFtoECI(ecef, GST);
    },

    /**
     * Estimates a vehicle's Earth Centered Inertial coordinates and velocity based upon the
     * Keplerian orbital elements of the vehicle
     * NOTE: results only valid for eccentricities <1 (elliptical and circular orbits)
     * @param {KeplerianCoordinates} keplar Keplerian orbital elements of the vehicle
     *
     * @returns {ECICoordinates} eci Earth Centered Intertial XYZ coordinates (km)
     */
    convertKeplerianToECI: function (kepler) {
        var eci = new UNIVERSE.ECICoordinates(),
            a = kepler.getSemimajorAxis(), //double
            e = kepler.getEccentricity(),  //double
            p = a * (1 - e * e),           //double
            nu = kepler.getTrueAnomaly(),  //double

            //reference vallado page 125
            cosNu = Math.cos(MathTools.toRadians(nu)), //double
            sinNu = Math.sin(MathTools.toRadians(nu)), //double

            //determine the position conversion;    //double
            Xpqw = p * cosNu / (1 + e * cosNu), //double
            Ypqw = p * sinNu / (1 + e * cosNu), //double
            Zpqw = 0,                           //double

            pqw = [], //Double[3];
            eciValues, //Double[3];
            VXpqw, //double
            VYpqw,
            VZpqw;

        pqw[0] = Xpqw;
        pqw[1] = Ypqw;
        pqw[2] = Zpqw;

        eciValues = MathTools.rot3(-kepler.getArgOfPerigee(), pqw);
        eciValues = MathTools.rot1(-kepler.getInclination(), eciValues);
        eciValues = MathTools.rot3(-kepler.getRaan(), eciValues);
        eci.setX(eciValues[0]);
        eci.setY(eciValues[1]);
        eci.setZ(eciValues[2]);

        //determine the velocity conversion;
        VXpqw = -Math.sqrt(Constants.muEarth / p) * sinNu;
        VYpqw = Math.sqrt(Constants.muEarth / p) * (e + cosNu); //double
        VZpqw = 0;                                                   //double
        pqw[0] = VXpqw;
        pqw[1] = VYpqw;
        pqw[2] = VZpqw;
        eciValues = MathTools.rot3(-kepler.getArgOfPerigee(), pqw);
        eciValues = MathTools.rot1(-kepler.getInclination(), eciValues);
        eciValues = MathTools.rot3(-kepler.getRaan(), eciValues);
        eci.setVX(eciValues[0]);
        eci.setVY(eciValues[1]);
        eci.setVZ(eciValues[2]);

        return eci;
    },

    /**
     * Estimates a vehicle's keplerian orbital elements based upon the
     * Earth Centered Inertial coordinates and velocity of the vehicle
     * NOTE: results only valid for eccentricities <1 (elliptical and circular orbits)
     * @param {ECICoordinates} eci Earth Centered Intertial XYZ coordinates (km)
     *
     * @returns {KeplerianCoordinates} keplar Keplerian orbital elements of the vehicle
     *
     */
    convertECIToKeplerian: function (eci) {
        var kepler = new KeplerianCoordinates(),

            //reference Vallado 120

            r = new THREE.Vector3(
                eci.x,
                eci.y,
                eci.z
            ),

            v = new THREE.Vector3(
                eci.vx,
                eci.vy,
                eci.vz
            ),

            h = new THREE.Vector3(),
            hmag,
            rmag,
            vmag,
            khat,
            n,
            coeff1,
            coeff2,
            e,
            emag,
            energy,
            p,
            a,
            inc,
            raan,
            arg,
            value,
            nu,
            sinNu,
            cosNu,
            sinEA,
            cosEA,
            EA,
            MA;

        h.cross(r, v); //Double[3]
        hmag = h.length(); //double
        rmag = r.length(); //double
        vmag = v.length(); //double

        khat = new THREE.Vector3(
            0.0,
            0.0,
            1.0
        );

        n = new THREE.Vector3();
        n.cross(khat, h);

        coeff1 = vmag * vmag - Constants.muEarth / rmag; //double
        coeff2 = r.dot(v);            //double

        e = new THREE.Vector3(
            (1 / Constants.muEarth) * (coeff1 * r.x - coeff2 * v.x),
            (1 / Constants.muEarth) * (coeff1 * r.y - coeff2 * v.y),
            (1 / Constants.muEarth) * (coeff1 * r.z - coeff2 * v.z)
        );

        emag = e.length();                       //double
        energy = vmag * vmag / 2 - Constants.muEarth / rmag; //double

        p = 0.0; //double
        a = 0.0; //double

        if (emag === 1.0) {
            a = Infinity;
            p = hmag * hmag / Constants.muEarth;
        } else {
            a = -Constants.muEarth / (2 * energy);
            p = a * (1 - emag * emag);
        }

        inc = MathTools.toDegrees(Math.acos(h.z / hmag));                    //double
        raan = MathTools.toDegrees(Math.acos(n.x / n.length())); //double

        if (n.y < 0) {
            raan = 360 - raan;
        }


        arg = MathTools.toDegrees(Math.acos(n.dot(e) /
            (n.length() * emag)));  //double

        if (e.z < 0) {
            arg = 360 - arg;
        }

        // console.log("MathTools.dotMultiplyVector(e, r) / (emag * rmag): " + MathTools.dotMultiplyVector(e, r) / (emag * rmag) )
        // console.log("Math.acos(MathTools.dotMultiplyVector(e, r) / (emag * rmag)): " + Math.acos(MathTools.dotMultiplyVector(e, r) / (emag * rmag)));

        value = e.dot(r) / (emag * rmag);
        if (value > 1) {
            // console.log("setting to 1");
            value = 1;
        }
        nu = MathTools.toDegrees(Math.acos(value)); //double
        // console.log("nu: " + nu);
        if (v.dot(r) < 0) {
            nu = 360 - nu;
        }

        if (isNaN(raan)) {
            raan = 0.00001;
        }

        if (isNaN(arg)) {
            arg = 0.00001;
        }

        kepler.setSemimajorAxis(a);
        kepler.setEccentricity(emag);
        kepler.setTrueAnomaly(nu);
        kepler.setRaan(raan);
        kepler.setInclination(inc);
        kepler.setMeanMotion(MathTools.toDegrees(Math.sqrt(Constants.muEarth / (a * a * a))));
        kepler.setArgOfPerigee(arg);

        //figure out the mean anomaly
        sinNu = Math.sin(MathTools.toRadians(nu));
        cosNu = Math.cos(MathTools.toRadians(nu));
        sinEA = ((sinNu * Math.sqrt(1 - emag * emag)) / (1 + emag * cosNu));
        cosEA = ((emag + cosNu) / (1 + emag * cosNu));
        EA = Math.atan2(sinEA, cosEA);
        MA = EA - emag * sinEA;
        MA = MathTools.toDegrees(MA);
        kepler.setMeanAnomaly(MA);

        return kepler;
    },

    /**
     * returns the rotation matrix (3x3) used to convert an Earth Centered Inertial
     * coordinate to a satellites's Radial, Along Track, Cross Track coordinates 
     * relative to the satellite's center
     * @param {satellite} SimulationObject
     *
     * @returns {double[][]} rotationMatrix (unitless)
     */
    buildRotationMatrixToConvertECItoRSW: function (satellite) {
        var satelliteKepler = CoordinateConversionTools.convertECIToKeplerian(satellite.getEci()), //KeplerianCoords

            nu = satelliteKepler.getTrueAnomaly(),  //double
            w = satelliteKepler.getArgOfPerigee(),  //double
            inc = satelliteKepler.getInclination(), //double
            raan = satelliteKepler.getRaan(),       //double

            netRotationMatrix = new Array(3),

            i = 0;
        for (i = 0; i < 3; i += 1) {//create as Double[3][3]; 
            netRotationMatrix[i] = new Array(3);
        }

        netRotationMatrix = MathTools.buildRotationMatrix3(raan);
        netRotationMatrix = MathTools.multiply2dBy2d(MathTools.buildRotationMatrix1(inc), netRotationMatrix);
        netRotationMatrix = MathTools.multiply2dBy2d(MathTools.buildRotationMatrix3(w), netRotationMatrix);
        netRotationMatrix = MathTools.multiply2dBy2d(MathTools.buildRotationMatrix3(nu), netRotationMatrix);

        return netRotationMatrix;
    },

    /**
     * returns the Radial, Along Track, Cross Track coordinate equivalent of a 
     * provided Earth Centered Inertial coordinate relative to the satellite's center
     * @param satellite SimulationObject
     * @param {ECICoordinates} targetECI Earth Centered Intertial XYZ coordinates of the target object/point(km)
     *
     * @returns {RSWcoordinates} rsw RSW equivalent point (km)
     *
     */
    convertTargetECIToSatelliteRSW: function (satellite, targetECI) {
        var rsw = new RSWcoordinates(),
            satelliteKepler = CoordinateConversionTools.convertECIToKeplerian(satellite.getEci()), //KeplerianCoordinates
            satelliteECI = satellite.getEci(),       //ECICoordinates

            nu = satelliteKepler.getTrueAnomaly(),  //double
            w = satelliteKepler.getArgOfPerigee(),  //double
            inc = satelliteKepler.getInclination(), //double
            raan = satelliteKepler.getRaan(),       //double

            rijk = []; //Double[3];
        rijk[0] = targetECI.getX() - satelliteECI.getX();
        rijk[1] = targetECI.getY() - satelliteECI.getY();
        rijk[2] = targetECI.getZ() - satelliteECI.getZ();

        rijk = MathTools.rot3(raan, rijk);
        rijk = MathTools.rot1(inc, rijk);
        rijk = MathTools.rot3(w, rijk);
        rijk = MathTools.rot3(nu, rijk);

        rsw.setRadial(rijk[0]);
        rsw.setAlongTrack(rijk[1]);
        rsw.setCrossTrack(rijk[2]);

        return rsw;
    },

    /**
     * returns the Earth Centered Inertial coordinate equivalent of a provided 
     * Radial, Along Track, Cross Track coordinate relative to the satellite's center
     * @param satellite SimulationObject
     * @param {RSWcoordinates} rsw RSW point in question (km)
     *
     * @returns {ECICoordinates} eci Earth Centered Intertial equivalent point (km)
     */
    convertRSWToECI: function (satellite, rsw) {
        var eci = new UNIVERSE.ECICoordinates(),
            satelliteKepler = CoordinateConversionTools.convertECIToKeplerian(satellite.getEci()),

            nu = satelliteKepler.getTrueAnomaly(),
            w = satelliteKepler.getArgOfPerigee(),
            inc = satelliteKepler.getInclination(),
            raan = satelliteKepler.getRaan(),

            rswVec = [],        //Double[3];
            rijk;
        rswVec[0] = rsw.radial;
        rswVec[1] = rsw.alongTrack;
        rswVec[2] = rsw.crossTrack;

        rijk = [];              //Double[3];
        rijk = MathTools.rot3(-nu, rswVec);  //to PQW format
        rijk = MathTools.rot3(-w, rijk);
        rijk = MathTools.rot1(-inc, rijk);
        rijk = MathTools.rot3(-raan, rijk);

        eci.setX(rijk[0]);
        eci.setY(rijk[1]);
        eci.setZ(rijk[2]);

        return eci;
    },

    /**
     * returns the position of the sun in Earth Centered Inertial coordinates
     * at the indicated time
     * @param {Date} currentEpoch the time in question
     *
     * @returns {ECICoordinates} eci Earth Centered Intertial XYZ coordinates (km)
     */
    getSunPositionECIAtCurrentTime: function (currentEpoch) {
        //ref Vallado 266
        var JD = this.convertCurrentEpochToJulianDate(currentEpoch),

        //julian centuries since January 1, 2000 12h UT1
            TUT = (JD - 2451545.0) / 36525.0,
            lambdaSun = 280.4606184 + 36000.77005361 * TUT,  //solar angle (deg)
            Msun = 357.5277233 + 35999.05034 * TUT,
            lambdaEcliptic = lambdaSun + 1.914666471 *
                Math.sin(MathTools.toRadians(Msun)) + 0.019994643 *
                Math.sin(2 * MathTools.toRadians(Msun)), //ecliptic angle (deg)

        //distance of the sun in AU
            rsun = 1.000140612 - 0.016708617 * Math.cos(MathTools.toRadians(Msun)) -
                0.000139589 * Math.cos(2 * MathTools.toRadians(Msun)),
            e = 23.439291 - 0.0130042 * TUT,  //ecliptic latitude on the earth

            AU = 149597870.0,  //one astronomical unit (km)
            sunPosition = new UNIVERSE.ECICoordinates();

        sunPosition.setX(rsun * Math.cos(MathTools.toRadians(lambdaEcliptic)) * AU);
        sunPosition.setY(rsun * Math.cos(MathTools.toRadians(e)) *
            Math.sin(MathTools.toRadians(lambdaEcliptic)) * AU);
        sunPosition.setZ(rsun * Math.sin(MathTools.toRadians(e)) *
            Math.sin(MathTools.toRadians(lambdaEcliptic)) * AU);

        return sunPosition;
    },

    /**
     * returns the Barycentric time equivalent of the provided time
     * at the indicated time
     * NOTE: accurate on the order of 100 km
     * @param {Date} currentEpoch the time in question
     *
     * @returns {double} BT Barycentric time equivalent (days)
     */
    convertCurrentEpochToBarycentricTime: function (currentEpoch) {
        //reference Vallado 3rd edition page 201
        var UTC = new Date(currentEpoch),
            UTI = new Date(UTC.getTime() - 463),
            TAI = new Date(UTI.getTime() + 32000),
            TT = new Date(TAI.getTime() + 32184),
            JDtt = this.convertCurrentEpochToJulianDate(TT),
            Ttt = (JDtt - 2451545.0) / 36525.0,
            TDB = new Date(TT.getTime() + ((0.001658 * Math.sin(628.3076 * Ttt + 6.2401)) * 1000)),
            JDtdb = this.convertCurrentEpochToJulianDate(TDB),
            Ttdb = (JDtdb - 2451545.0) / 36525.0;  //julian centuries since January 1, 2000 12h UT1  //this is the terrestrial time


        //*******************************
        //note, this may have issues due to the fact that the date objects don't use fractions of seconds
        //*******************************

        return Ttdb;
    },

    /**
     * returns the position of the moon in Earth Centered Inertial coordinates
     * at the indicated time
     * NOTE: accurate on the order of 100 km
     * @param {Date} currentEpoch the time in question
     *
     * @returns {ECICoordinates} eci Earth Centered Intertial XYZ coordinates (km)
     */
    getMoonPositionECIAtCurrentTime: function (currentEpoch) {
        var Ttdb = CoordinateConversionTools.convertCurrentEpochToBarycentricTime(currentEpoch),
            lambda = 218.32 + 481267.8813 * Ttdb,
            phi,
            parallax,
            e,
            rMoon,
            moonPosition;

        lambda += 6.29 * Math.sin(MathTools.toRadians(134.9 + 477198.85 * Ttdb));
        lambda += -1.27 * Math.sin(MathTools.toRadians(259.2 - 413335.38 * Ttdb));
        lambda += 0.66 * Math.sin(MathTools.toRadians(235.7 + 890534.23 * Ttdb));
        lambda += 0.21 * Math.sin(MathTools.toRadians(269.9 + 954397.70 * Ttdb));
        lambda += -0.19 * Math.sin(MathTools.toRadians(357.5 + 35999.05 * Ttdb));
        lambda += -0.11 * Math.sin(MathTools.toRadians(186.6 + 966404.05 * Ttdb));  //degrees
        if (Math.abs(lambda) > 360) {
            lambda = (lambda % 360);
        }
        if (lambda < 0) {
            lambda += 360;
        }


        phi = 5.13 * Math.sin(MathTools.toRadians(93.3 + 483202.03 * Ttdb));
        phi += 0.28 * Math.sin(MathTools.toRadians(228.2 + 960400.87 * Ttdb));
        phi += -0.28 * Math.sin(MathTools.toRadians(318.3 + 6003.18 * Ttdb));
        phi += -0.17 * Math.sin(MathTools.toRadians(217.6 - 407332.20 * Ttdb));
        if (Math.abs(phi) > 360) {
            phi = (phi % 360);
        }
        if (phi < 0) {
            phi += 360;
        }

        parallax = 0.9508 + 0.0518 * Math.cos(MathTools.toRadians(134.9 + 477198.85 * Ttdb));
        parallax += +0.0095 * Math.cos(MathTools.toRadians(259.2 - 413335.38 * Ttdb));
        parallax += +0.0078 * Math.cos(MathTools.toRadians(235.7 + 890534.23 * Ttdb));
        parallax += +0.0028 * Math.cos(MathTools.toRadians(269.9 + 954397.70 * Ttdb));
        if (Math.abs(parallax) > 360) {
            parallax = (parallax % 360);
        }
        if (parallax < 0) {
            parallax += 360;
        }

        e = 23.439291 - 0.0130042 * Ttdb;//obliquity of the ecliptic
        rMoon = 1 / Math.sin(MathTools.toRadians(parallax));//earth radii
        rMoon = rMoon * Constants.radiusEarth;//km

        e = MathTools.toRadians(e);
        phi = MathTools.toRadians(phi);
        lambda = MathTools.toRadians(lambda);


        moonPosition = new UNIVERSE.ECICoordinates();
        moonPosition.setX(rMoon * Math.cos(phi) * Math.cos(lambda));
        moonPosition.setY(rMoon * (Math.cos(e) * Math.cos(phi) * Math.sin(lambda) - Math.sin(e) * Math.sin(phi)));
        moonPosition.setZ(rMoon * (Math.sin(e) * Math.cos(phi) * Math.sin(lambda) + Math.cos(e) * Math.sin(phi)));
        return moonPosition;
    }
};
