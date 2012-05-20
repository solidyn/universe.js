
UNIVERSE.DefaultObjects = function(universe) {
    
    universe.setObjectInLibrary("default_ground_object_geometry", new THREE.SphereGeometry(200, 20, 10));
    universe.setObjectInLibrary("default_ground_object_material", new THREE.MeshLambertMaterial({
        color : 0xCC0000
    }));

    universe.setObjectInLibrary("default_ground_track_material", new THREE.MeshBasicMaterial({
        color : 0xCC0000,
        transparent:true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    }));
    
    universe.setObjectInLibrary("default_orbit_line_material", new THREE.LineBasicMaterial({
        color : 0x990000,
        opacity : 1
    }));
            
    universe.setObjectInLibrary("default_ground_object_tracing_line_material", new THREE.LineBasicMaterial({
        color : 0x009900,
        opacity : 1
    }));
    
    this.sensorColors = {
        colorList: [
        "0xff0000",
        "0x00cc00",
        "0x0066ff",
        "0x9900cc",
        "0xffff00",
        "0xff6666",
        "0xebebeb",
        "0xffaa00"
        ],
        iterator: -1,
        // GRab the next color on the list and iterate to the next color
        nextColor: function() {
            this.iterator = (this.iterator + 1) % this.colorList.length;
            return this.colorList[this.iterator];     
        }
    };
};