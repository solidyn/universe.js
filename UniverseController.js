var SSI = SSI || {};

SSI.UniverseController = function(options) {
    var graphicsObjects = new Array();

    // Timeout that runs the animation, will be cleared when paused
    var refreshTimeout;

    var refreshRate = options.refreshRate || 30; 	// milliseconds

    function update(elapsedTime) {
        for(var i = 0; i < graphicsObjects.length; i++) {
            graphicsObjects[i].update(elapsedTime);
            graphicsObjects[i].draw();
        }
        refreshTimeout = setTimeout(function() {
            update()
        }, refreshRate);
    }

    function updateOnce() {
        for(var i = 0; i < graphicsObjects.length; i++) {
            graphicsObjects[i].update(null);
            graphicsObjects[i].draw();
        }
    }

    // id
    // objectName
    // updateFunction
    this.addGraphicsObject = function(graphicsObject) {
        graphicsObjects.push(graphicsObject);
        updateOnce();
    }

    this.play = function() {
        update(null);
    };

    this.pause = function() {
        clearTimeout(refreshTimeout);
    };
};

SSI.UniverseController.prototype.updateOnce = function() {
    this.updateOnce();
}

SSI.UniverseController.prototype.changeRefreshRate = function(rateInMilliseconds) {
    this.refreshRate = rateInMilliseconds;
}