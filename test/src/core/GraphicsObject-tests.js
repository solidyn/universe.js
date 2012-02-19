/* 
 * Unit tests for the core/ObjectLibrary.js file
 */

module("core/GraphicsObject.js Tests");

test("Instantiate GraphicsObject", 6, function(){
  
    var id = "TestId";
    var modelName = "ModelName";
    var currentLocation = {
        x: 0, 
        y: 0, 
        z: 0
    };
    var updateFunction = function(elapsedTime) {
        var a = "dummy";
    };
    var drawFunction = function() {
        var b = "smarty";
    };
    
    var graphicsObject = new UNIVERSE.GraphicsObject(id, modelName, currentLocation, updateFunction, drawFunction);  
    
    ok( !!graphicsObject, "GraphicsObject object present");
    
    equal(graphicsObject.id ,id, "id matches");
    equal(graphicsObject.modelName ,modelName, "modelName matches");
    deepEqual(graphicsObject.currentLocation, currentLocation, "currentLocation matches");
    equal(graphicsObject.update ,updateFunction, "updateFunction matches");
    equal(graphicsObject.draw ,drawFunction, "drawFunction matches");
});