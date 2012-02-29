/* 
 * Unit tests for the EarthExtensions/utils coordinate objects
 */

module("EarthExtensions/utils Coordinate Conversion Tests");

test("Instantiate RSW Coordates", 4, function(){
  
    var radial = 5;
    var alongTrack = 10;
    var crossTrack = 20;
    
    var rsw = new UNIVERSE.RSWCoordinates(radial, alongTrack, crossTrack);  
    
    ok( !!rsw, "RSWCoordinates object present");
    var requiredAccuracy=0.1;//km
    QUnit.close(rsw.radial, radial,requiredAccuracy,"Radial passed");
    QUnit.close(rsw.crossTrack, crossTrack,requiredAccuracy,"Along-Track passed");
    QUnit.close(rsw.alongTrack , alongTrack,requiredAccuracy,"Cross-Track passed");

});

test("testconvertTimeToGMST", 2, function(){
  
    var newEpoch=new Date();
    newEpoch.setYear(1995-1900);
    newEpoch.setUTCMonth(9);
    newEpoch.setUTCDate(1);
    newEpoch.setUTCHours(9);
    newEpoch.setUTCMinutes(0);
    newEpoch.setUTCSeconds(0);
    var expResult = 144.627;
    var result = CoordinateConversionTools.convertTimeToGMST(newEpoch);
    ok( !!result, "angle returned");
    QUnit.close(result, expResult,0.01,"GMST Angle passed");
});

test("testconvertCurrentEpochToBarycentricTime", 2, function(){
  
    var newEpoch=new Date();
    newEpoch.setYear(1990-1900);
    newEpoch.setUTCMonth(4);
    newEpoch.setUTCDate(14);
    newEpoch.setUTCHours(16);
    newEpoch.setUTCMinutes(43);
    newEpoch.setUTCSeconds(0);
    var expResult = -0.0963395704409;
    var result = CoordinateConversionTools.convertCurrentEpochToBarycentricTime(newEpoch);
    ok( !!result, "date returned");
    QUnit.close(result, expResult,0.0000001,"Barycentric Time passed");
});

test("testconvertCurrentEpochToJulianDate", 2, function(){
  
    var newEpoch=new Date();
    newEpoch.setYear(1996-1900);
    newEpoch.setUTCMonth(9);
    newEpoch.setUTCDate(26);
    newEpoch.setUTCHours(14);
    newEpoch.setUTCMinutes(20);
    newEpoch.setUTCSeconds(0);
    var expResult = 2450383.09722222;
    var result = CoordinateConversionTools.convertCurrentEpochToJulianDate(newEpoch);
    ok( !!result, "date returned");
    QUnit.close(result, expResult,0.001,"Julian Date passed");
});

test("testconvertLLAtoECEF", 8, function(){
  
    //test one, positive longitude
    var lla = new UNIVERSE.LLACoordinates(-7.9066357,345.5975,0.056);//km
    var ecef = new UNIVERSE.ECEFCoordinates(6119.40026932,-1571.47955545,-871.56118090,0.0,0.0,0.0,0.0,0.0,0.0);
    var result  = CoordinateConversionTools.convertLLAtoECEF(lla);
    var requiredAccuracy=0.1;//km

    ok( !!result, "value returned");
    QUnit.close(result.getX(), ecef.getX(),requiredAccuracy,"X passed");
    QUnit.close(result.getY(), ecef.getY(),requiredAccuracy,"Y passed");
    QUnit.close(result.getZ(), ecef.getZ(),requiredAccuracy,"Z passed");
    
    //test two, negative longitude
    lla = new UNIVERSE.LLACoordinates(-7.9066357,-(360-345.5975),0.056);//km
    ecef = new UNIVERSE.ECEFCoordinates(6119.40026932,-1571.47955545,-871.56118090,0.0,0.0,0.0,0.0,0.0,0.0);
    var result = CoordinateConversionTools.convertLLAtoECEF(lla);

    ok( !!result, "value returned");
    
    requiredAccuracy=0.001;//km
    QUnit.close(result.getX(), ecef.getX(),requiredAccuracy,"X passed");
    QUnit.close(result.getY(), ecef.getY(),requiredAccuracy,"Y passed");
    QUnit.close(result.getZ(), ecef.getZ(),requiredAccuracy,"Z passed");
    
    
});

test("testconvertECEFtoLLA", 4, function(){
  
    var lla = new UNIVERSE.LLACoordinates(-7.9066357,-(360-345.5975),0.056);//km
    var ecef = new UNIVERSE.ECEFCoordinates(6119.40026932,-1571.47955545,-871.56118090,0.0,0.0,0.0,0.0,0.0,0.0);
    var result = CoordinateConversionTools.convertECEFtoLLA(ecef);

    ok( !!result, "value returned");
    
    var requiredAccuracy=0.001;//deg or km
    QUnit.close(result.getLatitude(), lla.getLatitude(),requiredAccuracy,"Latitude passed");
    QUnit.close(result.getLongitude(), lla.getLongitude(),requiredAccuracy,"Longitude passed");
    QUnit.close(result.getAltitude(), lla.getAltitude(),requiredAccuracy,"Altitude passed");
    
    
});

