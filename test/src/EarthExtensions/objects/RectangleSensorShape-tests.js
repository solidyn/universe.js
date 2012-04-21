/* 
 * Unit tests for the EarthExtentions/objects/RectangleSensorShape.js file
 */

module("EarthExtentions/objects/RectangleSensorShape.js Tests");

var shapeName = "rectangleShape";
var width = 5;
var height = 2;

var rectangleSensor = new UNIVERSE.RectangleSensorShape(shapeName, width, height);

test("Set/Get height", function(){
  var expectedHeight = 10;
  
  rectangleSensor.setHeight(expectedHeight);
  equal(rectangleSensor.getHeight() ,expectedHeight, "height matches");
})

test("Set/Get width", function(){
  var expectedWidth = 10;
  
  rectangleSensor.setWidth(expectedWidth);
  equal(rectangleSensor.getWidth() ,expectedWidth, "width matches");
})