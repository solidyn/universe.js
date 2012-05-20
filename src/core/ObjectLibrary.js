
var UNIVERSE = UNIVERSE || {};

UNIVERSE.ObjectLibrary = function() {
    var objects = [];
    var numberOfElements = 0;

    // adds a mesh object to the object library
    // id -> unique id of the object
    // url -> url used to retrieve the json of the model
    // material -> material to apply to the model's geometry
    this.addGeometryObjectFromUrl = function(id, url, callback) {
        // if we have already loaded an onject with this id, return
        if (objects[id]) {
            callback();
            return;
        }
        
        // Have to do this to avoid a race condition and avoid requesting it every time
        objects[id] = "loading";

        // use a JSON loader to load the mesh from JSON
        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.load({
            model : url,
            callback : function(geometry) {
                //var mesh = new THREE.Mesh(geometry, material);
                
                // add the object to our list of objects
                objects[id] = geometry;
                //numberOfElements++;
                //console.log("objects after add: " + JSON.stringify(objects));
                //console.log("numberOfElements after add: " + JSON.stringify(numberOfElements))

                // execute the callback
                callback();
            }
        });
        
    };

    // gets an object from the library based on the given id
    this.getObjectById = function(id, callback) {
        //console.log("number of elements: " + numberOfElements);
        var object = objects[id];
        
        if (!object) {
            throw "Tried to retrieve object [" + id + "] from object library but didn't exist";
        }
        else if(object == "loading") {
            var objectLib = this;
            setTimeout(function() {
                objectLib.getObjectById(id, callback);
            }, 1000);
        }
        else {
            callback(object);
        }
    };
    
    this.setObject = function(id, object) {
        objects[id] = object;
    };
};
