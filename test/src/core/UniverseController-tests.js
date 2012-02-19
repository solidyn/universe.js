/* 
 * Unit tests for the core/UniverseController.js file
 */

module("core/UniverseController.js Tests");

var id = "TestId";
var modelName = "ModelName";
var currentLocation = {x: 0, y: 0, z: 0};
var updateFunction = function(elapsedTime) {};
var drawFunction = function() {};
var graphicsObject = new UNIVERSE.GraphicsObject(id, modelName, currentLocation, updateFunction, drawFunction);

test("Instantiate UniverseController",function(){
  expect(1);
  var objectLibrary = new UNIVERSE.UniverseController()
  ok( !!objectLibrary, "UniverseController object present");
})

test("Add/Remove Graphics Object",function(){
  expect(6);
  var controller = new UNIVERSE.UniverseController()
  
  controller.addGraphicsObject(graphicsObject);
 
  var retrievedObject = controller.getGraphicsObjectById(id);
  equal(retrievedObject.id ,id, "id matches");
  equal(retrievedObject.modelName ,modelName, "modelName matches")
  deepEqual(retrievedObject.currentLocation, currentLocation, "currentLocation matches")
  
  var allGraphicsObjects = controller.getGraphicsObjects();
  equal(Object.keys(allGraphicsObjects).length, 1, "Retrieve 1 Object");
  
  controller.removeGraphicsObject(id);
  allGraphicsObjects = controller.getGraphicsObjects();
  equal(Object.keys(allGraphicsObjects).length, 0, "Object Deleted");
  
  controller.addGraphicsObject(graphicsObject);
  
  controller.removeAllGraphicsObjects();
  allGraphicsObjects = controller.getGraphicsObjects();
  equal(Object.keys(allGraphicsObjects).length, 0, "Objects Deleted");
})

test("Update once", function() {
    expect(2);
    var controller = new UNIVERSE.UniverseController()
  
    graphicsObject.updateNumber = 0;
    graphicsObject.update = function() {
        this.updateNumber++;
    }
    
    controller.addGraphicsObject(graphicsObject);
    
    equal(graphicsObject.updateNumber, 0, "Update funciton not called yet");
    
    controller.updateOnce();
    
    equal(graphicsObject.updateNumber, 1, "Update funciton was called once");
})

asyncTest("Play/Pause and Update", function() {
    expect(2);
    
    var controller = new UNIVERSE.UniverseController()
  
    graphicsObject.updateNumber = 0;
    
    graphicsObject.update = function(elapsedTime) {
        this.updateNumber++;
        if(this.updateNumber == 10) {
            controller.pause();
            equal(graphicsObject.updateNumber, 10, "Update funciton called during playback");
            start();
        }
    }
    
    controller.addGraphicsObject(graphicsObject);
    
    equal(graphicsObject.updateNumber, 0, "Update funciton not called yet");
    
    controller.play();
})

asyncTest("Play/Pause and Draw", function() {
    expect(2);
    
    var controller = new UNIVERSE.UniverseController()
  
    graphicsObject.updateNumber = 0;
    
    graphicsObject.draw = function() {
        this.updateNumber++;
        if(this.updateNumber == 10) {
            controller.pause();
            equal(graphicsObject.updateNumber, 10, "Draw funciton called during playback");
            start();
        }
    }
    
    graphicsObject.update = function() {};
    
    controller.addGraphicsObject(graphicsObject);
    
    equal(graphicsObject.updateNumber, 0, "Draw funciton not called yet");
    
    controller.play();
})