test("testconvertECItoECEF", 10, function(){
  
    var eci = new UNIVERSE.ECICoordinates(6852.42,14785.35,16879.21,1.2341,7.0086,-0.5671,-0.0012,1.021,0.009);
    var ecef = new UNIVERSE.ECEFCoordinates(4743.8802587296805,-15590.31220244594,16879.21,3.750412027803166,-6.0479654754065315,-0.5671,0.6812915101253985,-0.7604500760937918,0.0090);
    var GMST=138.21;//deg
    var result = CoordinateConversionTools.convertECItoECEF(eci,GMST);

    ok( !!result, "value returned");
    
    QUnit.close(result.getX(), ecef.getX(),0.01,"X passed");
    QUnit.close(result.getY(), ecef.getY(),0.01,"Y passed");
    QUnit.close(result.getZ(), ecef.getZ(),0.01,"Z passed");
    QUnit.close(result.getVX(), ecef.getVX(),0.0001,"Vx passed");
    QUnit.close(result.getVY(), ecef.getVY(),0.0001,"Vy passed");
    QUnit.close(result.getVZ(), ecef.getVZ(),0.0001,"Vz passed");
    QUnit.close(result.getAX(), ecef.getAX(),0.000001,"Ax passed");
    QUnit.close(result.getAY(), ecef.getAY(),0.000001,"Ay passed");
    QUnit.close(result.getAZ(), ecef.getAZ(),0.000001,"Az passed");
});

test("testconvertECEFtoECI", 10, function(){
  
    var eci = new UNIVERSE.ECICoordinates(6852.42,14785.35,16879.21,1.2341,7.0086,-0.5671,-0.0012,1.021,0.009);
    var ecef = new UNIVERSE.ECEFCoordinates(4743.8802587296805,-15590.31220244594,16879.21,3.750412027803166,-6.0479654754065315,-0.5671,0.6812915101253985,-0.7604500760937918,0.0090);
    var GMST=138.21;//deg
    var result = CoordinateConversionTools.convertECEFtoECI(ecef,GMST);

    ok( !!result, "value returned");
      
    QUnit.close(result.getX(), eci.getX(),0.01,"X passed");
    QUnit.close(result.getY(), eci.getY(),0.01,"Y passed");
    QUnit.close(result.getZ(), eci.getZ(),0.01,"Z passed");
    QUnit.close(result.getVX(), eci.getVX(),0.0001,"Vx passed");
    QUnit.close(result.getVY(), eci.getVY(),0.0001,"Vy passed");
    QUnit.close(result.getVZ(), eci.getVZ(),0.0001,"Vz passed");
    QUnit.close(result.getAX(), eci.getAX(),0.000001,"Ax passed");
    QUnit.close(result.getAY(), eci.getAY(),0.000001,"Ay passed");
    QUnit.close(result.getAZ(), eci.getAZ(),0.000001,"Az passed");
});

test("testconvertECItoLLA", 4, function(){
  
    var eci = new UNIVERSE.ECICoordinates(6524.834,6862.875,6448.296,0.0,0.0,0.0,0.0,0.0,0.0);
    var lla = new UNIVERSE.LLACoordinates(34.352496,72.5529,5085.22);//deg,deg,km
    var GST=333.893486;//deg

    var result = CoordinateConversionTools.convertECItoLLA(eci,GST);

    
    ok( !!result, "value returned");
    
    var requiredAccuracy=0.001;//deg or km

    QUnit.close(result.getLatitude(), lla.getLatitude(),requiredAccuracy,"Latitude passed");
    QUnit.close(result.getLongitude(), lla.getLongitude(),requiredAccuracy,"Longitude passed");
    QUnit.close(result.getAltitude(), lla.getAltitude(),requiredAccuracy,"Altitude passed");
    
});

test("testconvertKeplerianToECI", 7, function(){
  
    var eci = new UNIVERSE.ECICoordinates(6524.834,6862.875,6448.296,4.901327,5.533756,-1.976341,0.0,0.0,0.0);
    var kepler = new KeplerianCoordinates();
    kepler.setEccentricity(0.832853);
    kepler.setSemimajorAxis(36127.343);
    kepler.setInclination(87.870);
    kepler.setRaan(227.89);
    kepler.setArgOfPerigee(53.38);
    kepler.setTrueAnomaly(92.335);

    var result = CoordinateConversionTools.convertKeplerianToECI(kepler);

    
    ok( !!result, "value returned");
    
    var requiredPositionAccuracy=2.0;//km
    var requiredVelocityAccuracy=0.01;//km/s
    QUnit.close(result.getX(), eci.getX(),requiredPositionAccuracy,"X passed");
    QUnit.close(result.getY(), eci.getY(),requiredPositionAccuracy,"Y passed");
    QUnit.close(result.getZ(), eci.getZ(),requiredPositionAccuracy,"Z passed");
    QUnit.close(result.getVX(), eci.getVX(),requiredVelocityAccuracy,"Vx passed");
    QUnit.close(result.getVY(), eci.getVY(),requiredVelocityAccuracy,"Vy passed");
    QUnit.close(result.getVZ(), eci.getVZ(),requiredVelocityAccuracy,"Vz passed");
    
});


