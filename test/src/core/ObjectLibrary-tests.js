/* 
 * Unit tests for the core/ObjectLibrary.js file
 */

module("core/ObjectLibrary.js Tests");

test("Instantiate ObjectLibrary",function(){
  expect(1);
  var objectLibrary = new UNIVERSE.ObjectLibrary()
  ok( !!objectLibrary, "ObjectLibrary object present");
})

// Basic test to add an object to the library from JSON and retrieve it
asyncTest("Add Object to Library from JSON",function(){
  expect(1);
  var objectLibrary = new UNIVERSE.ObjectLibrary();
  // add an object
  objectLibrary.addGeometryObjectFromUrl("testId", "data/DSP.json", function() {
      
      // retrive it
      objectLibrary.getObjectById("testId", function(retrievedObject) {
          // make sure we got an object back
          ok( !!retrievedObject, "Object added from JSON and retrieved");
          start();
      });
  })
})

// Add a normal JS object to the library and retrieve it
asyncTest("Add Object to Library", function() {
  expect(2);
  var objectLibrary = new UNIVERSE.ObjectLibrary();
  var expectedName = "random object";
  var expectedSomeProperty = 50;
  
  // add some random object
  objectLibrary.setObject("testId", {name: expectedName, someProperty: expectedSomeProperty});
  
  // retrieve it
  objectLibrary.getObjectById("testId", function(retrievedObject) {
     equal(retrievedObject.name, expectedName, "Name property retrieved");
     equal(retrievedObject.someProperty, expectedSomeProperty, "Some Property retrieved");
     start();
  });
})

// Add the same object twice and make sure it can still be retrieved
asyncTest("Add JSON Object twice",function(){
  expect(1);
  var objectLibrary = new UNIVERSE.ObjectLibrary();
  // add an object
  objectLibrary.addGeometryObjectFromUrl("testId", "data/DSP.json", function() {
      
      objectLibrary.addGeometryObjectFromUrl("testId", "data/DSP.json", function() {
        // retrive it
        objectLibrary.getObjectById("testId", function(retrievedObject) {
            // make sure we got an object back
            ok( !!retrievedObject, "Object added from JSON and retrieved");
            start();
        });
      });
  })
})


asyncTest("Get Object wait while loading",function(){
  expect(1);
  var objectLibrary = new UNIVERSE.ObjectLibrary();
  // add an object
  objectLibrary.addGeometryObjectFromUrl("testId", "data/DSP.json", function() {
    
    });
    
  // retrive it, this should wait until its done loading then send it back
  objectLibrary.getObjectById("testId", function(retrievedObject) {
    // make sure we got an object back
    ok( !!retrievedObject, "Object added from JSON and retrieved");
    start();
  });
})

test("Get non-existent object",function(){
  expect(1);
  var objectLibrary = new UNIVERSE.ObjectLibrary();
  try
  {
    objectLibrary.getObjectById("testId", function(retrievedObject) {
        // shouldn't get here...'
    })
  }
  catch(err)
  {
    ok(true, "Exception thrown: " + err);
  }
  
})