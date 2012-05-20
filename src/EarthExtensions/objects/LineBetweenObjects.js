// LineBetweenObjects.js

/**
 *
 */
var UNIVERSE = UNIVERSE || {};

UNIVERSE.LineBetweenObjects = function(object1_id, object2_id, universe, earthExtensions, color, customIdentifier) {
    var objectGeometry, objectMaterial;
        
    if(!color) {
        color = 0x009900;
    }
        
    objectMaterial = new THREE.LineBasicMaterial({
        color : color,
        opacity : 1
    });
			
    var object1 = universe.getGraphicsObjectById(object1_id);
    var object2 = universe.getGraphicsObjectById(object2_id);
			
    if(object1 == undefined || object2 == undefined) {
        return undefined;
    }
			
    var object1Location = Utilities.eciTo3DCoordinates(object1.currentLocation, earthExtensions);
    var object2Location = Utilities.eciTo3DCoordinates(object2.currentLocation, earthExtensions);
			
    if(object1Location == undefined || object2Location == undefined) {
        return undefined;
    }
            
    objectGeometry = new THREE.Geometry();
    objectGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(object1Location.x, object1Location.y, object1Location.z)));
                
    objectGeometry.vertices.push(new THREE.Vertex(new THREE.Vector3(object2Location.x, object2Location.y, object2Location.z)));
            
    var line = new THREE.Line(objectGeometry, objectMaterial);

    var identifier = "_to_"
    if(customIdentifier)
    {
        identifier = customIdentifier;
    }
			
    var lineGraphicsObject = new UNIVERSE.GraphicsObject(
        object1_id + identifier + object2_id,
        undefined,
        undefined,
        function(elapsedTime) {
            
            var object1 = universe.getGraphicsObjectById(object1_id);
            var object2 = universe.getGraphicsObjectById(object2_id);
            if(object1 == undefined || object2 == undefined) {
                return;
            }
            var object1Location = Utilities.eciTo3DCoordinates(object1.currentLocation, earthExtensions);
            var object2Location = Utilities.eciTo3DCoordinates(object2.currentLocation, earthExtensions);
					
            if(!(object1Location == undefined || object2Location == undefined)) {
                objectGeometry.vertices[0].position = {
                    x: object1Location.x, 
                    y: object1Location.y, 
                    z: object1Location.z
                };

                objectGeometry.vertices[1].position = {
                    x: object2Location.x, 
                    y: object2Location.y, 
                    z: object2Location.z
                };

                objectGeometry.__dirtyVertices = true;
            }
        },
        function() {
            universe.draw(this.id, line, false)	;
        }
    );
        
    return lineGraphicsObject;
};