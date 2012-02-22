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
    
    equal(rsw.radial ,radial, "radial matches");
    equal(rsw.crossTrack ,crossTrack, "crossTrack matches");
    equal(rsw.alongTrack ,alongTrack, "alongTrack matches");
});