var UNIVERSE = UNIVERSE || {};

/** 
	A Ground Object to be drawn on the Earth
	@constructor
	@param {string} id - Identifier for the object to be referenced later
	@param {string} objectName - A name for the object if different than id.  Set to the id if not defined
	@param {function} propagator - A function(time) to give the object's position at a time.  No time passed in means the current Universe time
	@param {string} modelId - Identifier for the model to use that has been added to the Universe's object library
 */

UNIVERSE.GroundObject = function(id, objectName, modelId, propagator) {
	if(id == undefined)
	{ 
		return undefined;
	}
	this.id = id;
	this.objectName = objectName || id;
	this.propagator = propagator;
	this.modelId = modelId;
}

UNIVERSE.GroundObject.prototype = {
	constructor: UNIVERSE.GroundObject,
	
	set: function ( id, objectName, propagator, modelId ) {

		this.id = id;
		this.objectName = objectName || id;
		this.propagator = propagator;
		this.modelId = modelId;

		return this;
	}
};