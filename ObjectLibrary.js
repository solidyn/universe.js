var SSI = SSI || {};

SSI.ObjectLibrary = function() {
    var objects = new Array();

    // adds a mesh object to the object library
    // id -> unique id of the object
    // url -> url used to retrieve the json of the model
    // material -> material to apply to the model's geometry
    this.addMeshObjectFromUrl = function(id, url, material, callback) {
        logger.debug("Adding mesh object to library; id: [" + id + "] url: [" + 
            url + "], material: [" + material + "]");
        // if we have already loaded an onject with this id, return
        if (objects[id] != null) {
            logger.debug("Object with id [" + id + "] already exists so not adding");
            return;
        }

        // use a JSON loader to load the mesh from JSON
        var jsonLoader = new THREE.JSONLoader();
        jsonLoader.load({
            model : url,
            callback : function(geometry) {
                var mesh = new THREE.Mesh(geometry, material);
                
                // add the object to our list of objects
                objects[id] = mesh;

                // execute the callback
                callback();
            }
        });
    }

    // gets an object from the library based on the given id
    this.getObjectById = function(id) {
        logger.debug("Retrieving object with id [" + id + "] from library");
        var object = objects[id];
        if (object == null)
            throw "Tried to retrieve object [" + id + "] from object library but didn't exist";
        return object;
    }
}