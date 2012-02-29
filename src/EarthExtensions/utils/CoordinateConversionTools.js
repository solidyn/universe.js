var CoordinateConversionTools = {

    /**
     *
     * @param currentEpoch Date
     *
     * @returns
     */
    convertCurrentEpochToJulianDate: function(currentEpoch)
    {
        //convert a date to the Julian Date
        //this is the time since January 1, 4713 BC (12:00)
        //unit of measure = days
	//console.log("convertCurrentEpochToJulianDate:currentEpoch: " + currentEpoch);
        var JD = 0;                               //double
        var year = currentEpoch.getUTCFullYear();  //int
        var month = currentEpoch.getUTCMonth() + 1;      //int
        var day = currentEpoch.getUTCDate();         //int
        var hour = currentEpoch.getUTCHours();       //int
        var minute = currentEpoch.getUTCMinutes();   //int
        var second = currentEpoch.getUTCSeconds() + (currentEpoch.getUTCMilliseconds()/1000);   //double

		// console.log("year: " + year);
		// 		console.log("month: " + month);
		// 		console.log("day: " + day);
		// 		console.log("hour: " + hour);
		// 		console.log("minute: " + minute);
		// 		console.log("second: " + second);

        JD = 367 * year - Math.floor((7 * (year + Math.floor(((month + 9) / 12))) / 4)) +
            Math.floor((275 * month / 9)) + (day) + 1721013.5 +
            ((second / 60 + minute) / 60 + hour) / 24;

        return JD;
    },

    /**
     *
     * @param currentEpoch Date
     *
     * @returns double
     */
    convertTimeToGMST: function(currentEpoch)
    {
        var JD = this.convertCurrentEpochToJulianDate(currentEpoch); //double

        //double - julian centuries since January 1, 2000 12h UT1
        var TUT = (JD - 2451545.0) / 36525.0;

        //this is in seconds
        var GMST = 67310.54841 + (876600.0 * 3600 + 8640184.812866) * TUT +
            0.093104 * TUT * TUT - (0.0000062) * TUT * TUT * TUT;  //double

        var multiples = Math.floor(GMST / 86400.0); //double

        GMST = GMST - multiples * 86400.00;   //reduce it to be within the range of one day
        GMST = GMST / 240.0; //convert to degrees

        if (GMST < 0)
        {
            GMST = GMST + 360;
        }

        return GMST;  //degrees
    },

    /**
     *
     * @param LLACoordinates
     *
     * @returns ECEFCoordinates
     */
    convertLLAtoECEF: function(lla)
    {
        //lat = ground station latitude (deg)
        //lon = ground station longitude (deg)
        //alt = ground station altitude (km)

        var lat = MathTools.toRadians(lla.getLatitude());  //double
        var lon = MathTools.toRadians(lla.getLongitude()); //double
        var Re = Constants.radiusEarth;          //double - radius of the earth (mean) in kilometers
        var eearth = Constants.eccEarthSphere;   //double - eccentricity of the Earth's shape
        var sinLat = Math.sin(lat);                   //double
        var hellp = lla.getAltitude();                //double - height above the elliptical earth

        //REFER TO VALLADO PAGE 144 and 150
        var cearth = Re / Math.sqrt(1 - eearth * eearth * sinLat * sinLat); //double
        var searth = Re * (1 - eearth * eearth) / 
            Math.sqrt(1 - eearth * eearth * sinLat * sinLat); //double

        var x = (cearth + hellp) * (Math.cos(lat) * Math.cos(lon)); //double
        var y = (cearth + hellp) * (Math.cos(lat) * Math.sin(lon)); //double
        var z = (searth + hellp) * (Math.sin(lat));                 //double

        var ecef = new UNIVERSE.ECEFCoordinates(x, y, z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

        return ecef;
    },

    /**
     *
     * @param ecef ECEFCoordinates
     *
     * @returns LLACoordinates
     */
    convertECEFtoLLA: function(ecef)
    {
        //lat = ground station latitude (deg)
        //lon = ground station longitude (deg)
        //alt = ground station altitude (km)

        //REFER TO VALLADO PAGE 177
        var lla = new UNIVERSE.LLACoordinates();

        var ri = ecef.getX(); //double
        var rj = ecef.getY(); //double
        var rk = ecef.getZ(); //double

        var ecc = Constants.eccEarthSphere; //double - eccentricity of the Earth's surface
        var Re = Constants.radiusEarth;     //double - radius of the earth (mean) in kilometers

        var rdelta = Math.sqrt((ri * ri) + (rj * rj));  //double
        var sinalpha = rj / rdelta;                 //double
        var cosalpha = ri / rdelta;                 //double
        var alpha = Math.atan(sinalpha / cosalpha); //double
 
        var lambda = alpha;              //double - same as the longitude
        var tandelta = rk / rdelta;      //double
        var delta = Math.atan(tandelta); //double

        var tolerance = 1e-8; //double
        var c = 0;            //double
        var lat = delta;      //double
        var latOld = 2000;    //double
        var sinLat;           //double
        var tanLat;           //double
        var count = 0;        //int

        while (Math.abs(lat - latOld) > tolerance)
        {
            latOld = lat;
            sinLat = Math.sin(latOld);
            c = Re / Math.sqrt(1 - (ecc * ecc * sinLat * sinLat));
            tanLat = (rk + c * ecc * ecc * sinLat) / rdelta;
            lat = Math.atan(tanLat);
            
            count++;

            if (count > 500)
            {
                lat = 0;
                latOld = 0;
            }
        }

        //correct the quadrants
        if (lambda < -Math.PI)
        {
            lambda = lambda + 2 * Math.PI;
        }

        if (lambda > Math.PI)
        {
            lambda = lambda - 2 * Math.PI;
        }

        lla.setLatitude(MathTools.toDegrees(lat));
        lla.setLongitude(MathTools.toDegrees(lambda));
        lla.setAltitude(rdelta / Math.cos(lat) - c);

        return lla;
    },

    /**
     *
     * @param eci ECICoordinates
     * @param GST double
     *
     * @returns ECEFCoordinates
     */
    convertECItoECEF: function(eci, GST)
    {
        //GST is in degrees
        var ecef = new UNIVERSE.ECEFCoordinates();

        //convert the position
        eciPos = new Array(); //Double[3];
        eciPos[0] = eci.getX();
        eciPos[1] = eci.getY();
        eciPos[2] = eci.getZ();

        var xyz = MathTools.rot3(GST, eciPos); //Double[3];
        ecef.setX(xyz[0]);
        ecef.setY(xyz[1]);
        ecef.setZ(xyz[2]);

        //convert the velocity
        var eciVel = new Array(); //Double[3];
        eciVel[0] = eci.getVX();
        eciVel[1] = eci.getVY();
        eciVel[2] = eci.getVZ();

        xyz = MathTools.rot3(GST, eciVel);

        ecef.setVX(xyz[0]);
        ecef.setVY(xyz[1]);
        ecef.setVZ(xyz[2]);

        //convert the acceleration
        var eciAcc = new Array(); //Double[3];
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
     *
     * @param ecef ECEFCoordinates
     * @param GST  double
     *
     * @returns ECICoordinates
     */
    convertECEFtoECI: function(ecef,  GST)
    {
        //GST is in degrees
        var eci = new UNIVERSE.ECICoordinates();

        //convert the position
        var eciPos = new Array(); //Double[3];
        eciPos[0] = ecef.getX();
        eciPos[1] = ecef.getY();
        eciPos[2] = ecef.getZ();

        var xyz = MathTools.rot3(-GST, eciPos);
        eci.setX(xyz[0]);
        eci.setY(xyz[1]);
        eci.setZ(xyz[2]);

        //convert the velocity
        var eciVel = new Array(); //Double[3];
        eciVel[0] = ecef.getVX();
        eciVel[1] = ecef.getVY();
        eciVel[2] = ecef.getVZ();

        xyz = MathTools.rot3(-GST, eciVel);

        eci.setVX(xyz[0]);
        eci.setVY(xyz[1]);
        eci.setVZ(xyz[2]);

        //convert the acceleration
        var eciAcc = new Array(); //Double[3];
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
     *
     * @param eci ECICoordinates
     * @param GST double
     *
     * @returns LLACoordinates
     */
    convertECItoLLA: function(eci, GST)
    {
        var ecef = this.convertECItoECEF(eci, GST); //ECEFCoordinates
        return this.convertECEFtoLLA(ecef);
    },

    /**
     *
     * @param lla LLAcoordinates
     * @param GST double
     *
     * @returns ECICoordinates
     */
    convertLLAtoECI: function(lla, GST)
    {
        var ecef = this.convertLLAtoECEF(lla); //ECEFCoordinates
        return this.convertECEFtoECI(ecef, GST);
    },

    /**
     *
     * @param keplar KeplerianCoordinates
     *
     * @returns ECICoordinates
     */
    convertKeplerianToECI: function(kepler)
    {
        var eci = new UNIVERSE.ECICoordinates();
        var a = kepler.getSemimajorAxis(); //double
        var e = kepler.getEccentricity();  //double
        var p = a * (1 - e * e);           //double
        var nu = kepler.getTrueAnomaly();  //double

        //reference vallado page 125
        var cosNu = Math.cos(MathTools.toRadians(nu)); //double
        var sinNu = Math.sin(MathTools.toRadians(nu)); //double

        //determine the position conversion;    //double
        var Xpqw = p * cosNu / (1 + e * cosNu); //double
        var Ypqw = p * sinNu / (1 + e * cosNu); //double
        var Zpqw = 0;                           //double

        var pqw = new Array(); //Double[3];
        pqw[0] = Xpqw;
        pqw[1] = Ypqw;
        pqw[2] = Zpqw;

        var eciValues = new Array(); //Double[3];
        eciValues = MathTools.rot3(-kepler.getArgOfPerigee(), pqw);
        eciValues = MathTools.rot1(-kepler.getInclination(), eciValues);
        eciValues = MathTools.rot3(-kepler.getRaan(), eciValues);
        eci.setX(eciValues[0]);
        eci.setY(eciValues[1]);
        eci.setZ(eciValues[2]);

        //determine the velocity conversion;                             //double
        var VXpqw = -Math.sqrt(Constants.muEarth / p) * sinNu;      //double
        var VYpqw = Math.sqrt(Constants.muEarth / p) * (e + cosNu); //double
        var VZpqw = 0;                                                   //double
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
     *
     * @param eci ECICoordinates
     *
     * @returns KeplerianCoordinates
     *
     */
    convertECIToKeplerian: function(eci)
    {
        var kepler = new KeplerianCoordinates();

        /*
        if ( eci == null || typeof eci.getX === 'undefined') {
            console.log("convertECIToKeplerian received bogus eci object" + eci);
            return null;
        }
        */
        //reference Vallado 120

        var r = new Array(); //Double[3];
        r[0] = eci.x;
        r[1] = eci.y;
        r[2] = eci.z;
        
        var v = new Array(); //Double[3];
        v[0] = eci.vx;
        v[1] = eci.vy;
        v[2] = eci.vz;

        var h = MathTools.cross(r, v); //Double[3]
        var hmag = MathTools.magnitude(h); //double
        var rmag = MathTools.magnitude(r); //double
        var vmag = MathTools.magnitude(v); //double

        var khat = new Array(); //Double[3];
        khat[0] = 0.0;
        khat[1] = 0.0;
        khat[2] = 1.0;

        var n = new Array(); //Double[3];
        n = MathTools.cross(khat, h);
        
        var coeff1 = vmag * vmag - Constants.muEarth / rmag; //double
        var coeff2 = MathTools.dotMultiply(r, v);            //double
       
        var e = new Array(); //Double[3];

        var i = 0;
        for (i = 0; i < 3; i++)
        {
            e[i] = (1 / Constants.muEarth) * (coeff1 * r[i] - coeff2 * v[i]);
        }
        
        var emag = MathTools.magnitude(e);                       //double
        var energy = vmag * vmag / 2 - Constants.muEarth / rmag; //double
        
        var p = 0.0; //double
        var a = 0.0; //double

        if (emag == 1.0)
        {
            a = Infinity;
            p = hmag * hmag / Constants.muEarth;
        }
        else
        {
            a = -Constants.muEarth / (2 * energy);
            p = a * (1 - emag * emag);
        }

        var inc = MathTools.toDegrees(Math.acos(h[2] / hmag));                    //double
        var raan = MathTools.toDegrees(Math.acos(n[0] / MathTools.magnitude(n))); //double

        if (n[1] < 0)
        {
            raan = 360 - raan;
        }
        
        
        var arg = MathTools.toDegrees(Math.acos(MathTools.dotMultiply(n, e) /
            (MathTools.magnitude(n) * emag)));  //double

        if (e[2] < 0)
        {
            arg = 360 - arg;
        }
        
        // console.log("MathTools.dotMultiply(e, r) / (emag * rmag): " + MathTools.dotMultiply(e, r) / (emag * rmag) )
        // console.log("Math.acos(MathTools.dotMultiply(e, r) / (emag * rmag)): " + Math.acos(MathTools.dotMultiply(e, r) / (emag * rmag)));
        
        var value = MathTools.dotMultiply(e, r) / (emag * rmag);
        if(value > 1) {
            // console.log("setting to 1");
            value = 1;
        }
        var nu = MathTools.toDegrees(Math.acos(value)); //double
        // console.log("nu: " + nu);
        if (MathTools.dotMultiply(v, r) < 0)
        {
            nu = 360 - nu;
        }

        if(isNaN(raan))
        {
            raan = 0.00001;
        }

        if(isNaN(arg))
        {
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
        var sinNu = Math.sin(MathTools.toRadians(nu));
        var cosNu = Math.cos(MathTools.toRadians(nu));
        var sinEA = ((sinNu * Math.sqrt(1 - emag * emag)) / (1 + emag * cosNu));
        var cosEA = ((emag + cosNu) / (1 + emag * cosNu));
        var EA = Math.atan2(sinEA, cosEA);
        var MA = EA - emag * sinEA;
        MA = MathTools.toDegrees(MA);
        kepler.setMeanAnomaly(MA);

        return kepler;
    },

    /**
     *
     * @param satellite SimulationObject
     *
     * @returns double[][]
     */
    buildRotationMatrixToConvertECItoRSW: function(satellite)
    {
        var satelliteKepler = CoordinateConversionTools.convertECIToKeplerian(satellite.getEci()); //KeplerianCoords

        var nu = satelliteKepler.getTrueAnomaly();  //double
        var w = satelliteKepler.getArgOfPerigee();  //double
        var inc = satelliteKepler.getInclination(); //double
        var raan = satelliteKepler.getRaan();       //double

        var netRotationMatrix = new Array(3);

        var i = 0;
        for(var i = 0; i < 3; i++) //create as Double[3][3];
        {
            netRotationMatrix[i] = new Array(3);
        }

        netRotationMatrix = MathTools.buildRotationMatrix3(raan);
        netRotationMatrix = MathTools.multiply2dBy2d(MathTools.buildRotationMatrix1(inc), netRotationMatrix);
        netRotationMatrix = MathTools.multiply2dBy2d(MathTools.buildRotationMatrix3(w), netRotationMatrix);
        netRotationMatrix = MathTools.multiply2dBy2d(MathTools.buildRotationMatrix3(nu), netRotationMatrix);

        return netRotationMatrix;
    },

    /**
     *
     * @param satellite SimulationObject
     * @param targetECI ECIcoordinates
     *
     * @returns RSWcoordinates
     *
     */
    convertTargetECIToSatelliteRSW: function(satellite, targetECI)
    {
        var rsw = new RSWcoordinates();
        var satelliteKepler = CoordinateConversionTools.convertECIToKeplerian(satellite.getEci()); //KeplerianCoordinates
        var satelliteECI = satellite.getEci();       //ECICoordinates

        var nu = satelliteKepler.getTrueAnomaly();  //double
        var w = satelliteKepler.getArgOfPerigee();  //double
        var inc = satelliteKepler.getInclination(); //double
        var raan = satelliteKepler.getRaan();       //double

        var rijk = new Array(); //Double[3];
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
     *
     * @param satellite SimulationObject
     * @param rsw RSWcoordinates
     *
     * @returns ECIcoordinates
     */
    convertRSWToECI: function(satellite, rsw)
    {
        var eci = new UNIVERSE.ECICoordinates();
        var satelliteKepler = CoordinateConversionTools.convertECIToKeplerian(satellite.getEci());

        var nu = satelliteKepler.getTrueAnomaly();
        var w = satelliteKepler.getArgOfPerigee();
        var inc = satelliteKepler.getInclination();
        var raan = satelliteKepler.getRaan();

        var rswVec = new Array();        //Double[3];
        rswVec[0] = rsw.radial;
        rswVec[1] = rsw.alongTrack;
        rswVec[2] = rsw.crossTrack;

        var rijk = new Array();              //Double[3];
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
     *
     * @param currentEpoch Date
     *
     * @returns ECIcoordinates
     */
    getSunPositionECIAtCurrentTime: function(currentEpoch)
    {
        //ref Vallado 266
        var JD = this.convertCurrentEpochToJulianDate(currentEpoch);

        //julian centuries since January 1, 2000 12h UT1
        var TUT = (JD - 2451545.0) / 36525.0;
        var lambdaSun = 280.4606184 + 36000.77005361 * TUT;  //solar angle (deg)
        var Msun = 357.5277233 + 35999.05034 * TUT;
        var lambdaEcliptic = lambdaSun + 1.914666471 *
            Math.sin(MathTools.toRadians(Msun)) + 0.019994643 *
            Math.sin(2 * MathTools.toRadians(Msun));//ecliptic angle (deg)

        //distance of the sun in AU
        var rsun = 1.000140612 - 0.016708617 * Math.cos(MathTools.toRadians(Msun)) -
            0.000139589 * Math.cos(2 * MathTools.toRadians(Msun));
        var e = 23.439291 - 0.0130042 * TUT;  //ecliptic latitude on the earth

        var AU = 149597870.0;  //one astronomical unit (km)
        var sunPosition = new UNIVERSE.ECICoordinates();

        sunPosition.setX(rsun * Math.cos(MathTools.toRadians(lambdaEcliptic)) * AU);
        sunPosition.setY(rsun * Math.cos(MathTools.toRadians(e)) *
            Math.sin(MathTools.toRadians(lambdaEcliptic)) * AU);
        sunPosition.setZ(rsun * Math.sin(MathTools.toRadians(e)) *
            Math.sin(MathTools.toRadians(lambdaEcliptic)) * AU);

        return sunPosition;
    },

	convertCurrentEpochToBarycentricTime: function(currentEpoch)
	{
        //reference Vallado 3rd edition page 201
        var UTC = new Date(currentEpoch);
		
        //var newSeconds = (int) (UTC.getSeconds() - 0.463326);
		var UTI = new Date(UTC.getTime() - 463);
		//console.log("UTI: " + UTI)
		
        //Date UTI = new Date(UTC.getYear(), UTC.getMonth(), UTC.getDate(), UTC.getHours(), UTC.getMinutes(), newSeconds);
        //newSeconds = (int) (UTI.getSeconds() + 32);
		var TAI = new Date(UTI.getTime() + 32000);
        //Date TAI = new Date(UTI.getYear(), UTI.getMonth(), UTI.getDate(), UTI.getHours(), UTI.getMinutes(), newSeconds);

		var TT = new Date(TAI.getTime() + 32184);
        //newSeconds = (int) (TAI.getSeconds() + 32.184);
        //Date TT = new Date(TAI.getYear(), TAI.getMonth(), TAI.getDate(), TAI.getHours(), TAI.getMinutes(), newSeconds);
        
		//console.log("TT: " + TT);
		var JDtt = this.convertCurrentEpochToJulianDate(TT);
        var Ttt = (JDtt - 2451545.0) / 36525.0;
        //console.log("JDtt: " + JDtt);
		//newSeconds = (int) (TT.getSeconds() + 0.001658 * Math.sin(628.3076 * Ttt + 6.2401));  //note, higher order terms are available
		//console.log("equation: " + (0.001658 * Math.sin(628.3076 * Ttt + 6.2401)) * 1000)
        var TDB = new Date(TT.getTime() + ((0.001658 * Math.sin(628.3076 * Ttt + 6.2401)) * 1000));
		//Date TDB = new Date(TT.getYear(), TT.getMonth(), TT.getDate(), TT.getHours(), TT.getMinutes(), newSeconds);
		//console.log("TDB: " + TDB);
        var JDtdb = this.convertCurrentEpochToJulianDate(TDB);
        var Ttdb = (JDtdb - 2451545.0) / 36525.0;  //julian centuries since January 1, 2000 12h UT1  //this is the terrestrial time


        //*******************************
        //note, this may have issues due to the fact that the date objects don't use fractions of seconds
        //*******************************

        return Ttdb;
    },

    getMoonPositionECIAtCurrentTime: function(currentEpoch)
    {
		//console.log("currentEpoch: " + currentEpoch);
        //reference Vallado 3rd ed page 291
        var Ttdb = CoordinateConversionTools.convertCurrentEpochToBarycentricTime(currentEpoch);
		//console.log("Ttdb: " + Ttdb);
        var lambda = 218.32 + 481267.8813 * Ttdb;
        lambda += 6.29 * Math.sin(MathTools.toRadians(134.9 + 477198.85 * Ttdb));
        lambda += -1.27 * Math.sin(MathTools.toRadians(259.2 - 413335.38 * Ttdb));
        lambda += 0.66 * Math.sin(MathTools.toRadians(235.7 + 890534.23 * Ttdb));
        lambda += 0.21 * Math.sin(MathTools.toRadians(269.9 + 954397.70 * Ttdb));
        lambda += -0.19 * Math.sin(MathTools.toRadians(357.5 + 35999.05 * Ttdb));
        lambda += -0.11 * Math.sin(MathTools.toRadians(186.6 + 966404.05 * Ttdb));  //degrees
        if (Math.abs(lambda) > 360)
        {
            lambda = (lambda % 360);
        }
        if (lambda < 0)
        {
            lambda += 360;
        }

        
        var phi = 5.13 * Math.sin(MathTools.toRadians(93.3 + 483202.03 * Ttdb));
        phi += 0.28 * Math.sin(MathTools.toRadians(228.2 + 960400.87 * Ttdb));
        phi += -0.28 * Math.sin(MathTools.toRadians(318.3 + 6003.18 * Ttdb));
        phi += -0.17 * Math.sin(MathTools.toRadians(217.6 - 407332.20 * Ttdb));
        if (Math.abs(phi) > 360)
        {
            phi = (phi % 360);
        }
        if (phi < 0)
        {
            phi += 360;
        }
        
        

        var parallax = 0.9508 + 0.0518 * Math.cos(MathTools.toRadians(134.9 + 477198.85 * Ttdb));
        parallax += +0.0095 * Math.cos(MathTools.toRadians(259.2 - 413335.38 * Ttdb));
        parallax += +0.0078 * Math.cos(MathTools.toRadians(235.7 + 890534.23 * Ttdb));
        parallax += +0.0028 * Math.cos(MathTools.toRadians(269.9 + 954397.70 * Ttdb));
        if (Math.abs(parallax) > 360)
        {
            parallax = (parallax % 360);
        }
        if (parallax < 0)
        {
            parallax += 360;
        }

        var e=23.439291-0.0130042*Ttdb;//obliquity of the ecliptic
        var rMoon=1/Math.sin(MathTools.toRadians(parallax));//earth radii
        rMoon=rMoon*Constants.radiusEarth;//km

		// console.log("lambda: " + lambda);
		// console.log("phi: " + phi);
		// console.log("parallax: " + parallax);
        e=MathTools.toRadians(e);
        phi=MathTools.toRadians(phi);
        lambda=MathTools.toRadians(lambda);


        moonPosition=new UNIVERSE.ECICoordinates();
        moonPosition.setX(rMoon*Math.cos(phi)*Math.cos(lambda));
        moonPosition.setY(rMoon*(Math.cos(e)*Math.cos(phi)*Math.sin(lambda)-Math.sin(e)*Math.sin(phi)));
        moonPosition.setZ(rMoon*(Math.sin(e)*Math.cos(phi)*Math.sin(lambda)+Math.cos(e)*Math.sin(phi)));
        return moonPosition;
    }

};
