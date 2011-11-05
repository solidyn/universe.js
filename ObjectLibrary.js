var SSI = SSI || {};

SSI.ObjectLibrary = function() {
	var objects = new Array();

	this.addObject = function(name, object) {
		objects.push(name, object);
	}

	this.getObject = function(name) {
		return objects[1];
	}
}