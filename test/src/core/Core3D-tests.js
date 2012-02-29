/* 
 * Unit tests for the core/UniverseController.js file
 */

module("core/Core3D.js Tests");

var id = "TestId";
var modelName = "ModelName";
var currentLocation = {x: 0, y: 0, z: 0};
var updateFunction = function(elapsedTime) {};
var drawFunction = function() {};
var graphicsObject = new UNIVERSE.GraphicsObject(id, modelName, currentLocation, updateFunction, drawFunction);

var container = document.createElement("div");

var core = new UNIVERSE.Core3D(container);

var shape = new THREE.Mesh(new THREE.SphereGeometry(200, 20, 10), 
    new THREE.MeshLambertMaterial({color : 0xCC0000}));

test("Instantiate Core3D", function(){
  ok( !!core, "Core object present");
})

test("Draw object", function() {
    core.draw("testId", shape, false);
    
    var position = core.getObjectPosition("testId");
    ok( !!position, "Core object present");
    
    core.removeObject("testId");
    position = core.getObjectPosition("testId");
    ok( !position, "Core object removed");
})

test("Draw with undefineds", function() {
    core.draw("testId2", undefined, false);
    
    var position = core.getObjectPosition("testId2");
    ok(!position, "Undefined shape");
    
    core.draw(undefined, shape, false);
    // no real way to assert something without an id didn't get added...'
    
    // get position for an id that hasn't been added'
    position = core.getObjectPosition("testId3");
    ok(!position, "Undefined id");
    
    core.removeAllObjects();
})

test("Remove more than one through removeAllObjects", function() {
    for(var i = 0; i < 10; i++) {
        core.draw("testId"+i, shape, false);
    }
    
    for(var i = 0; i < 10; i++) {
        var position = core.getObjectPosition("testId"+i);
        ok( !!position, "testId" + i + " object present");
    }
    
    core.removeAllObjects();
    
    for(var i = 0; i < 10; i++) {
        var position = core.getObjectPosition("testId"+i);
        ok( !position, "testId" + i + " object removed");
    }
    
})

test("Show/Hide objects", function() {
    core.draw("testId", shape, false);
    
    core.showObject("testId", true);
    
    core.showObject("testId", true);
    
    core.showObject("testId", false);
})

asyncTest("Move camera to position", function() {
    var positionVector = new THREE.Vector3(10000, 20000, 30000);
    console.log("Position Vector.length: " + positionVector.length());
    core.moveCameraTo(positionVector);
    
    
    
    // have to wait since it does its smooth movement thing
    setTimeout(function() {
        var cameraPosition = core.getCameraPosition();
        console.log("Camera Position: " + JSON.stringify(cameraPosition));
        QUnit.close(cameraPosition, positionVector, 0.1, "Camera moved to position");
        start();
    }, 2000);
    
})