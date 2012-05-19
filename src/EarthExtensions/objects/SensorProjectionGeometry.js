/**
 * Based HEAVILY on the CylinderGeometry.js file from Three.js (mr.doob mrdoob.com)
 * @author Brian Davis
 */



var UNIVERSE = UNIVERSE || {};



/**
 * Use this to project a pattern from a single point to a destination set of points
*  var cone = new THREE.Mesh( new Cone(), new THREE.MeshBasicMaterial( { color:Math.random() * 0xff0000 } ) );
   cone.phase = Math.floor( Math.random() * 62.83 );
   cone.position.set( 20,20,20);
   cone.doubleSided = true;
   cone.scale.x = cone.scale.y = cone.scale.z = 10;
   scene.add( cone );

 */

//var sensor_rotation_matrix = new THREE.Matrix4().setRotationFromEuler( new THREE.Vector3( -1 * Math.PI/2 , 0, 0 ) );

// // call with a set of points on the earth and a sensor origin
// points is an array with .x, .y. z and the vehicle origin is also an object with just an .x, .y and .z
// Assume that passed in points are all in THREE.js
UNIVERSE.SensorProjectionGeometry = function ( sensorOrigin, groundPoints ) {

    THREE.Geometry.call( this );

    var segmentsY = 1;
    var x, y, vertices = [], uvs = [];

    // tack on the initial ground point back to the end of the groundpoints array
    groundPoints.push(groundPoints[0]);
    var segmentsX = groundPoints.length - 1;

    var xpos, ypos, zpos, u;

    // Create the top points around the vehicle
    var v = 0;

    var verticesRow = [];
    var uvsRow = [];
    for ( x = 0; x <= segmentsX; x ++ ) {
        u = x / segmentsX;

        xpos = sensorOrigin.x;
        ypos = sensorOrigin.y;
        zpos = sensorOrigin.z;

        //console.log("Vertice point: " + xpos + "," + ypos + "," + zpos);
        this.vertices.push( new THREE.Vertex( new THREE.Vector3( xpos, ypos, zpos ) ) );
        verticesRow.push( this.vertices.length - 1 );
        uvsRow.push( new THREE.UV( u, v ) );
    }

    vertices.push( verticesRow );
    uvs.push( uvsRow );

    // Now create the ground lines
    v = 1;
    verticesRow = [];
    uvsRow = [];
    for ( x = 0; x <= segmentsX; x ++ ) {
        u = x / segmentsX;

        xpos = groundPoints[x].x;
        ypos = groundPoints[x].y;
        zpos = groundPoints[x].z;

        //		console.log("Vertice point: " + xpos + "," + ypos + "," + zpos);
        this.vertices.push( new THREE.Vertex( new THREE.Vector3( xpos, ypos, zpos ) ) );
        verticesRow.push( this.vertices.length - 1 );
        uvsRow.push( new THREE.UV( u, v ) );

    }
    vertices.push( verticesRow );
    uvs.push( uvsRow );

    for ( y = 0; y < segmentsY; y ++ ) {

        for ( x = 0; x < segmentsX; x ++ ) {

            var v1 = vertices[ y ][ x ];
            var v2 = vertices[ y + 1 ][ x ];
            var v3 = vertices[ y + 1 ][ x + 1 ];
            var v4 = vertices[ y ][ x + 1 ];

            // FIXME: These normals aren't right for cones.

            var n1 = this.vertices[ v1 ].position.clone().setY( 0 ).normalize();
            var n2 = this.vertices[ v2 ].position.clone().setY( 0 ).normalize();
            var n3 = this.vertices[ v3 ].position.clone().setY( 0 ).normalize();
            var n4 = this.vertices[ v4 ].position.clone().setY( 0 ).normalize();

            var uv1 = uvs[ y ][ x ].clone();
            var uv2 = uvs[ y + 1 ][ x ].clone();
            var uv3 = uvs[ y + 1 ][ x + 1 ].clone();
            var uv4 = uvs[ y ][ x + 1 ].clone();

            this.faces.push( new THREE.Face4( v1, v2, v3, v4, [ n1, n2, n3, n4 ] ) );
            this.faceVertexUvs[ 0 ].push( [ uv1, uv2, uv3, uv4 ] );

        }

    }

    this.computeCentroids();
    this.computeFaceNormals();
    this.dynamic = true;
}
UNIVERSE.SensorProjectionGeometry.prototype = new THREE.Geometry();
UNIVERSE.SensorProjectionGeometry.prototype.constructor = UNIVERSE.SensorProjectionGeometry;


UNIVERSE.SensorProjectionGeometry.prototype.recalculateVertices = function (sensorOrigin, groundPoints)
{

    groundPoints.push(groundPoints[0]);

    this.dynamic = true;
    // Create the top points around the vehicle
    var segmentsX = groundPoints.length;
    var segmentsY = 1;
    // tack on the initial ground point back to the end of the groundpoints array
	
    var xpos, ypos, zpos, u;
    for ( x = 0; x < segmentsX; x ++ ) {
		
        u = x / segmentsX;

        xpos = sensorOrigin.x;
        ypos = sensorOrigin.y;
        zpos = sensorOrigin.z;

        this.vertices[x].position = {
            x: xpos, 
            y:ypos, 
            z:zpos
        }; 
    }

    // Now create the ground lines
    for ( x = 0; x < segmentsX; x ++ ) {
        u = x / segmentsX;

        xpos = groundPoints[x].x;
        ypos = groundPoints[x].y;
        zpos = groundPoints[x].z;

        //				console.log("updating vertice point " + ( x + segmentsX )+ " to Vertice point: " + xpos + "," + ypos + "," + zpos);
        this.vertices[x + segmentsX].position = {
            x: xpos, 
            y:ypos, 
            z:zpos
        }; 
    }

		  
    this.__dirtyVertices=true;
};