/* 
 * Unit tests for the EarthExtentions/objects/EllipseSensorShape.js file
 */

module("EarthExtentions/objects/EllipseSensorShape.js Tests");

var shapeName = "ellipseShape";
var semiMajorAngle = 5;
var semiMinorAngle = 2;

var ellipseSensor = new UNIVERSE.EllipseSensorShape(shapeName, semiMajorAngle, semiMinorAngle);

test("Set/Get semiMajorAngle", function(){
  var expectedSMA = 10;
  
  ellipseSensor.setSemiMajorAngle(expectedSMA);
  equal(ellipseSensor.getSemiMajorAngle() ,expectedSMA, "semiMajorAngle matches");
})

test("Set/Get semiMinorAngle", function(){
  var expectedSMI = 10;
  
  ellipseSensor.setSemiMinorAngle(expectedSMI);
  equal(ellipseSensor.getSemiMinorAngle() ,expectedSMI, "semiMinorAngle matches");
})