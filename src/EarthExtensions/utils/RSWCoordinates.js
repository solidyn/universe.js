var UNIVERSE = UNIVERSE || {};

UNIVERSE.RSWCoordinates = function(radial, alongTrack, crossTrack) {
 
    // define variables as <var name>: <value>

    this.radial = radial ? radial : 0.0; //radial vector (km)
    this.alongTrack = alongTrack ? alongTrack : 0.0; //along track vector (km)
    this.crossTrack = crossTrack ? crossTrack : 0.0; //cross track vector (km)
};