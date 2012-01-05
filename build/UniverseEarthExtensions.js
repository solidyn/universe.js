
var Constants = {

    // define variables as <var name>: <value>

    radiusEarth:    6378.1363,     //km
    muEarth:        398600.4418,   //km3/s2
    eccEarthSphere: 0.081819221456 //vallado page 141
};var CoordinateConversionTools = {

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
        rswVec[0] = rsw.getRadial();
        rswVec[1] = rsw.getAlongTrack();
        rswVec[2] = rsw.getCrossTrack();

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
        var lambda = 218.32 + 481267.883 * Ttdb;
        lambda += 6.29 * Math.sin(MathTools.toRadians(134.9 + 477198.85 * Ttdb));
        lambda += -1.27 * Math.sin(MathTools.toRadians(259.2 - 413335.38 * Ttdb));
        lambda += 0.66 * Math.sin(MathTools.toRadians(235.7 + 890534.23 * Ttdb));
        lambda += 0.21 * Math.sin(MathTools.toRadians(269.9 + 954397.70 * Ttdb));
        lambda += -0.19 * Math.sin(MathTools.toRadians(357.5 + 35999.05 * Ttdb));
        lambda += -0.11 * Math.sin(MathTools.toRadians(186.6 + 96640.05 * Ttdb));  //degrees
        if (Math.abs(lambda)>360){
            lambda=(lambda%360);
        }
        if(lambda<0){
            lambda+=360;
        }

        var phi=5.13*Math.sin(MathTools.toRadians(93.3+483202.03*Ttdb));
        phi+=0.28*Math.sin(MathTools.toRadians(228.2+960400.87*Ttdb));
        phi+=-0.28*Math.sin(MathTools.toRadians(318.3+6003.18*Ttdb));
        phi+=-0.17*Math.sin(MathTools.toRadians(217.6-407332.20*Ttdb));
        if (Math.abs(phi)>360){
            phi=(phi%360);
        }
        if(phi<0){
            phi+=360;
        }

        var parallax=0.9508+0.0518*Math.cos(MathTools.toRadians(134.9+477198.85*Ttdb));
        parallax+=+0.0095*Math.cos(MathTools.toRadians(259.2-413335.38*Ttdb));
        parallax+=+0.0078*Math.cos(MathTools.toRadians(235.7+890534.23*Ttdb));
        parallax+=+0.0028*Math.cos(MathTools.toRadians(269.9+954397.70*Ttdb));
        if (Math.abs(parallax)>360){
            parallax=(parallax%360);
        }
        if(parallax<0){
            parallax+=360;
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
var CoordinateFunctionHelper = {

    /**
     * Uses a true anomoly to update the eccentric anomoly and mean anomoly.
     */
    updateKeplerianAnglesUsingTrueAnomaly: function(keplerianCoords)
    {
        var nu = MathTools.toRadians(trueAnomaly);
        var sinEA = Math.sin(nu) * Math.sqrt(1 - keplerianCoords.eccentricity * keplerianCoords.eccentricity) /
            (1 + keplerianCoords.eccentricity * Math.cos(nu));
        var cosEA = (keplerianCoords.eccentricity + Math.cos(nu)) /
            (1 + keplerianCoords.eccentricity * Math.cos(nu));

        keplerianCoords.eccentricAnomaly = MathTools.toDegrees(Math.atan2(sinEA, cosEA));
        keplerianCoords.meanAnomaly = MathTools.toDegrees(MathTools.toRadians(keplerianCoords.eccentricAnomaly) -
            keplerianCoords.eccentricity * sinEA);
    },

    /**
     * Sets a new true anomoly and updates the eccentric and mean anomoly vals.
     */
    setKeplerianTrueAnomaly: function(keplerianCoords, newTrueAnomaly)
    {
        keplerianCoords.trueAnomaly = newTrueAnomaly;
        updateAnglesUsingTrueAnomaly(keplerianCoords);
    }
};var UNIVERSE = UNIVERSE || {};

UNIVERSE.ECEFCoordinates = function(xVal, yVal, zVal, vxVal, vyVal, vzVal, axVal, ayVal, azVal)  {

    // define variables as <var name>: <value>

    this.x = xVal ? xVal : 0.0, //km
    this.y =  yVal ? yVal : 0.0, //km
    this.z =  zVal ? zVal : 0.0, //km
    this.vx = vxVal ? vxVal : 0.0, //km
    this.vy = vyVal ? vyVal : 0.0, //km
    this.vz = vzVal ? vzVal : 0.0, //km
    this.ax = axVal ? axVal : 0.0, //km
    this.ay = ayVal ? ayVal : 0.0, //km
    this.az = azVal ? azVal : 0.0 //km

   /**
     * Get the X value.
     */
    this.getX = function()
    {
        return this.x;
    }

    /**
     * Set the X value.
     */
    this.setX = function(newX)
    {
        this.x = newX;
    }

    /**
     * Get the Y value.
     */
    this.getY = function()
    {
        return this.y;
    }

    /**
     * Set the Y value.
     */
    this.setY = function(newY)
    {
        this.y = newY;
    }

    /**
     * Get the Z value.
     */
    this.getZ = function()
    {
        return this.z;
    }

    /**
     * Set the Z value.
     */
    this.setZ = function(newZ)
    {
        this.z = newZ;
    }

   /**
     * Get the VX value.
     */
    this.getVX = function()
    {
        return this.vx;
    }

    /**
     * Set the VX value.
     */
    this.setVX = function(newVX)
    {
        this.vx = newVX;
    }

    /**
     * Get the VY value.
     */
    this.getVY = function()
    {
        return this.vy;
    }

    /**
     * Set the VY value.
     */
    this.setVY = function(newVY)
    {
        this.vy = newVY;
    }

    /**
     * Get the VZ value.
     */
    this.getVZ = function()
    {
        return this.vz;
    }

    /**
     * Set the VZ value.
     */
    this.setVZ = function(newVZ)
    {
        this.vz = newVZ;
    }

    /**
     * Get the AX value.
     */
    this.getAX = function()
    {
        return this.ax;
    }

    /**
     * Set the AX value.
     */
    this.setAX = function(newAX)
    {
        this.ax = newAX;
    }

    /**
     * Get the AY value.
     */
    this.getAY = function()
    {
        return this.ay;
    }

    /**
     * Set the AY value.
     */
    this.setAY = function(newAY)
    {
        this.ay = newAY;
    }

    /**
     * Get the AZ value.
     */
    this.getAZ = function()
    {
        return this.az;
    }

    /**
     * Set the AZ value.
     */
    this.setAZ = function(newAZ)
    {
        this.az = newAZ;
    }
};var UNIVERSE = UNIVERSE || {};

UNIVERSE.ECICoordinates = function(xVal, yVal, zVal, vxVal, vyVal, vzVal, axVal, ayVal, azVal) {
    
    // define variables as <var name>: <value>

    this.x = xVal ? xVal : 0.0, //km
    this.y =  yVal ? yVal : 0.0, //km
    this.z =  zVal ? zVal : 0.0, //km
    this.vx = vxVal ? vxVal : 0.0, //km
    this.vy = vyVal ? vyVal : 0.0, //km
    this.vz = vzVal ? vzVal : 0.0, //km
    this.ax = axVal ? axVal : 0.0, //km
    this.ay = ayVal ? ayVal : 0.0, //km
    this.az = azVal ? azVal : 0.0 //km
    
    /**
     * Get the X value.
     */
    this.getX = function()
    {
        return this.x;
    }

    /**
     * Set the X value.
     */
    this.setX = function(newX)
    {
        this.x = newX;
    }

    /**
     * Get the Y value.
     */
    this.getY = function()
    {
        return this.y;
    }

    /**
     * Set the Y value.
     */
    this.setY = function(newY)
    {
        this.y = newY;
    }

    /**
     * Get the Z value.
     */
    this.getZ = function()
    {
        return this.z;
    }

    /**
     * Set the Z value.
     */
    this.setZ = function(newZ)
    {
        this.z = newZ;
    }

   /**
     * Get the VX value.
     */
    this.getVX = function()
    {
        return this.vx;
    }

    /**
     * Set the VX value.
     */
    this.setVX = function(newVX)
    {
        this.vx = newVX;
    }

    /**
     * Get the VY value.
     */
    this.getVY = function()
    {
        return this.vy;
    }

    /**
     * Set the VY value.
     */
    this.setVY = function(newVY)
    {
        this.vy = newVY;
    }

    /**
     * Get the VZ value.
     */
    this.getVZ = function()
    {
        return this.vz;
    }

    /**
     * Set the VZ value.
     */
    this.setVZ = function(newVZ)
    {
        this.vz = newVZ;
    }

    /**
     * Get the AX value.
     */
    this.getAX = function()
    {
        return this.ax;
    }

    /**
     * Set the AX value.
     */
    this.setAX = function(newAX)
    {
        this.ax = newAX;
    }

    /**
     * Get the AY value.
     */
    this.getAY = function()
    {
        return this.ay;
    }

    /**
     * Set the AY value.
     */
    this.setAY = function(newAY)
    {
        this.ay = newAY;
    }

    /**
     * Get the AZ value.
     */
    this.getAZ = function()
    {
        return this.az;
    }

    /**
     * Set the AZ value.
     */
    this.setAZ = function(newAZ)
    {
        this.az = newAZ;
    }
};/**
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
		console.log("radius sensor: " + radiusSensor);
		console.log("relative radius: " + relativeRadius);
        if(radiusSensor > relativeRadius){
            canSee = true;
        }
        return canSee;
    }
};function KeplerianCoordinates(theSemimajorAxis, theMeanAnomaly, theEccentricAnomaly, theTrueAnomaly, theInclination, theEccentricity, theRaan, theArgOfPerigee, theMeanMotion) {

    this.semimajorAxis = theSemimajorAxis ? theSemimajorAxis : 0.0, //km
    this.meanAnomaly = theMeanAnomaly ? theMeanAnomaly : 0.0,
    this.eccentricAnomaly = theMeanAnomaly ? theMeanAnomaly : 0.0,
    this.trueAnomaly = theTrueAnomaly ? theTrueAnomaly : 0.0,
    this.inclination = theInclination ? theInclination : 0.0, //deg
    this.eccentricity = theEccentricity ? theEccentricity : 0.0, //unitless
    this.raan = theRaan ? theRaan : 0.0, //deg
    this.argOfPerigee = theArgOfPerigee ? theArgOfPerigee : 0.0, //deg
    this.meanMotion = theMeanMotion ? theMeanMotion : 0.0 //deg/sec
    
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
    }

    this.setEccentricAnomaly = function(theEccentricAnomaly)
    {
         this.eccentricAnomaly = theEccentricAnomaly;
    }
    
    this.setTrueAnomaly = function(theTrueAnomaly)
    {
         this.trueAnomaly = theTrueAnomaly;
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
}var UNIVERSE = UNIVERSE || {};

UNIVERSE.LLACoordinates = function(lat, lon, alt) {

    // define variables as <var name>: <value>

    this.latitude =  lat ? lat : 0.0, //deg
    this.longitude = lon ? lon : 0.0, //deg
    this.altitude =  alt ? alt : 0.0  //km

    /**
     * Returns the altitude value.
     */
    this.getAltitude = function()
    {
        return this.altitude;
    }

    /**
     * Sets a new altitude value.
     */
    this.setAltitude = function(newAltitude)
    {
        this.altitude = newAltitude;
    }

    /**
     * Returns the latitude value.
     */
    this.getLatitude = function()
    {
        return this.latitude;
    }

    /**
     * Sets a new latitude value.
     */
    this.setLatitude = function(newLatitude)
    {
        this.latitude = newLatitude;
    }

    /**
     * Returns the longitude value.
     */
    this.getLongitude = function()
    {
        return this.longitude;
    }

    /**
     * Sets a new longitude value.
     */
    this.setLongitude = function(setLongitude)
    {
        this.longitude = setLongitude;
    }
};
var MathTools = {

    /**
     *
     * @param x double[]
     * @param a double
     *
     * @returns Array of double
     */
    scalarMultiply: function(x, a)
    {
        var N = x.length;          //int
        var xTimesA = new Array(); //Double[N];

        for (var i = 0; i < N; i++)
        {
            xTimesA[i] = x[i] * a;
        }

        return xTimesA;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns double
     */
    dotMultiply: function(x,  y)
    {
        if (x.length != y.length)
        {
            return 0.0;
        }
        else
        {
            var N = x.length; //int
            var xDotY = 0.0;  //double

            for (var i = 0; i < N; i++)
            {
                xDotY += (x[i] * y[i]);
            }

            return xDotY;
        }
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns double
     */
    angleBetweenTwoVectors: function(x, y)
    {
        var angle = 0;                 //double
        var magX = MathTools.magnitude(x);       //double
        var magY = MathTools.magnitude(y);       //double
        var xDotY = MathTools.dotMultiply(x, y); //double

        angle = MathTools.toDegrees(Math.acos(xDotY / (magX * magY)));

        return angle; //deg
    },

    /**
     *
     * @param x Double[]
     *
     * @returns double
     */
    magnitude: function(x)
    {
        var vectorMagnitude = 0; //double
        vectorMagnitude = Math.sqrt(x[0] * x[0] + x[1] * x[1] + x[2] * x[2]);

        return vectorMagnitude;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns Array of double
     */
    cross: function(x, y)
    {
        var result = new Array(); //Double[3];

        //returns the cross product of x cross y
        result[0] = x[1] * y[2] - y[1] * x[2];    //i
        result[1] = -(x[0] * y[2] - y[0] * x[2]); //j
        result[2] = x[0] * y[1] - y[0] * x[1];    //k

        return result;
    },

    /**
     *
     * @param x   double
     * @param vec Double[]
     *
     * @returns Array of double
     */
    rot1: function(x, vec)
    {
        x = MathTools.toRadians(x);

        var result = new Array(); //Double[3];
        result[0] = vec[0];
        result[1] = Math.cos(x) * vec[1] + Math.sin(x) * vec[2];
        result[2] = -Math.sin(x) * vec[1] + Math.cos(x) * vec[2];

        return result;
    },

    /**
     *
     * @param x   double
     * @param vec Double[]
     *
     * @returns Array of double
     */
    rot2: function(x, vec)
    {
        x = MathTools.toRadians(x);
        
        var result = new Array(); //Double[3];

        result[0] = Math.cos(x) * vec[0] - Math.sin(x) * vec[2];
        result[1] = vec[1];
        result[2] = Math.sin(x) * vec[0] + Math.cos(x) * vec[2];

        return result;
    },

    /**
     *
     * @param x   double
     * @param vec Double[]
     *
     * @returns Array of double
     */
    rot3: function(x, vec)
    {
        x = MathTools.toRadians(x);

        var result = new Array(); //Double[3];

        result[0] = Math.cos(x) * vec[0] + Math.sin(x) * vec[1];
        result[1] = -Math.sin(x) * vec[0] + Math.cos(x) * vec[1];
        result[2] = vec[2];

        return result;
    },

    /**
     *
     * @param valueInDegrees   double
     *
     * @returns double
     */
    toRadians: function(valueInDegrees)
    {
        return valueInDegrees * Math.PI / 180.0;
    },

    /**
     *
     * @param valueInRadians double
     *
     * @returns double
     */
    toDegrees: function(valueInRadians)
    {
        return valueInRadians * 180 / Math.PI;
    },

    /**
     *
     * @param x double
     *
     * @returns double[3][3]
     */
    buildRotationMatrix1: function(x)
    {
        x = MathTools.toRadians(x);
        var result = new Array(); //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = new Array();
        }

        result[0][0] = 1.0;
        result[0][1] = 0.0;
        result[0][2] = 0.0;
        result[1][0] = 0.0;
        result[1][1] = Math.cos(x);
        result[1][2] = -Math.sin(x);
        result[2][0] = 0.0;
        result[2][1] = Math.sin(x);
        result[2][2] = Math.cos(x);

        return result;
    },

    /**
     *
     * @param x double
     *
     * @returns double[3][3]
     */
    buildRotationMatrix2: function(x)
    {
        x = MathTools.toRadians(x);
        var result = new Array(); //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = new Array();
        }

        result[0][0] = Math.cos(x);
        result[0][1] = 0.0;
        result[0][2] = Math.sin(x);
        result[1][0] = 0.0;
        result[1][1] = 1.0;
        result[1][2] = 0.0;
        result[2][0] = -Math.sin(x);
        result[2][1] = 0.0;
        result[2][2] = Math.cos(x);

        return result;
    },

    /**
     *
     * @param x double
     *
     * @returns Double[][]
     */
    buildRotationMatrix3: function(x)
    {
        x = MathTools.toRadians(x);
        var result = new Array(); //Double[3][3];

        var i = 0;
        for(i = 0; i < 3; i++)
        {
           result[i] = new Array();
        }

        result[0][0] = Math.cos(x);
        result[0][1] = -Math.sin(x);
        result[0][2] = 0.0;
        result[1][0] = Math.sin(x);
        result[1][1] = Math.cos(x);
        result[1][2] = 0.0;
        result[2][0] = 0.0;
        result[2][1] = 0.0;
        result[2][2] = 1.0;

        return result;
    },

    /**
     *
     * @param N int
     *
     * @returns Double[][]
     */
    ones: function(N)
    {
        var x = new Array(); //Double[N][N];

        var i = 0;
        var j = 0;

        for(i = 0; i < N; i++)
        {
           result[i] = new Array(N);
        }

        for (i = 0; i < N; i++)
        {
            for (j = 0; j < N; j++)
            {
                if (i != j)
                {
                    x[i][j] = 0.0;
                }
                else
                {
                    x[i][j] = 1.0;
                }
            }
        }

        return x;
    },

    /**
     *
     * @param N int
     *
     * @returns Double[][]
     */
    zeros: function(N)
    {
        var x = new Array(N); //Double[3][3];

        var i = 0;
        var j = 0;

        for(i = 0; i < N; i++)
        {
           result[i] = new Array(N);
        }

        for (i = 0; i < N; i++)
        {
            for (j = 0; j < N; j++)
            {
                x[i][j] = 0.0;
            }
        }

        return x;
    },

    /**
     *
     * @param M int
     * @param N int
     *
     * @returns Double[][]
     */
    zeros: function(M, N)
    {
        var x = new Array(M); //Double[M][N];

        var i = 0;
        var j = 0;

        for(i = 0; i < M; i++)
        {
           result[i] = new Array(N);
        }

        for (i = 0; i < M; i++)
        {
            for ( j = 0; j < N; j++)
            {
                x[i][j] = 0.0;
            }
        }

        return x;
    },

    /**
     *
     * @param x 1d array
     * @param y 2d array
     *
     * @returns Double[]
     */
    multiply1dBy2d: function(x, y)
    {
        var x1 = x.length;
        var y1 = y.length;
        var y2 = y[0].length;

        if (x1 != y1)
        {
            return null;
        }

        var returnVal = new Array(y2); //Double[y2];

        for (var i = 0; i < y2; i++)
        {
            var val = 0;

            for (var j = 0; j < x1; j++)
            {
                val = val + x[j] * y[j][i];
            }

            returnVal[i] = val;
        }

        return returnVal;
    },

    /**
     *
     * @param x 2d array
     * @param y 1d array
     *
     * @returns Double[]
     */
    multiply2dBy1d: function(x, y)
    {
        //where x is MxN and Y is Nx1
        var M_x1 = x.length;
        var N_x2 = x[0].length;
        var N_y1 = y.length;

        if (N_x2 != N_y1)
        {
            return null;
        }

        var returnVal = new Array(M_x1); //Double[M_x1];

        for (var i = 0; i < M_x1; i++)
        {
            var val = 0;

            for (var j = 0; j < N_y1; j++)
            {
                val = val + x[i][j] * y[j];
            }

            returnVal[i] = val;
        }

        return returnVal;
    },

    /**
     *
     * @param h double
     * @param x 2d array
     *
     * @returns Double[][]
     */
    multiplyDoubleBy2d: function(h, x)
    {
        var M = x.length;
        var N = x[0].length;
        var hTimesX = new Array(M); //Double[M][N];

        var i = 0;
        var j = 0;

        for(i = 0; i < M; i++)
        {
           hTimesX[i] = new Array(N);
        }

        for (i = 0; i < M; i++)
        {
            for (j = 0; j < N; j++)
            {
                if (x[i][j] == 0)
                {
                    hTimesX[i][j] = 0.0;
                }
                else
                {
                    hTimesX[i][j] = h * x[i][j];
                }
            }
        }

        return hTimesX;
    },

    /**
     *
     * @param x Double[][]
     * @param y Double[][]
     *
     * @returns Double[][] 
     */
    multiply2dBy2d: function(x, y)
    {
        var x1 = x.length;
        var x2 = x[0].length;
        var y1 = y.length;
        var y2 = y[0].length;

        if (x2 != y1)
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[3][3];

        var i = 0;
        var j = 0;

        for(i = 0; i < x1; i++)
        {
           returnVal[i] = new Array(y2);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {
            //each column of the target matrix
            for (j = 0; j < y2; j++)
            {
                var val = 0;
                var k = 0;

                //the components of the target cell
                for (k = 0; k < y1; k++)
                {
                    val = val + x[i][k] * y[k][j];
                }

                returnVal[i][j] = val;
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[][]
     *
     * @returns Double[][]
     */
    transposeMatrix: function(x)
    {
        var x1 = x.length;
        var x2 = x[0].length;

        var returnVal = new Array(x2); //Double[x2][x1];

        var i = 0;
        var j = 0;

        for(i = 0; i < x2; i++)
        {
           returnVal[i] = new Array(x1);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {  
            //each column of the target matrix
            for (j = 0; j < x2; j++)
            { 
                returnVal[j][i] = x[i][j];
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns Double[]
     */
    add1dTo1d: function(x, y)
    {
        var x1 = x.length;
        var y1 = y.length;

        if (x1 != y1)
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1];
        var i = 0;

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {  
            returnVal[i] = x[i] + y[i];
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[][]
     * @param y Double[][]
     *
     *
     * @returns Double[][]
     */
    add2dTo2d: function(x, y)
    {
        var x1 = x.length;
        var x2 = x[0].length;
        var y1 = y.length;
        var y2 = y[0].length;

        if ((x1 != y1) || (x2 != y2))
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1][x2];
        var i = 0;
        var j = 0;

        for(i = 0; i < x1; i++)
        {
           returnVal[i] = new Array(x2);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {
            //each column of the target matrix
            for (j = 0; j < x2; j++)
            { 
                returnVal[i][j] = x[i][j] + y[i][j];
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[][]
     * @param y Double[][]
     *
     * @returns Double[][]
     */
    subtract2dMinus2d: function(x, y)
    {
        var x1 = x.length;
        var x2 = x[0].length;
        var y1 = y.length;
        var y2 = y[0].length;

        if ((x1 != y1) || (x2 != y2))
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1][x2];
        var i = 0;
        var j = 0;

        for(i = 0; i < x1; i++)
        {
           returnVal[i] = new Array(x2);
        }

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {
            //each column of the target matrix
            for (j = 0; j < x2; j++)
            { 
                returnVal[i][j] = x[i][j] - y[i][j];
            }
        }

        return returnVal;
    },

    /**
     *
     * @param x Double[]
     * @param y Double[]
     *
     * @returns Double[]
     */
    subtract1dMinus1d: function(x, y)
    {
        var x1 = x.length;
        var y1 = y.length;

        if (x1 != y1)
        {
            return null;
        }

        var returnVal = new Array(x1); //Double[x1];
        var i = 0;

        //each row of the target matrix
        for (i = 0; i < x1; i++)
        {  
            returnVal[i] = x[i] - y[i];
        }

        return returnVal;
    }
}
function Quaternion(wVal, xVal, yVal, zVal) {

    this.w = wVal ? wVal : 0.0,
    this.x = xVal ? xVal : 0.0,
    this.y = yVal ? yVal : 0.0,
    this.z = zVal ? zVal : 0.0,
    this.q = new Array(4)

    /**
     *
     */
    this.updateQ = function()
    {
        this.q[0] = this.w;
        this.q[1] = this.x;
        this.q[2] = this.y;
        this.q[3] = this.z;
    }

    /**
     *
     * @returns
     */
    this.getQ = function()
    {
        return q;
    }

    /**
     *
     * @param q Double[]
     */
    this.setQ = function(q)
    {
        this.w = q[0];
        this.x = q[1];
        this.y = q[2];
        this.z = q[3];
        this.q = q;
    }

    /**
     *
     *
     * @returns double
     */
    this.getW = function()
    {
        return this.w;
    }

    /**
     *
     * @param newW double
     */
    this.setW = function(newW)
    {
        this.w = newW;
        this.updateQ();
    }

    /**
     *
     * @returns double
     */
    this.getX = function()
    {
        return this.x;
    }

    /**
     *
     * @param newX double
     */
    this.setX = function(newX)
    {
        this.x = newX;
        this.updateQ();
    }

    /**
     *
     * @returns double
     */
    this.getY = function()
    {
        return this.y;
    }

    /**
     *
     * @param newY double
     */
    this.setY = function(newY)
    {
        this.y = newY;
        this.updateQ();
    }

    /**
     *
     * @returns double
     */
    this.getZ = function()
    {
        return this.z;
    }

    /**
     *
     * @param newZ double
     */
    this.setZ = function(newZ)
    {
        this.z = newZ;
        this.updateQ();
    }

    /**
     *
     * @returns boolean
     */
    this.isZero = function()
    {
        var allZeros = true;
        var i = 0;

        for (i = 0; i < 4; i++)
        {
            if (this.q[i] != null)
            {
                if (this.q[i] != 0)
                {
                    allZeros = false;
                    break;
                }
            }
        }

        return allZeros;
    }
};var QuaternionMath = {

    /**
     *
     * @param q1 Quaternion
     * @param q2 Quaternion
     *
     * @returns Quaternion
     */
    multiplyQuaternions: function(q1, q2)
    {
        //multiplies q1 by q2;
        if (q1.isZero())
        {
            return q2;
        }
        else if (q2.isZero())
        {
            return q1;
        }
        else
        {
            var w1 = q1.getW(); //double
            var x1 = q1.getX(); //double
            var y1 = q1.getY(); //double
            var z1 = q1.getZ(); //double
            var w2 = q2.getW(); //double
            var x2 = q2.getX(); //double
            var y2 = q2.getY(); //double
            var z2 = q2.getZ(); //double

            //now that each quaternion has an axis of rotation that is a unit vector, multiply the two:
            var quaternionProduct = new Quaternion();
            quaternionProduct.setW(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2);
            quaternionProduct.setX(w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2);
            quaternionProduct.setY(w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2);
            quaternionProduct.setZ(w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2);

            return quaternionProduct;
        }
    },

    /**
     *
     * @param qRotation Quaternion
     * @param inputVector Double[]
     *
     * @returns Double[]
     */
    applyQuaternionRotation: function(qRotation, inputVector)
    {
        //applies qRotation q1 to the vector inputVector (3x1)
        var q0 = qRotation.getW(); //double
        var q1 = qRotation.getX(); //double
        var q2 = qRotation.getY(); //double
        var q3 = qRotation.getZ(); //double

        var A = new Array(3); //Double[3][3];
        var i = 0;
        for(i = 0; i < 3; i++)
        {
            A[i] = new Array(3);
        }

        A[0][0] = 2*q0*q0-1+2*q1*q1;
        A[0][1] = 2*q1*q2+2*q0*q3;
        A[0][2] = 2*q1*q3-2*q0*q2;
        A[1][0] = 2*q1*q2-2*q0*q3;
        A[1][1] = 2*q0*q0-1+2*q2*q2;
        A[1][2] = 2*q2*q3+2*q0*q1;
        A[2][0] = 2*q1*q3+2*q0*q2;
        A[2][1] = 2*q2*q3-2*q0*q1;
        A[2][2] = 2*q0*q0-1+2*q3*q3;

        var matrixProduct = MathTools.multiply2dBy1d(A, inputVector);

        return matrixProduct;
    },

    /**
     *
     * @param q Quaternion
     *
     * @returns Double[]
     */
    getEulerAngles: function(q)
    {
        //------DETERMINING THE EQUIVALENT EULER ROTATION ANGLES------
        //translate the net (final) quaternion back to euler angles
        var q0 = q.getW(); //double
        var q1 = q.getX(); //double
        var q2 = q.getY(); //double
        var q3 = q.getZ(); //double

        var phi = Math.atan2((2 * (q0 * q1 + q2 * q3)),
            (1 - 2 * (q1 * q1 + q2 * q2)));   //rad  (rotation about the x-axis)
        var theta = Math.asin(2 * (q0 * q2 - q3 * q1)); //rad  (rotation about the y-axis)
        var gamma = Math.atan2((2 * (q0 * q3 + q1 * q2)),
            (1 - 2 * (q2 * q2 + q3 * q3))); //rad  (rotation about the z-axis)

        //equivalentRotationMatrix=Rot3(gamma*180/pi)*Rot2(theta*180/pi)*Rot1(phi*180/pi);
        var EulerAngles = new Array(3); //Double[3];
        EulerAngles[0] = MathTools.toDegrees(phi);     //deg  (rotation about the x-axis)
        EulerAngles[1] = MathTools.toDegrees(theta);   //deg  (rotation about the y-axis)
        EulerAngles[2] = MathTools.toDegrees(gamma);   //deg  (rotation about the z-axis)

        //remember, the equivalentRotationMatrix=Rot3(gamma*180/pi)*Rot2(theta*180/pi)*Rot1(phi*180/pi);
        return EulerAngles;
    },

    /**
     *
     * @param m Double[][]
     *
     * @returns Quaternion
     */
    convertRotationMatrixToQuaternion: function(m)
    {
        //converts a 3x3 rotation matrix to an equivalent quaternion
        var q = new Quaternion();
        var m11 = m[0][0]; //double
        var m12 = m[0][1]; //double
        var m13 = m[0][2]; //double
        var m21 = m[1][0]; //double
        var m22 = m[1][1]; //double
        var m23 = m[1][2]; //double
        var m31 = m[2][0]; //double
        var m32 = m[2][1]; //double
        var m33 = m[2][2]; //double

        q.setW(0.5 * Math.sqrt(m11+m22+m33+1));
        q.setX((m23 - m32) / (4 * q.getW()));
        q.setY((m31 - m13) / (4 * q.getW()));
        q.setZ((m12 - m21) / (4 * q.getW()));

        return q;
    }
};/**
 *
 * @author Justin
 */

var UNIVERSE = UNIVERSE || {};

UNIVERSE.RectangleSensorShpae = function(shapeName, width, height)
{
	this.shapeName = shapeName;
    this.width = width;
    this.height = height;

    this.getHeight = function()
    {
        return this.height;
    }

    this.setHeight = function(height)
    {
        this.height = height;
    }

    this.getWidth = function()
    {
        return this.width;
    }

    this.setWidth(width)
    {
        this.width = width;
    }

    this.getAngularExtentOfSensorAtSpecifiedAzimuth(checkAngle)
    {

        if ((this.height == 0) && (this.width == 0))
        {
            return 0;
        }
        else
        {
            var upperRightCorner = MathTools.toDegrees(Math.atan(this.height / this.width));  //the azimuth (from the x-axis) of the corner
            var upperLeftCorner = 180 - upperRightCorner;
            var lowerLeftCorner = 180 + upperRightCorner;
            var lowerRightCorner = 360 - upperRightCorner;
            
            //System.out.println("ur: "+upperRightCorner+" ul: "+upperLeftCorner+" ll: "+lowerLeftCorner+" lr: "+lowerRightCorner);
            if (checkAngle<0){
                checkAngle+=360;
            }
            
            var r1=Math.abs(this.width/(2*Math.cos(MathTools.toRadians(checkAngle))));
            var r2=Math.abs(this.height/(2*Math.sin(MathTools.toRadians(checkAngle))));
             
            //determine which quadrant the azimuth is in
            if(checkAngle<upperRightCorner){
                return r1;
            }
            else if (checkAngle<upperLeftCorner){
                return r2;
            }
            else if (checkAngle<lowerLeftCorner){
                return r1;
            }
            else if (checkAngle<lowerRightCorner){
                return r2;
            }
            else{
                return r1;
            }

        }

    }

    this.canSensorSeePointAtAzEl = function(relativeAzimuth, relativeRadius){
        var canSee=false;
        
        var radiusSensor=getAngularExtentOfSensorAtSpecifiedAzimuth(relativeAzimuth);
        if(radiusSensor>relativeRadius){
            canSee=true;
        }
        return canSee;
    }
};
var UNIVERSE = UNIVERSE || {};

UNIVERSE.RSWCoordinates = function(radial, alongTrack, crossTrack) {
 
    // define variables as <var name>: <value>

    this.radial = radial ? radial : 0.0; //radial vector (km)
    this.alongTrack = alongTrack ? alongTrack : 0.0; //along track vector (km)
    this.crossTrack = crossTrack ? crossTrack : 0.0; //cross track vector (km)

    /**
     * Get the radial value.
     */
    this.getRadial = function()
    {
        return this.radial;
    }

    /**
     * Set the radial value.
     */
    this.setRadial = function(radial)
    {
        this.radial = radial;
    }

    /**
     * Get the alongTrack value.
     */
    this.getAlongTrack = function()
    {
        return this.alongTrack;
    }

    /**
     * Set the alongTrack value.
     */
    this.setAlongTrack = function(alongTrack)
    {
        this.alongTrack = alongTrack;
    }

    /**
     * Get the crossTrack value.
     */
    this.getCrossTrack = function()
    {
        return this.crossTrack;
    }

    /**
     * Set the crossTrack value.
     */
    this.setCrossTrack = function(crossTrack)
    {
        this.crossTrack = crossTrack;
    }
};// package SensorPackage;
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

        /*
        //figure out where the target is in RSW coordinates
        RSWcoordinates rsw = CoordinateConversionTools.convertTargetECIToSatelliteRSW(satellite, targetPosition);
        //System.out.println(targetPosition.toString() + "---" + rsw.toString());
        
        //vector to the target (RSW)
        Double[] targetline = new Double[3];
        targetline[0] = rsw.getRadial();
        targetline[1] = rsw.getAlongTrack();
        targetline[2] = rsw.getCrossTrack();
        //convert the RSW coordinates of the target into the sensor coordinate system
        Double[] targetInSensorCoordinates = QuaternionMath.applyQuaternionRotation(quaternionFromRSWToSensor, targetline);
        //System.out.println("quaternion: " + quaternionFromRSWToSensor.toString());
        targetline[0] = targetInSensorCoordinates[0];
        targetline[1] = targetInSensorCoordinates[1];
        targetline[2] = targetInSensorCoordinates[2];
         * */


        //define the target position as a vectors
        //System.out.println("targetpos: " + targetPosition.getX() + ", " + targetPosition.getY() + ", " + targetPosition.getZ());
        var targetline = new Array();
        targetline[0] = targetPosition.getX() - satellite.getEci().getX();
        targetline[1] = targetPosition.getY() - satellite.getEci().getY();
        targetline[2] = targetPosition.getZ() - satellite.getEci().getZ();
        //System.out.println("delta ECI: " + targetline[0] + ", " + targetline[1] + ", " + targetline[2]);


        //get the quaternion to convert the ECI coordinate of the target into an RSW coordinate triplet
        var eciToRSWquaternion = QuaternionMath.convertRotationMatrixToQuaternion(CoordinateConversionTools.buildRotationMatrixToConvertECItoRSW(satellite));

        var targetInSensorCoordinates = QuaternionMath.applyQuaternionRotation(QuaternionMath.multiplyQuaternions(eciToRSWquaternion, this.quaternionFromRSWToSensor), targetline);


        //convert the RSW coordinates of the target into the sensor coordinate system
        //Double[] targetInSensorCoordinates = QuaternionMath.applyQuaternionRotation(quaternionFromRSWToSensor, targetInRSWCoordinates);

        //System.out.println("quaternion: " + quaternionFromRSWToSensor.toString());
        targetline[0] = targetInSensorCoordinates[0];
        targetline[1] = targetInSensorCoordinates[1];
        targetline[2] = targetInSensorCoordinates[2];
        //System.out.println("targetline in sensor coords: " + targetline[0] + ", " + targetline[1] + ", " + targetline[2]);



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
        //System.out.println("rightline: " + rightline[0] + ", " + rightline[1] + ", " + rightline[2]);


        var topline = new Array();
        topline[0] = 1.0;//center
        topline[1] = 0.0;//left
        topline[2] = Math.tan(MathTools.toRadians(this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(90.0)));//top
        //System.out.println("topline: " + topline[0] + ", " + topline[1] + ", " + topline[2]);

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

        var satXpos = satellite.getEci().getX();
        var satYpos = satellite.getEci().getY();
        var satZpos = satellite.getEci().getZ();

        var azimuthStep = 360.0 / NumPoints; //the azimuth separation between each point
        for (var i = 0; i < NumPoints; i++)
        {
            var az = i * azimuthStep;
            var el = MathTools.toRadians(this.shape.getAngularExtentOfSensorAtSpecifiedAzimuth(az));

            //build the sensor field of view vector in RSW

            //define the vector to the sensor boundary
            var FOVboundary = new Array(3);
            FOVboundary[0] = el * Math.cos(MathTools.toRadians(az));  //radial
            FOVboundary[1] = 1.0;  //along
            FOVboundary[2] = el * Math.sin(MathTools.toRadians(az));  //cross

            //ensure that it is a unit vector
            var FOVmagnitude = MathTools.magnitude(FOVboundary);
			
			// For testing purposes, can set this way to have longer vectors that actually show up in 3
			//var FOVmagnitude = 0.01
            FOVboundary[0] = FOVboundary[0] / FOVmagnitude;
            FOVboundary[1] = FOVboundary[1] / FOVmagnitude;
            FOVboundary[2] = FOVboundary[2] / FOVmagnitude;

            //rotate the vectors back into the RSW coordinate system by applying the opposite of the quaternion to the sensor
            //rotate about along track
            var quaternionFromSensorToRSW = new Quaternion();
            quaternionFromSensorToRSW.setW(this.quaternionFromRSWToSensor.getW());
            quaternionFromSensorToRSW.setX(-this.quaternionFromRSWToSensor.getX());
            quaternionFromSensorToRSW.setY(-this.quaternionFromRSWToSensor.getY());
            quaternionFromSensorToRSW.setZ(-this.quaternionFromRSWToSensor.getZ());

            FOVboundary = QuaternionMath.applyQuaternionRotation(this.quaternionFromRSWToSensor, FOVboundary);

            /*
            //rotate about along track
            FOVboundary = MathTools.applyRot2(this.alongtrackRotationAngle, FOVboundary);
            //rotate about cross track
            FOVboundary = MathTools.applyRot3(this.crosstrackRotationAngle, FOVboundary);
            //rotate about radial
            FOVboundary = MathTools.applyRot1(this.radialRotationAngle, FOVboundary);
             */
            var rswPoint = new UNIVERSE.RSWCoordinates(FOVboundary[0], FOVboundary[1], FOVboundary[2]);

            //convert the RSW to ECI
            var eciTemp = CoordinateConversionTools.convertRSWToECI(satellite, rswPoint);
            FOV[i][0] = satXpos + eciTemp.getX();
            FOV[i][1] = satYpos + eciTemp.getY();
            FOV[i][2] = satZpos + eciTemp.getZ();

            //System.out.println(i + "," + az + "," + el + "," + FOV[i][0] + "," + FOV[i][1] + "," + FOV[i][2]);
        }

        return FOV;
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
        
        
        
        
        /*
         *double refMagnitude = MathTools.magnitude(eciXYZvector);
        Double[] startVec = new Double[3];
        startVec[0] = eciXYZvector[0] / refMagnitude;
        startVec[1] = eciXYZvector[1] / refMagnitude;
        startVec[2] = eciXYZvector[2] / refMagnitude;

        //determine the quaternion from the reference vector to the satellite position vector
        Double[] satelliteVec = new Double[3];
        double x=satellite.getEci().getX();
        double y=satellite.getEci().getY();
        double z=satellite.getEci().getZ();
        double satelliteMagnitude=Math.sqrt(x*x+y*y+z*z);
        satelliteVec[0] = x / satelliteMagnitude;
        satelliteVec[1] = y / satelliteMagnitude;
        satelliteVec[2] = z / satelliteMagnitude; 
        
        //figure out the quaternion from RSW to the default sensor axis (nadir)
        Quaternion nadirQuaternion = new Quaternion();
        double rotationRadians = Math.toRadians(180.0);
        Double[] rotationAxis = new Double[3];
        rotationAxis[0] = 0.0;
        rotationAxis[1] = 0.0;
        rotationAxis[2] = 1.0;
        nadirQuaternion.setW(Math.cos(rotationRadians / 2.0));
        nadirQuaternion.setX(Math.sin(rotationRadians / 2.0) * rotationAxis[0]);
        nadirQuaternion.setY(Math.sin(rotationRadians / 2.0) * rotationAxis[1]);
        nadirQuaternion.setZ(Math.sin(rotationRadians / 2.0) * rotationAxis[2]);

        //figure out the quaternion from the satellite's coordinate system to the sensor
        Double[] crossproduct = MathTools.cross(startVec, satelliteVec);
        Quaternion quaternionFromECIToRSW=new Quaternion();
        quaternionFromECIToRSW.setX(crossproduct[0]);
        quaternionFromECIToRSW.setY(crossproduct[1]);
        quaternionFromECIToRSW.setZ(crossproduct[2]);
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

        System.out.println("nadir: "+nadirQuaternion.toString());
        System.out.println("quaternionFromECIToRSW: "+quaternionFromECIToRSW.toString());
        System.out.println("this.quaternionFromRSWToSensor: "+this.quaternionFromRSWToSensor.toString());
        Quaternion result=QuaternionMath.multiplyQuaternions(quaternionFromECIToRSW,nadirQuaternion);
        result=QuaternionMath.multiplyQuaternions(result,this.quaternionFromRSWToSensor);
        //result=QuaternionMath.multiplyQuaternions(result,this.quaternionFromRSWToSensor);

        return result;
         */
    }
};var SimulationObject = {

    // define variables as <var name>: value

    name:         "",
    eciCoords:    UNIVERSE.ECICoordinates,
    ecefCoords:   UNIVERSE.ECEFCoordinates,
    keplerCoords: KeplerianCoordinates,
    llaCoords:    UNIVERSE.LLACoordinates,
    sensorList:   new Array(),

    /**
     * Returns the Ecef Coordinates of this object.
     */
    getEcefCoordinates: function()
    {
        return ecefCoords;
    },

    /**
     * Sets the Ecef Coordinates of this object.
     */
    setEcefCoordinates: function(newEcefCoords)
    {
        ecefCoords = newEcefCoords;
    },

    /**
     * Returns the Eci Coordinates of this object.
     */
    getEciCoordinates: function()
    {
        return eciCoords;
    },

    /**
     * Sets the Eci Coordinates of this object.
     */
    setEciCoordinates: function(newEciCoords)
    {
        eciCoords = newEciCoords;
    },

    /**
     * Returns the Keplerian Coordinates of this object.
     */
    getKeplerianCoordinates: function()
    {
        return keplerCoords;
    },

    /**
     * Sets the Keplerian Coordinates of this object.
     */
    setKeplerianCoordinates: function(newKeplerCoords)
    {
        kepler = newKeplerCoords;
    },

    /**
     *  Returns the Lla Coordinates of this object.
     */
    getLlaCoordinates: function()
    {
        return llaCoords;
    },

    /**
     * Sets the Lla Coordinates of this object.
     */
    setLlaCoordinates: function(newLlaCoords)
    {
        lla = newLlaCoords;
    },

    /**
     * Returns the name of this object.
     */
    getName: function()
    {
        return name;
    },

    /**
     * Sets the name of this object.
     */
    setName: function(name)
    {
        this.name = name;
    },

    /**
     * Returns the Sesnors for this object.
     */
    getSensors: function()
    {
        return sensors;
    },

    /**
     * Sets the sensors for this object.
     */
    setSensors: function(newSensorList)
    {
        sensorList = newSensorList;
    },

    /**
     * Propagates the state of a Simulation object.
     *
     * @param timeToPropagate          double
     * @param dt                       double
     * @param timeAtStartOfPropagation date
     */
    propagateState: function(timeToPropagate, dt, timeAtStartOfPropagation)
    {
        eciCoords = OrbitPropagator.propagateOrbit(eci, timeToPropagate,dt, timeAtStartOfPropagation);
        keplerCoords = CoordinateConversionTools.convertECIToKeplerian(eci);

        //calculate the greenwich hour angle from the current time plus the elapsed time 'dt'
        var newMilliseconds = (timeAtStartOfPropagation.getTime() +
            (timeToPropagate * 1000.0));         //long
        var simTime = new Date(newMilliseconds); //Date
        var GST = CoordinateConversionTools.convertTimeToGMST(simTime); //double

        //calculate the ECEF and LLA coordinates based upon the new ECI coordinates
        ecefCoords = CoordinateConversionTools.convertECItoECEF(eci, GST);
        llaCoords = CoordinateConversionTools.convertECItoLLA(eci, GST);
    }
};var HarmonicTerms = {

    /**
     *
     * @param state double[]
     * @param GST   double
     *
     * @returns Array of double
     */
    calculatePerturbationTerms: function(state, GST)
    {

    }
}; 
var OrbitPropagator = {

    /**
     *
     *
     * @param state                    double[]
     * @param elapsedTime              double
     * @param dt                       double
     * @param timeAtStartOfPropagation date
     *
     * @returns Array of doubles
     */
    rungeKuttaFehlbergIntegrator: function(state, elapsedTime, dt, timeAtStartOfPropagation)
    {
        //fifth order runge-kutta-fehlberg integrator
        var tempState = state;

        var f = new Array();          //array of doubles[9]
        var deltaState = new Array(); //array of doubles[9]
        var dtPrime = 0.0;            //double

        var N = 1;  //int
        var h = dt; //double

        //if the timestep is too big, reduce it to a smaller timestep and loop through the updates at the smaller timestep to add up to the total timestep
        var maxResolution = 0.02; //double

        if (dt > maxResolution)
        {
            h = maxResolution;
        }

        var newMilliseconds = timeAtStartOfPropagation.getTime(); //long

        N = elapsedTime / h;

        var j = 1;

        for (j = 1; j <= N; j++)
        {
            newMilliseconds = newMilliseconds + (h * 1000.0); //keep in millis
            var simTime = new Date(newMilliseconds);
            GST = CoordinateConversionTools.convertTimeToGMST(simTime); //double

            var k1 = new Array(); //double[9]
            var k2 = new Array(); //double[9]
            var k3 = new Array(); //double[9]
            var k4 = new Array(); //double[9]
            var k5 = new Array(); //double[9]
            var k6 = new Array(); //double[9]

            //for loop counter
            var i = 0;

            //build k1
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i];
            }

            dtPrime = h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k1[i] = h * f[i];
            }

            //build k2
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + 0.25 * k1[i];
            }

            dtPrime = 0.25 * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k2[i] = h * f[i];
            }

            //build k3
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + (3.0 / 32.0) * k1[i] + (9.0 / 32.0) * k2[i];
            }

            dtPrime = 0.375 * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k3[i] = h * f[i];
            }

            //build k4
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + ((1932.0 / 2197.0) * k1[i]) -
                    ((7200.0 / 2197.0) * k2[i]) + ((7296.0 / 2197.0) * k3[i]);
            }

            dtPrime = 0.9230769230769231 * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k4[i] = h * f[i];
            }

            //build k5
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] + ((439.0 / 216.0) * k1[i]) -
                    (8.0 * k2[i]) + ((3680.0 / 513.0) * k3[i]) - ((845.0 / 4104.0) * k4[i]);
            }

            dtPrime = h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k5[i] = h * f[i];
            }

            //build k6
            for (i = 0; i < 9; i++)
            {
                deltaState[i] = tempState[i] - ((8.0 / 27.0) * k1[i]) +
                    ((2.0) * k2[i]) - ((3544.0 / 2565.0) * k3[i]) +
                    ((1859.0 / 4104.0) * k4[i]) - ((11.0 / 40.0) * k5[i]);
            }

            dtPrime = (0.5) * h;

            f = this.generateStateUpdate(deltaState, dtPrime, GST);

            for (i = 0; i < 9; i++)
            {
                k6[i] = h * f[i];
            }

            //generate the estimate for this step in time
            for (i = 0; i < 9; i++)
            {
                //http://en.wikipedia.org/wiki/Runge%E2%80%93Kutta%E2%80%93Fehlberg_method
                tempState[i] = tempState[i] + ((16.0 / 135.0) * k1[i]) +
                    ((6656.0 / 12825.0) * k3[i]) + ((28561.0 / 56430.0) * k4[i]) -
                    ((9.0 / 50.0) * k5[i]) + ((2.0 / 55.0) * k6[i]);
            }
        }

        return tempState;
    },

    /**
     *
     *
     * @param state double[]
     * @param dt    double
     * @param GST   double
     *
     * @returns double[]
     */
    generateStateUpdate: function(state, dt, GST)
    {
        //state is 9x1
        //state structure is x,y,z,vx,vy,vz,ax,ay,az
        var stateRateOfChange = new Array(); //double[9]
        var mu = Constants.muEarth;     //double
        var r = Math.sqrt((state[0] * state[0]) + (state[1] * state[1]) +
            (state[2] * state[2])); //double

        //figure out the rate of change of x,y,z,vx,vy,vz
        stateRateOfChange[0] = state[3]; //vx
        stateRateOfChange[1] = state[4]; //vy
        stateRateOfChange[2] = state[5]; //vz
        stateRateOfChange[3] = -mu * state[0] / (r * r * r); //ax
        stateRateOfChange[4] = -mu * state[1] / (r * r * r); //ay
        stateRateOfChange[5] = -mu * state[2] / (r * r * r); //az
        stateRateOfChange[6] = 0.0;
        stateRateOfChange[7] = 0.0;
        stateRateOfChange[8] = 0.0;
       
        return stateRateOfChange;
    },

    /**
     *
     * @param eci                      ECICoordinates
     * @param elapsedTime              double
     * @param dt                       double, time-step
     * @param timeAtStartOfPropagation Date
     *
     * @returns {UNIVERSE.ECICoordinates} 
     */
    propagateOrbit: function(eci, elapsedTime, dt, timeAtStartOfPropagation)
    {
        
        var kep = CoordinateConversionTools.convertECIToKeplerian(eci);
        //console.log('eccentricity: ' + JSON.stringify(kep.getEccentricity()));
        //timespan is in seconds
        if (elapsedTime == 0.0 || isNaN(kep.getEccentricity()))
        {
            return eci;
        }
        else if(kep.getEccentricity() <= 0.1) {
            //console.log('keping it up');
            var MA = kep.getMeanAnomaly()+kep.getMeanMotion()*elapsedTime; //update the mean anomaly (deg)
            var w = MathTools.toRadians(kep.getArgOfPerigee());
            var ra = MathTools.toRadians(kep.getRaan());
            var inc = MathTools.toRadians(kep.getInclination());
            var ecc=kep.getEccentricity();
            var mu=Constants.muEarth;
            //System.out.println("elapsed time: "+elapsedTime+" dt: "+dt+" ecc: "+kep.getEccentricity());
            //console.log("MA: "+kep.getMeanAnomaly()+" meanMotion: "+kep.getMeanMotion()+" new MA: "+MA + " elapsedTime: " + elapsedTime);
            MA = MathTools.toRadians(MA);  //convert the mean anomaly to radians
            //iterate to solve for the eccentric anomaly
            var EA = MA * 0.95; //fist guess at the eccentric anomaly (rads)
            var errorThreshold = 1e-5;  //how accurately do we need to solve for the eccentric anomaly?
            for (var i = 0; i < 500; i++)
            {
                var myerror = MA - (EA - ecc * Math.sin(EA));
                if (Math.abs(myerror) > errorThreshold)
                {
                    if (myerror > 0)
                    {
                        EA = EA + Math.abs(MA - EA) / 2;
                    }
                    else
                    {
                        if (myerror < 0)
                        {
                            EA = EA - Math.abs(MA - EA) / 2;
                        }
                    }
                }
                else
                {
                    break;
                }

            }

            var f = 2 * Math.atan(Math.sqrt((1 + ecc) / (1 - ecc)) * Math.tan(EA / 2));
            var p = kep.getSemimajorAxis() * (1 -ecc * ecc);
            var r = kep.getSemimajorAxis() * (1 -ecc* Math.cos(EA)); //radius
            var h = Math.sqrt(mu * kep.getSemimajorAxis() * (1 - ecc* ecc));
            var x = r * (Math.cos(ra) * Math.cos(w + f) - Math.sin(ra) * Math.sin(w + f) * Math.cos(inc));
            var y = r * (Math.sin(ra) * Math.cos(w + f) + Math.cos(ra) * Math.sin(w + f) * Math.cos(inc));
            var z = r * Math.sin(inc) * Math.sin(w + f);
            var xdot = ((x * h * ecc) / (r * p)) * Math.sin(f) - (h / r) * (Math.cos(ra) * Math.sin(w + f) + Math.sin(ra) * Math.cos(w + f) * Math.cos(inc));
            var ydot = ((y * h * ecc) / (r * p)) * Math.sin(f) - (h / r) * (Math.sin(ra) * Math.sin(w + f) - Math.cos(ra) * Math.cos(w + f) * Math.cos(inc));
            var zdot = ((z * h * ecc) / (r * p)) * Math.sin(f) + (h / r) * (Math.sin(inc) * Math.cos(w + f));

            //System.out.println(vehicleName+","+x+","+y+","+z+","+xdot+","+ydot+","+zdot);
            var eciState = new UNIVERSE.ECICoordinates();
            
            eciState.setX(x);
            eciState.setY(y);
            eciState.setZ(z);
            eciState.setVX(xdot);
            eciState.setVY(ydot);
            eciState.setVZ(zdot);
            eciState.setAX(0.0);
            eciState.setAY(0.0);
            eciState.setAZ(0.0);
            return eciState;
        }
        else
        {
            //console.log('runging it up: ' + + JSON.stringify(kep.getEccentricity()));
            var state = new Array();     //double[9]

            //establish the starting state vector;
            state[0] = eci.x;
            state[1] = eci.y;
            state[2] = eci.z;
            state[3] = eci.vx;
            state[4] = eci.vy;
            state[5] = eci.vz;
            state[6] = eci.ax;
            state[7] = eci.ay;
            state[8] = eci.az;

            //call the integrator
            var updatedState =  //double[]
               this.rungeKuttaFehlbergIntegrator(state, elapsedTime, dt, timeAtStartOfPropagation);

            //console.log("updatedState: " + JSON.stringify(updatedState));
            //translate the integrated values into the correct class structure
            var newEci = new UNIVERSE.ECICoordinates(
                updatedState[0], 
                updatedState[1], 
                updatedState[2], 
                updatedState[3], 
                updatedState[4], 
                updatedState[5], 
                updatedState[6], 
                updatedState[7], 
                updatedState[8]); //ECICoordinates
            //console.log("newEci: " + JSON.stringify(newEci));
            return newEci;
        }
    }
};var UNIVERSE = UNIVERSE || {};

