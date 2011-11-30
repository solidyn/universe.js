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
        var JD = 0;                               //double
        var year = currentEpoch.getYear() + 1900  //int
        var month = currentEpoch.getMonth();      //int
        var day = currentEpoch.getDate();         //int
        var hour = currentEpoch.getHours();       //int
        var minute = currentEpoch.getMinutes();   //int
        var second = currentEpoch.getSeconds();   //double

        JD = 367 * year - (7 * (year + ((month + 9) / 12)) / 4) +
            (275 * month / 9) + (day) + 1721013.5 +
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

        var ecef = new ECEFCoordinates(x, y, z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0);

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
        var lla = new LLAcoordinates();

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
        var ecef = new ECEFcoordinates();

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

        ecef.setVx(xyz[0]);
        ecef.setVy(xyz[1]);
        ecef.setVz(xyz[2]);

        //convert the acceleration
        var eciAcc = new Array(); //Double[3];
        eciAcc[0] = eci.getAx();
        eciAcc[1] = eci.getAy();
        eciAcc[2] = eci.getAz();

        xyz = MathTools.rot3(GST, eciAcc);

        ecef.setAx(xyz[0]);
        ecef.setAy(xyz[1]);
        ecef.setAz(xyz[2]);

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
        var eci = new ECICoordinates();

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
        var ecef = convertECItoECEF(eci, GST); //ECEFCoordinates
        return convertECEFtoLLA(ecef);
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
        var eci = new ECIcoordinates();
        var a = kepler.getSemimajorAxis(); //double
        var e = kepler.getEccentricity();  //double
        var p = a * (1 - e * e);           //double
        var nu = kepler.getTrueAnomaly();  //double

        //reference vallado page 125
        var cosNu = Math.cos(Math.toRadians(nu)); //double
        var sinNu = Math.sin(Math.toRadians(nu)); //double

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
        eci.setVx(eciValues[0]);
        eci.setVy(eciValues[1]);
        eci.setVz(eciValues[2]);

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
        //reference Vallado 120
        var kepler = new KeplerianCoordinates();
        var r = new Array(); //Double[3];
        r[0] = eci.getX();
        r[1] = eci.getY();
        r[2] = eci.getZ();
        
        var v = new Array(); //Double[3];
        v[0] = eci.getVX();
        v[1] = eci.getVY();
        v[2] = eci.getVZ();

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

        var nu = MathTools.toDegrees(Math.acos(MathTools.dotMultiply(e, r) / (emag * rmag))); //double
        
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
        var satelliteKepler = satellite.getKepler(); //KeplerianCoords

        var nu = satelliteKepler.getTrueAnomaly();  //double
        var w = satelliteKepler.getArgOfPerigee();  //double
        var inc = satelliteKepler.getInclination(); //double
        var raan = satelliteKepler.getRaan();       //double

        var netRotationMatrix = new Array(3);

        var i = 0;
        for(int i = 0; i < 3; i++) //create as Double[3][3];
        {
            netRotationMatrix[i] = new Array(3);
        }

        netRotationMatrix = MathTools.buildRotationMatrix3(raan);
        netRotationMatrix = MathTools.multiply(MathTools.buildRotationMatrix1(inc), netRotationMatrix);
        netRotationMatrix = MathTools.multiply(MathTools.buildRotationMatrix3(w), netRotationMatrix);
        netRotationMatrix = MathTools.multiply(MathTools.buildRotationMatrix3(nu), netRotationMatrix);

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
        var satelliteKepler = satellite.getKepler(); //KeplerianCoordinates
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
        var eci = new ECIcoordinates();
        var satelliteKepler = satellite.getKepler();

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
        var JD = convertCurrentEpochToJulianDate(currentEpoch);

        //julian centuries since January 1, 2000 12h UT1
        var TUT = (JD - 2451545.0) / 36525.0;
        var lambdaSun = 280.4606184 + 36000.77005361 * TUT;  //solar angle (deg)
        var Msun = 357.5277233 + 35999.05034 * TUT;
        var lambdaEcliptic = lambdaSun + 1.914666471 *
            Math.sin(Math.toRadians(Msun)) + 0.019994643 *
            Math.sin(2 * Math.toRadians(Msun));//ecliptic angle (deg)

        //distance of the sun in AU
        var rsun = 1.000140612 - 0.016708617 * Math.cos(Math.toRadians(Msun)) -
            0.000139589 * Math.cos(2 * Math.toRadians(Msun));
        var e = 23.439291 - 0.0130042 * TUT;  //ecliptic latitude on the earth

        var AU = 149597870.0;  //one astronomical unit (km)
        var sunPosition = new ECIcoordinates();

        sunPosition.setX(rsun * Math.cos(Math.toRadians(lambdaEcliptic)) * AU);
        sunPosition.setY(rsun * Math.cos(Math.toRadians(e)) *
            Math.sin(Math.toRadians(lambdaEcliptic)) * AU);
        sunPosition.setZ(rsun * Math.sin(Math.toRadians(e)) *
            Math.sin(Math.toRadians(lambdaEcliptic)) * AU);

        return sunPosition;
    }
};
