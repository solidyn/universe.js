/*jslint browser: true, sloppy: true, nomen: true */
/*global THREE */

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
UNIVERSE.SensorProjectionGeometry = function (sensorOrigin, groundPoints) {

    THREE.Geometry.call(this);

    var segmentsY = 1,
        x,
        y,
        vertices = [],
        uvs = [],
        segmentsX,
        xpos,
        ypos,
        zpos,
        u,
        v = 0,
        verticesRow = [],
        uvsRow = [],
        v1,
        v2,
        v3,
        v4,
        n1,
        n2,
        n3,
        n4,
        uv1,
        uv2,
        uv3,
        uv4;

    // tack on the initial ground point back to the end of the groundpoints array
    groundPoints.push(groundPoints[0]);
    segmentsX = groundPoints.length - 1;

    // Create the top points around the vehicle

    for (x = 0; x <= segmentsX; x += 1) {
        u = x / segmentsX;

        xpos = sensorOrigin.x;
        ypos = sensorOrigin.y;
        zpos = sensorOrigin.z;

        //console.log("Vertice point: " + xpos + "," + ypos + "," + zpos);
        this.vertices.push(new THREE.Vector3(xpos, ypos, zpos));
        verticesRow.push(this.vertices.length - 1);
        uvsRow.push(new THREE.UV(u, v));
    }

    vertices.push(verticesRow);
    uvs.push(uvsRow);

    // Now create the ground lines
    v = 1;
    verticesRow = [];
    uvsRow = [];
    for (x = 0; x <= segmentsX; x += 1) {
        u = x / segmentsX;

        xpos = groundPoints[x].x;
        ypos = groundPoints[x].y;
        zpos = groundPoints[x].z;

        //        console.log("Vertice point: " + xpos + "," + ypos + "," + zpos);
        this.vertices.push(new THREE.Vector3(xpos, ypos, zpos));
        verticesRow.push(this.vertices.length - 1);
        uvsRow.push(new THREE.UV(u, v));

    }
    vertices.push(verticesRow);
    uvs.push(uvsRow);

    for (y = 0; y < segmentsY; y += 1) {

        for (x = 0; x < segmentsX; x += 1) {

            v1 = vertices[y][x];
            v2 = vertices[y + 1][x];
            v3 = vertices[y + 1][x + 1];
            v4 = vertices[y][x + 1];

            // FIXME: These normals aren't right for cones.

            n1 = this.vertices[v1].position.clone().setY(0).normalize();
            n2 = this.vertices[v2].position.clone().setY(0).normalize();
            n3 = this.vertices[v3].position.clone().setY(0).normalize();
            n4 = this.vertices[v4].position.clone().setY(0).normalize();

            uv1 = uvs[y][x].clone();
            uv2 = uvs[y + 1][x].clone();
            uv3 = uvs[y + 1][x + 1].clone();
            uv4 = uvs[y][x + 1].clone();

            this.faces.push(new THREE.Face4(v1, v2, v3, v4, [n1, n2, n3, n4]));
            this.faceVertexUvs[0].push([uv1, uv2, uv3, uv4]);
        }

    }

    this.computeCentroids();
    this.computeFaceNormals();
    this.dynamic = true;
};
UNIVERSE.SensorProjectionGeometry.prototype = new THREE.Geometry();
UNIVERSE.SensorProjectionGeometry.prototype.constructor = UNIVERSE.SensorProjectionGeometry;


UNIVERSE.SensorProjectionGeometry.prototype.recalculateVertices = function (sensorOrigin, groundPoints) {

    groundPoints.push(groundPoints[0]);

    this.dynamic = true;
    // Create the top points around the vehicle
    var segmentsX = groundPoints.length,
        segmentsY = 1,
        xpos,
        ypos,
        zpos,
        u,
        x;
    // tack on the initial ground point back to the end of the groundpoints array

    for (x = 0; x < segmentsX; x += 1) {
        u = x / segmentsX;

        xpos = sensorOrigin.x;
        ypos = sensorOrigin.y;
        zpos = sensorOrigin.z;

        this.vertices[x] = new THREE.Vector3(
            xpos,
            ypos,
            zpos
        );
    }

    // Now create the ground lines
    for (x = 0; x < segmentsX; x += 1) {
        u = x / segmentsX;

        xpos = groundPoints[x].x;
        ypos = groundPoints[x].y;
        zpos = groundPoints[x].z;

        this.vertices[x + segmentsX] = new THREE.Vector3(
            xpos,
            ypos,
            zpos
        );
    }


    this.verticesNeedUpdate = true;
};