/** 
	A Ground Object to be drawn on the Earth
	@constructor
	@param {string} id - Identifier for the object to be referenced later
	@param {string} objectName - A name for the object if different than id.  Set to the id if not defined
	@param {function} propagator - A function(time) to give the object's position at a time.  No time passed in means the current Universe time
	@param {string} modelId - Identifier for the model to use that has been added to the Universe's object library
 */

UNIVERSE.GroundObject = function(id, objectName, modelId, propagator) {
	if(id == undefined)
	{ 
		return undefined;
	}
	this.id = id;
	this.objectName = objectName || id;
	this.propagator = propagator;
	this.modelId = modelId;
}

UNIVERSE.GroundObject.prototype = {
	constructor: UNIVERSE.GroundObject,
	
	set: function ( id, objectName, propagator, modelId ) {

		this.id = id;
		this.objectName = objectName || id;
		this.propagator = propagator;
		this.modelId = modelId;

		return this;
	}
};
var UNIVERSE = UNIVERSE || {};

/** 
	An object to be drawn in orbit around the Earth
	@constructor
	@param {string} id - Identifier for the object to be referenced later
	@param {string} objectName - A name for the object if different than id.  Set to the id if not defined
	@param {function} propagator - A function(time) to give the object's position at a time.  No time passed in means the current Universe time
	@param {string} modelId - Identifier for the model to use that has been added to the Universe's object library
	@param {boolean} showPropagationLine - should a propagation line be shown for the object
	@param {boolean} showGroundTrackPoint - should the ground track point be shown for the object
 */

