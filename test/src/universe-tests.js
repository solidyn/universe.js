/* 
 * Unit tests for the Universe.js file
 */

var container = document.createElement("div");

var universe = new UNIVERSE.Universe(new Date(), 30, container);

module("Universe.js Tests");
test("Instantiate Universe", 1, function(){
    ok( !!universe, "Universe object present");
});

test("Play/Pause Universe", 0, function(){
    universe.play();
    universe.pause();
});

test("Set current universe time", 1, function() {
    var date = new Date();
    
    universe.setCurrentUniverseTime(date);
    
    console.log("Date: " + date + " currentUnviverseTime: " + universe.getCurrentUniverseTime());
    
    equal(universe.getCurrentUniverseTime().getTime(), date.getTime(), "Date set correctly");
});