test("testconvertLLAtoECI", 4, function(){
  
    var eci = new UNIVERSE.ECICoordinates(6524.834,6862.875,6448.296,0.0,0.0,0.0,0.0,0.0,0.0);
    var lla = new UNIVERSE.LLACoordinates(34.352496,72.5529,5085.22);//deg,deg,km
    var GST=333.893486;//deg
    var result = CoordinateConversionTools.convertLLAtoECI(lla,GST);

    ok( !!result, "value returned");
    
    var requiredAccuracy=0.01;//km
    QUnit.close(result.getX(), eci.getX(),requiredAccuracy,"X passed");
    QUnit.close(result.getY(), eci.getY(),requiredAccuracy,"Y passed");
    QUnit.close(result.getZ(), eci.getZ(),requiredAccuracy,"Z passed");
    
    
});

test("testconvertECIToKeplerian", 7, function(){
  
    var eci = new UNIVERSE.ECICoordinates(6524.834,6862.875,6448.296,4.901327,5.533756,-1.976341,0.0,0.0,0.0);
    var kepler = new KeplerianCoordinates();
    kepler.setEccentricity(0.832853);
    kepler.setSemimajorAxis(36127.343);
    kepler.setInclination(87.870);
    kepler.setRaan(227.89);
    kepler.setArgOfPerigee(53.38);
    kepler.setTrueAnomaly(92.335);

    var result = CoordinateConversionTools.convertECIToKeplerian(eci);

    
    ok( !!result, "value returned");
    

    var requiredAngularAccuracy=0.01;//deg
    var requiredDistanceAccuracy=2.0;//km
    QUnit.close(kepler.getArgOfPerigee(), result.getArgOfPerigee(), requiredAngularAccuracy,"eccentricity passed");
    QUnit.close(kepler.getInclination(), result.getInclination(), requiredAngularAccuracy,"inclination passed");
    QUnit.close(kepler.getTrueAnomaly(), result.getTrueAnomaly(), requiredAngularAccuracy,"true anomaly passed");
    QUnit.close(kepler.getRaan(), result.getRaan(), requiredAngularAccuracy,"RAAN passed");
    QUnit.close(kepler.getEccentricity(), result.getEccentricity(), requiredAngularAccuracy,"eccentricity passed");
    QUnit.close(kepler.getSemimajorAxis(), result.getSemimajorAxis(), requiredDistanceAccuracy,"semi-major passed");
    
});

test("testgetSunPositionECIAtCurrentTime", 4, function(){
  
    var newEpoch=new Date();
    newEpoch.setYear(1994-1900);
    newEpoch.setUTCMonth(3);
    newEpoch.setUTCDate(2);
    newEpoch.setUTCHours(0);
    newEpoch.setUTCMinutes(0);
    newEpoch.setUTCSeconds(0);

    var eci = new UNIVERSE.ECICoordinates(146241097.0,28574940.0,12389196.0,0.0,0.0,0.0,0.0,0.0,0.0);

    var result = CoordinateConversionTools.getSunPositionECIAtCurrentTime(newEpoch);
    ok( !!result, "value returned");
    var requiredDistanceAccuracy=50.0;//km
    QUnit.close(result.getX(), eci.getX(),requiredDistanceAccuracy,"X passed");
    QUnit.close(result.getY(), eci.getY(),requiredDistanceAccuracy,"Y passed");
    QUnit.close(result.getZ(), eci.getZ(),requiredDistanceAccuracy,"Z passed");
});

test("testgetMoonPositionECIAtCurrentTime", 4, function(){
        
    var newEpoch=new Date();
    newEpoch.setYear(1994-1900);
    newEpoch.setUTCMonth(3);
    newEpoch.setUTCDate(28);
    newEpoch.setUTCHours(0);
    newEpoch.setUTCMinutes(0);
    newEpoch.setUTCSeconds(0);

    var eci = new UNIVERSE.ECICoordinates(-134241.192,-311571.349,-126693.681,0.0,0.0,0.0,0.0,0.0,0.0);

    var result = CoordinateConversionTools.getMoonPositionECIAtCurrentTime(newEpoch);
    ok( !!result, "value returned");
    var requiredDistanceAccuracy=100.0;//km
    QUnit.close(result.getX(), eci.getX(),requiredDistanceAccuracy,"X passed");
    QUnit.close(result.getY(), eci.getY(),requiredDistanceAccuracy,"Y passed");
    QUnit.close(result.getZ(), eci.getZ(),requiredDistanceAccuracy,"Z passed");
});