UNIVERSE.SpaceObject = function(id, objectName, modelId, propagator, showPropagationLine, showGroundTrackPoint, sensors) {
	if(id == undefined)
	{ 
		return undefined;
	}
	this.id = id;
	this.objectName = objectName || id;
	this.propagator = propagator;
	this.modelId = modelId;
	this.showPropagationLine = showPropagationLine || false;
	this.showGroundTrackPoint = showGroundTrackPoint || false;
	this.sensors = sensors || undefined;
}

UNIVERSE.SpaceObject.prototype = {
	constructor: UNIVERSE.SpaceObject,
	
	set: function ( id, objectName, propagator, modelId, showPropogationLine, showGroundTrackPoint, sensors) {

		this.id = id;
		this.objectName = objectName || id;
		this.propagator = propagator;
		this.modelId = modelId;
		this.showPropagationLine = showPropagationLine || false;
		this.showGroundTrackPoint = showGroundTrackPoint || false;
		this.sensors = sensors || undefined;

		return this;
	},
	
	getEci: function () {
		var location = this.propagator();
		
		return new UNIVERSE.ECICoordinates(location.x, location.y, location.z, location.vx, location.vy, location.vz, location.ax, location.ay, location.az);
	}
};var UNIVERSE = UNIVERSE || {};

