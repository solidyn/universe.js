
var UNIVERSE = UNIVERSE || {};

/** 
	An object to be drawn in orbit around the Earth
	@constructor
	@param {string} id - Identifier for the object to be referenced later
	@param {string} objectName - A name for the object if different than id.  Set to the id if not defined
	@param {function} propagator - A function(time) to give the object's position at a time.  No time passed in means the current Universe time
	@param {string} modelId - Identifier for the model to use that has been added to the Universe's object library
	@param {boolean} showPropagationLine - should a propagation line be shown for the object
	@param {boolean} showGroundTrackPoint - should the ground track point be shown for the object
 */

UNIVERSE.SpaceObject = function(id, objectName, modelId, propagator, showPropagationLine, showGroundTrackPoint, sensors) {
	if(id == undefined)
	{ 
		return undefined;
	}
	this.id = id;
	this.objectName = objectName || id;
	this.propagator = propagator;
	this.modelId = modelId;
	this.showPropagationLine = showPropagationLine || false;
	this.showGroundTrackPoint = showGroundTrackPoint || false;
	this.sensors = sensors || undefined;
}

UNIVERSE.SpaceObject.prototype = {
	constructor: UNIVERSE.SpaceObject,
	
	set: function ( id, objectName, propagator, modelId, showPropogationLine, showGroundTrackPoint, sensors) {

		this.id = id;
		this.objectName = objectName || id;
		this.propagator = propagator;
		this.modelId = modelId;
		this.showPropagationLine = showPropagationLine || false;
		this.showGroundTrackPoint = showGroundTrackPoint || false;
		this.sensors = sensors || undefined;

		return this;
	},
	
	getEci: function () {
		var location = this.propagator();
		
		return new ECICoordinates(location.x, location.y, location.z, location.vx, location.vy, location.vz, location.ax, location.ay, location.az);
	}
};