/** 
	Extensions for doing Earth-based 3D modeling with Universe.js
	@constructor
	@param {UNIVERSE.Universe} universe - The Universe to draw in
	@param {boolean} isSunLighting - Should the Earth be lit by the sun or not
 */
UNIVERSE.EarthExtensions = function(universe, isSunLighting) {
	var earthExtensions = this;
	
	// constants
    var earthSphereRadius = 6371;

	var centerPoint = new THREE.Vector3(0,0,0);
	
	// have to do this this way since the decision of whether to show or hide it has to be made at draw time
    var enableLinkLines = undefined;

	// Is the sun-lighting on the Earth enabled or disabled
	var useSunLighting = isSunLighting ? isSunLighting : true;

    universe.setObjectInLibrary("default_ground_object_geometry", new THREE.SphereGeometry(200, 20, 10));
    universe.setObjectInLibrary("default_ground_object_material", new THREE.MeshLambertMaterial({color : 0xCC0000}));

    universe.setObjectInLibrary("default_ground_track_material", new THREE.MeshBasicMaterial({
        color : 0xCC0000,
        transparent:true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    }));

    universe.setObjectInLibrary("default_sensor_projection_material",new THREE.MeshBasicMaterial({
         color: 0xffaa00,
         transparent: true,
         blending: THREE.AdditiveBlending,
         overdraw: true,
         opacity: 0.15
            }));

    universe.setObjectInLibrary("default_orbit_line_material", new THREE.LineBasicMaterial({
                color : 0x990000,
                opacity : 1
            }));
            
    universe.setObjectInLibrary("default_ground_object_tracing_line_material", new THREE.LineBasicMaterial({
                color : 0x009900,
                opacity : 1
            }));

	/**
		Add the Earth at the center of the Universe
		@public
		@param {string} dayImageURL - URL of the image to be used for the sun-facing side of the Earth
		@param {string} nightImageURL - URL of the image to be used for the dark side of the Earth
	*/
    this.addEarth = function(dayImageURL, nightImageURL) {
        var earthSphereSegments = 40, earthSphereRings = 30;

        // Create the sphere
        var geometry = new THREE.SphereGeometry(earthSphereRadius, earthSphereSegments, earthSphereRings);
		var dayImageTexture   = THREE.ImageUtils.loadTexture( dayImageURL );
		var earthAtNightTexture = THREE.ImageUtils.loadTexture( nightImageURL );
		var nightMaterial = new THREE.MeshBasicMaterial({
			 color: 0xffffff,
	         overdraw: true,
			 map: earthAtNightTexture,
			 blending: THREE.AdditiveBlending
		});
        
        var nightEarthMesh = new THREE.Mesh(geometry, nightMaterial);

		//var normalTexture   = THREE.ImageUtils.loadTexture( "/assets/universe/earth_normal_2048.jpg" );
		//var specularTexture = THREE.ImageUtils.loadTexture( "/assets/universe/earth_specular_2048.jpg" );

		// planet
		//geometry.computeTangents();

		var dayMaterial = new THREE.MeshPhongMaterial({
			map: dayImageTexture,
			color: 0xffffff,
			// specular: 0xffffff,
			//ambient: 0xffffff,
			// shininess: 15,
			//opacity: 0.5,
			transparent: true,
			// reflectivity: 1
			blending: THREE.AdditiveBlending
		})

		var dayEarthMesh = new THREE.Mesh(geometry, dayMaterial);
		
		var earthMaterial = new THREE.MeshBasicMaterial({
			 color: 0xffffff,
	         overdraw: true,
			 map: dayImageTexture,
			 blending: THREE.AdditiveBlending
		});
		
		var earthMesh = new THREE.Mesh(geometry, earthMaterial);

		var earthObject = new UNIVERSE.GraphicsObject(
			"earth", 
			"earth",
			{x:0, y:0, z:0},
			function(elapsedTime) {
            	var rotationAngle = CoordinateConversionTools.convertTimeToGMST(universe.getCurrentUniverseTime());
            	dayEarthMesh.rotation.y = rotationAngle * (2 * Math.PI / 360);
				nightEarthMesh.rotation.y = rotationAngle * (2 * Math.PI / 360);
				earthMesh.rotation.y = rotationAngle * (2 * Math.PI / 360);
        	},
 			function() {
				// for some reason these lines have to go in this order for night to be under day...
					universe.draw(this.id + "_day", dayEarthMesh, false);
					universe.draw(this.id + "_night", nightEarthMesh, false);
					universe.draw(this.id, earthMesh, false);
					earthExtensions.useSunLighting(useSunLighting);
                			
            });
		universe.addObject(earthObject);
    };
    
	/**
		Add the Moon to the Universe
		@public
		@param {string} moonImageURL - the URL of the Moon image to use
	*/
    this.addMoon = function(moonImageURL) {
        var moonSphereSegments = 40, moonSphereRings = 30;
        var moonSphereRadius = 1737.1;

        // Create the sphere
        var geometry = new THREE.SphereGeometry(moonSphereRadius, moonSphereSegments, moonSphereRings);

		var moonTexture = THREE.ImageUtils.loadTexture(moonImageURL);
		
		var dayMaterial = new THREE.MeshPhongMaterial({
			map: moonTexture,
			color: 0xffffff,
			// specular: 0xffffff,
			//ambient: 0xffffff,
			// shininess: 15,
			//opacity: 0.5,
			transparent: true,
			// reflectivity: 1
			blending: THREE.AdditiveBlending
		})

		var dayMoonMesh = new THREE.Mesh(geometry, dayMaterial);
		
		var moonMaterial = new THREE.MeshBasicMaterial({
			 color: 0xffffff,
	         overdraw: true,
			 map: moonTexture,
			 blending: THREE.AdditiveBlending
		});
		
		var moonMesh = new THREE.Mesh(geometry, moonMaterial);

		var moonObject = new UNIVERSE.GraphicsObject(
			"moon", 
			"moon",
			undefined,
			function(elapsedTime) {
                var time = new Date(universe.getCurrentUniverseTime());
				var propagatedValue = CoordinateConversionTools.getMoonPositionECIAtCurrentTime(time);
				var convertedLocation = eciTo3DCoordinates({x: propagatedValue.x, y: propagatedValue.y, z: propagatedValue.z });
				dayMoonMesh.position = {x: convertedLocation.x, y: convertedLocation.y, z: convertedLocation.z };
				moonMesh.position = {x: convertedLocation.x, y: convertedLocation.y, z: convertedLocation.z };
				this.currentLocation = {x: convertedLocation.x, y: convertedLocation.y, z: convertedLocation.z };
            },
			function() {
				universe.draw(this.id + "_day", dayMoonMesh, false);
				universe.draw(this.id, moonMesh, false);
				earthExtensions.useSunLighting(useSunLighting);
            }
		)
		universe.addObject(moonObject);
    }

	/**
		Add the sun to the Universe at the correct position relative to the Earth-centered universe
	*/
	this.addSun = function() {
		//var sunLight = new THREE.PointLight( 0xffffff, 1.5);
		
		var sunGraphicsObject = new UNIVERSE.GraphicsObject(
			"sun",
			"sun",
			undefined,
			function(elapsedTime) {
				//console.log("sun update");
				var sunLocation = CoordinateConversionTools.getSunPositionECIAtCurrentTime(universe.getCurrentUniverseTime());
				var convertedLocation = eciTo3DCoordinates({x: sunLocation.x, y: sunLocation.y, z: sunLocation.z });
				//sunLight.position.set({x: sunLocation.x, y: sunLocation.y, z: sunLocation.z});
				//console.log("sunLocation: " + JSON.stringify(sunLocation));
				universe.updateLight(convertedLocation.x, convertedLocation.y, convertedLocation.z, 1.5);
				this.currentLocation = {x: convertedLocation.x, y: convertedLocation.y, z: convertedLocation.z };
			},
			function() {
				//console.log("sun draw");
				universe.draw(this.id, undefined, false);
			}
		)
		universe.addObject(sunGraphicsObject);
	}

	/**
		Add a Space Object to the Universe
		@public
		@param {UNIVERSE.SpaceObject} spaceObject - An orbiting object to add to the Universe
	*/
    this.addSpaceObject = function(spaceObject) {
        var objectGeometry, material;
        universe.getObjectFromLibraryById(spaceObject.modelId, function(retrieved_geometry) {
            objectGeometry = retrieved_geometry;
            universe.getObjectFromLibraryById("default_material", function(retrieved_material) {
                material = retrieved_material;

                //objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( 0, 0, 0 ) ));
                var objectModel = new THREE.Mesh(objectGeometry, material);

				var spaceGraphicsObject = new UNIVERSE.GraphicsObject(
						spaceObject.id,
						spaceObject.objectName,
						undefined,
						function(elapsedTime) {
	                        // need to pass a time to the propagator
	                        var convertedLocation = eciTo3DCoordinates(spaceObject.propagator());
	                        if(convertedLocation != undefined) {
	                            objectModel.position.set(convertedLocation.x, convertedLocation.y, convertedLocation.z);

	                            //http://mrdoob.github.com/three.js/examples/misc_lookat.html
	                            objectModel.lookAt(centerPoint);
								this.currentLocation = {x: convertedLocation.x, y: convertedLocation.y, z: convertedLocation.z};
	                        }
						},
						function() {
	                        universe.draw(this.id, objectModel, false);
	                        earthExtensions.showModelForId(spaceObject.showVehicle, this.id);
	                    }
					)
				universe.addObject(spaceGraphicsObject);

                earthExtensions.addPropogationLineForObject(spaceObject);
                earthExtensions.showOrbitLineForObject(spaceObject.showPropogationLine, spaceObject.id);

                earthExtensions.addGroundTrackPointForObject(spaceObject);
                earthExtensions.showGroundTrackForId(spaceObject.showGroundTrackPoint, spaceObject.id);

                earthExtensions.addSensorProjection(spaceObject);
                earthExtensions.showSensorProjectionForId(spaceObject.showSensorProjections, spaceObject.id);
            });
        });
    };

	/**
		Add a Ground Object to the Earth
		@public
		@param {UNIVERSE.GroundObject} groundObject - an object to display on the Earth
	*/
    this.addGroundObject = function(groundObject) {
        var objectGeometry, objectMaterial, material;
        if(!groundObject.modelId) {
            groundObject.modelId = "default_ground_object_geometry";
            material = "default_ground_object_material";
        }
        else {
            material = "default_material";
        }
        universe.getObjectFromLibraryById(groundObject.modelId, function(retrieved_geometry) {
            objectGeometry = retrieved_geometry;
            universe.getObjectFromLibraryById(material, function(retrieved_material) {
                objectMaterial = retrieved_material;
                objectGeometry.applyMatrix( new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( Math.PI / 2, Math.PI, 0 ) ));
                var groundObjectMesh = new THREE.Mesh(objectGeometry, objectMaterial);

				var groundGraphicsObject = new UNIVERSE.GraphicsObject(
						groundObject.id,
						groundObject.objectName,
						undefined,
						function(elapsedTime) {
	                        // check earth rotation and update location
	                        var position = eciTo3DCoordinates(groundObject.propagator());
	                        groundObjectMesh.position.set(position.x, position.y, position.z);
	                        this.currentLocation = {x: position.x, y: position.y, z: position.z};

	                        //http://mrdoob.github.com/three.js/examples/misc_lookat.html
	                        var scaled_position_vector = new THREE.Vector3(position.x, position.y, position.z);

	                        // arbitrary size, just a point along the position vector further out for the object to lookAt
	                        scaled_position_vector.multiplyScalar(1.4);

	                        groundObjectMesh.lookAt(scaled_position_vector);
	                    },
	                    function() {
	                        universe.draw(this.id, groundObjectMesh, true);
	                    }
					);
				universe.addObject(groundGraphicsObject);
            });
        });
    };

	/**
		Add a Ground Track Point for an Object
		@public
		@param {UNIVERSE.SpaceObject} object - The Space Object to add a ground track point for
	*/
	this.addGroundTrackPointForObject = function(object) {
        var objectGeometry, objectMaterial;
        universe.getObjectFromLibraryById("default_ground_object_geometry", function(retrieved_geometry) {
            objectGeometry = retrieved_geometry;
            universe.getObjectFromLibraryById("default_ground_track_material", function(retrieved_material) {
                objectMaterial = retrieved_material;


                var groundObjectMesh = new THREE.Mesh(objectGeometry, objectMaterial);

				var groundGraphicsObject = new UNIVERSE.GraphicsObject(
					object.id + "_groundPoint",
                    object.objectName,
					undefined,
                    function(elapsedTime) {
                        var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));
                        if(objectLocation != undefined) {
                            var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);

                            // move the vector to the surface of the earth
                            vector.multiplyScalar(earthSphereRadius / vector.length())

                            groundObjectMesh.position.copy(vector);
                        }
						this.currentLocation = objectLocation;
                    },
                    function() {
                        universe.draw(this.id, groundObjectMesh, true);
                    }
				);
				universe.addObject(groundGraphicsObject);
            });
        });
    }

    /**
		Add a Propagation Line for an Object
		@public
		@param {UNIVERSE.SpaceObject} object - A Space Object to add a propagation line for
	*/
    this.addPropogationLineForObject = function(object) {
        var objectGeometry, objectMaterial;
        objectGeometry = new THREE.Geometry();
        universe.getObjectFromLibraryById("default_orbit_line_material", function(retrieved_material) {
            objectMaterial = retrieved_material;
            var timeToPropogate = new Date(universe.getCurrentUniverseTime());
            var loopCount = 1440;

            // draw a vertex for each minute in a 24 hour period
            // dropped this to a vertex for every 5 minutes.  This seems to be about the max that you can use for a LEO
            // and still look decent.  HEOs and GEOs look fine with much greater spans.  For performance reasons, may want
            // to make this a param that can be set per vehicle
            for(var j = 0; j < loopCount; j += 5) {
                var convertedLocation = eciTo3DCoordinates(object.propagator(timeToPropogate, false));
                if(convertedLocation != undefined) {
                    var vector = new THREE.Vector3(convertedLocation.x, convertedLocation.y, convertedLocation.z);
                    objectGeometry.vertices.push(new THREE.Vertex(vector));
                }

                timeToPropogate.setMinutes(timeToPropogate.getMinutes() + 5);
            }

            var lineS = new THREE.Line(objectGeometry, objectMaterial);

			var lineGraphicsObject = new UNIVERSE.GraphicsObject(
				object.id + "_propogation",
				object.objectName,
				undefined,
				function(elapsedTime) {
                // add points onto the end of the track?
                },
				function() {
                    universe.draw(this.id, lineS, false);
                }
			);
			universe.addObject(lineGraphicsObject);
        });
    }

	/**
		Add a Sensor Projection for an Object
		@public
		@param {UNIVERSE.SpaceObject} object - A Space Object to add a Sensor Projection for
	*/
    this.addSensorProjection = function(object) {

        var objectGeometry, objectMaterial;

        // Determine the object's location in 3D space
        var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));
        if(objectLocation != undefined) {
            // Create a SensorPattern
            var sensor_size = 1;
            objectGeometry = new SensorPatternGeometry(sensor_size);

            // TODO: this code is pretty bad;  the beam size will stay the same based on initial distance
            // from the earth.  so it's really wrong
            var initial_pos = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);
            var base_length = initial_pos.length() - earthSphereRadius;
            var cone_width_scale = 0.15;

            //17431
            
            // if the vehicle starts too close to the earth, make it a nominal length instead (i.e. a Molniya orbit)

            universe.getObjectFromLibraryById("default_sensor_projection_material", function(retrieved_material) {
                objectMaterial = retrieved_material;

                var sensorProjection = new THREE.Mesh(objectGeometry, objectMaterial);

                sensorProjection.doubleSided=true;

				var sensorProjectionGraphicsObject = new UNIVERSE.GraphicsObject(
					object.id + "_sensorProjection",
                    object.objectName,
					undefined,
                    function(elapsedTime) {

                        var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));

                        if(objectLocation != undefined) {
                            var vector = new THREE.Vector3(objectLocation.x, objectLocation.y, objectLocation.z);

                            // Move the tip of the sensor projection to the vehicle's location
                            sensorProjection.position.copy(vector);

                            // the sensor projections are along the z axis and a length of 1, so scaling it
                            // arbitarily along z will extend the length
                            sensorProjection.scale.z = vector.length() - earthSphereRadius + 200;
                            
                            // sensor_size is the projection dimension at the earth's surface (or at least the end of the cone)
                            // the projection length of the vector is 1
                            //sensorProjection.scale.x = sensorProjection.scale.y = sensorProjection.scale.z * (1 / base_length) ;
                            sensorProjection.scale.x = sensorProjection.scale.y = sensorProjection.scale.z * cone_width_scale ;

                            var sensor_boresite = new THREE.Vector3(0,0,0);
                            sensorProjection.lookAt(sensor_boresite);


                        }
                    },
					function() {
                        universe.draw(this.id, sensorProjection, false);
                    }
				);
				universe.addObject(sensorProjectionGraphicsObject);
            });
        }
    }
    
	/**
		Add a Tracing Line to the closest ground object for an Object
		@public
		@param {UNIVERSE.SpaceObject} object - A Space Object to add a tracing line to the closest ground object for
	*/
    this.addClosestGroundObjectTracingLine = function(object) {
		var closestObject_id = undefined;
		var closestGroundObjectLineController = new UNIVERSE.GraphicsObject(
			object.id + "_controlLine",
			object.objectName,
			undefined,
			function(elapsedTime) {
				var objectLocation = eciTo3DCoordinates(object.propagator(undefined, false));

		        var closestGroundObject = earthExtensions.findClosestGroundObject(objectLocation);

				if(closestGroundObject != undefined && closestGroundObject.id != closestObject_id) {
					earthExtensions.removeLineBetweenObjects(object.id, closestObject_id);
					closestObject_id = closestGroundObject.id;
					earthExtensions.addLineBetweenObjects(object.id, closestObject_id);
				}
			},
			function() {
				
			}
		)
        universe.addObject(closestGroundObjectLineController);
    }

	/**
		Add a Line between two graphics objects
		@public
		@param {string} object1_id - starting object of the line
		@param {string} object2_id - end object of the line
	*/
    this.addLineBetweenObjects = function(object1_id, object2_id, color) {
        var objectGeometry, objectMaterial;
        
        universe.getObjectFromLibraryById("default_ground_object_tracing_line_material", function(retrieved_material) {
            if(color) {
				objectMaterial = new THREE.LineBasicMaterial({
	                color : color,
	                opacity : 1
	            });
			}
			else {
				objectMaterial = retrieved_material;
			}

            var line = undefined;
			var lineGraphicsObject = new UNIVERSE.GraphicsObject(
				object1_id + "_to_" + object2_id,
				undefined,
				undefined,
				function(elapsedTime) {
					var object1 = universe.getGraphicsObjectById(object1_id);
					var object2 = universe.getGraphicsObjectById(object2_id);
					if(object1 == undefined || object2 == undefined) {
						return;
					}
                    var object1Location = object1.currentLocation;
					var object2Location = object2.currentLocation;
					
					if(object1Location == undefined || object2Location == undefined) {
						return;
					}
                    
					objectGeometry = new THREE.Geometry();
                    var vector1 = new THREE.Vector3(object1Location.x, object1Location.y, object1Location.z);
                    objectGeometry.vertices.push(new THREE.Vertex(vector1));
                        
                    var vector2 = new THREE.Vector3(object2Location.x, object2Location.y, object2Location.z);
                    objectGeometry.vertices.push(new THREE.Vertex(vector2));
                    
					line = new THREE.Line(objectGeometry, objectMaterial);
                },
				function() {
                    universe.unDraw(this.id);
                    if(line != undefined) {
						universe.draw(this.id, line, false)	;
						//TODO: this is not perfect.  It does not allow the vehicle to override the global setting as the other settings do
						if(enableLinkLines != undefined) {
							earthExtensions.showLineBetweenObjectsForId(enableLinkLines, object1_id);
						}
                      	else {
                        	earthExtensions.showLineBetweenObjectsForId(universe.getGraphicsObjectById(object1_id).showControlLine, object1_id);                            
						}   
                    }
                }
			);
			universe.addObject(lineGraphicsObject);
        });
    }

	/**
		Remove a Line between two graphics objects
		@public
		@param {string} object1_id - starting object of the line
		@param {string} object2_id - end object of the line
	*/
	this.removeLineBetweenObjects = function(object1_id, object2_id) {
		universe.removeObject(object1_id + "_to_" + object2_id);
	}
	
	/**
		Remove all Lines between two graphics objects
		@public
	*/
	this.removeAllLinesBetweenObjects = function() {
		var graphicsObjects = universe.getGraphicsObjects();
		for(var i in graphicsObjects) {
            if(i.indexOf("_to_") > -1) {
				universe.removeObject(i);
			}
		}
	}
    
	/**
		Return the closest Ground Object to a location
		@public
		@param {UNIVERSE.ECICoordinates} location - the location to find the closest point to
	*/
    this.findClosestGroundObject = function(location) {
		// TODO: this undefined check may be covering up a bug where not everything gets removed in the 
		// removeAllExceptEarthAndMoon method
		if(location != undefined) {
			var location_vector = new THREE.Vector3(location.x, location.y, location.z);

	        // move the vector to the surface of the earth
	        location_vector.multiplyScalar(earthSphereRadius / location_vector.length())

	        return earthExtensions.findClosestObject({x: location_vector.x, y: location_vector.y, z: location_vector.z});
		}
        return undefined;
    }
    
	/**
		Return the closest Object to a location
		@public
		@param {UNIVERSE.ECICoordinates} location - the location to find the closest point to
	*/
    this.findClosestObject = function(location) {
        var graphicsObjects = universe.getGraphicsObjects();
        
        var closestDistance = undefined;
        var closestObject = undefined;
		var location_vector = new THREE.Vector3(location.x, location.y, location.z);
        
        for(var i in graphicsObjects) {
            if(graphicsObjects[i].currentLocation != undefined) {
                var vector = new THREE.Vector3(graphicsObjects[i].currentLocation.x, graphicsObjects[i].currentLocation.y, graphicsObjects[i].currentLocation.z);
                var distance_to = vector.distanceTo(location_vector);
                if(closestDistance == undefined || distance_to < closestDistance) {
                    closestObject = graphicsObjects[i];
                    closestDistance = distance_to;
                }
            }
        }
        
        return closestObject;
    }
    
	/**
		Enable or disable all orbit lines
		@public
		@param {boolean} isEnabled
	*/
    this.showAllOrbitLines = function(isEnabled) {
        var graphicsObjects = universe.getGraphicsObjects();

        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id.indexOf("_propogation") != -1){
                universe.showObject(graphicsObjects[i].id, isEnabled);
            }
        }
    }

	/**
		Enable or disable orbit lines for a specific object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
    this.showOrbitLineForObject = function(isEnabled, id) {
        universe.showObject(id + "_propogation", isEnabled);
    }

	/**
		Enable or disable display of an object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
    this.showModelForId = function(isEnabled, id) {
        universe.showObject(id, isEnabled);
    }
    
	/**
		Enable or disable display of all ground tracks
		@public
		@param {boolean} isEnabled
	*/
    this.showAllGroundTracks = function(isEnabled) {
        var graphicsObjects = universe.getGraphicsObjects();

        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id.indexOf("_groundPoint") != -1){
                universe.showObject(graphicsObjects[i].id, isEnabled);
            }
        }
    }

	/**
		Enable or disable display of a ground track for an object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
    this.showGroundTrackForId = function(isEnabled, id) {
        universe.showObject(id + "_groundPoint", isEnabled);
    }
    
	/**
		Enable or disable display of all sensor projections
		@public
		@param {boolean} isEnabled
	*/
    this.showAllSensorProjections = function(isEnabled) {
        var graphicsObjects = universe.getGraphicsObjects();

        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id.indexOf("_sensorProjection") != -1){
                universe.showObject(graphicsObjects[i].id, isEnabled);
            }
        }
    }

	/**
		Enable or disable display of sensor projections for an object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
    this.showSensorProjectionForId = function(isEnabled, id) {
        //console.log("show/hiding sensorProjection");
        universe.showObject(id + "_sensorProjection", isEnabled);
    }
    
	/**
		Enable or disable display of all lines between objects
		@public
		@param {boolean} isEnabled
	*/
    this.showAllLinesBetweenObjects = function(isEnabled) {
        enableLinkLines = isEnabled;
        var graphicsObjects = universe.getGraphicsObjects();

        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id.indexOf("_to_") != -1){
                universe.showObject(graphicsObjects[i].id, isEnabled);
            }
        }
    }
    
	/**
		Enable or disable display of lines for an object
		@public
		@param {string} id - identifier for the object
		@param {boolean} isEnabled
	*/
    this.showLineBetweenObjectsForId = function(isEnabled, id) {
		var graphicsObjects = universe.getGraphicsObjects();

        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id.indexOf(id + "_to_") != -1 || graphicsObjects[i].id.indexOf("_to_" + id) != -1 ){
                universe.showObject(graphicsObjects[i].id, isEnabled);
            }
        }
    }

	/**
		Turn on or off sun lighting
		@public
		@param {boolean} isSunLighting
	*/
	this.useSunLighting = function(isSunLighting) {
		useSunLighting = isSunLighting;
		universe.showObject("earth", !isSunLighting);
		universe.showObject("earth_day", isSunLighting);
		universe.showObject("earth_night", isSunLighting);
	}

	/**
		Remove all objects from the Universe except the Earth and Moon
		@public
	*/
    this.removeAllExceptEarthAndMoon = function() {
        var graphicsObjects = universe.getGraphicsObjects();
        
        for(var i in graphicsObjects) {
            if(graphicsObjects[i].id != "earth" && graphicsObjects[i].id != "moon" && graphicsObjects[i].id != "sun") {
                universe.removeObject(graphicsObjects[i].id);
            }
        }
    }

	/**
		Set up the Universe with the Earth Extensions
		@public
	*/
	this.setup = function() {
		this.removeAllExceptEarthAndMoon();
		universe.setup();
	}

	/**
		Converts ECI to THREE.js 3D coordinate system. Compare these two websites for details on why we have to do this:
    	http://celestrak.com/columns/v02n01/
    	http://stackoverflow.com/questions/7935209/three-js-3d-coordinates-system
		@private
	*/
    function eciTo3DCoordinates(location) {
        if(location == undefined) {
            return undefined;
        }
        return {
            x : -location.x,
            y : location.z,
            z : location.y
        };
    }
}
