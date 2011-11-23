var SSI = SSI || {};

SSI.UniverseController = function(options) {
    var graphicsObjects = new Array();

    // Timeout that runs the animation, will be cleared when paused
    var refreshTimeout;

    // number of milliseconds between calls to update() (frame rate / refresh rate)
    var refreshRate = options.refreshRate || 100;

    // the last time we called update() in ms since jsDate epoch
    var lastUpdateMs = 0;

    function update() {
        // determine how much time has elapsed since update has last been called
        var nowMs = (new Date()).getTime();
        var elapsedTime = nowMs - lastUpdateMs;
        // save now as the last time we've updated
        lastUpdateMs = nowMs;
        // causes terrible performance... only enable if needed for debugging!
        // logger.debug("now [" + nowMs + "] elapsed ms [" + elapsedTime + "]");

        // update and draw all graphics objects
        for(var i = 0; i < graphicsObjects.length; i++) {
            graphicsObjects[i].update(elapsedTime);
            graphicsObjects[i].draw();
        }

        // call update() again in a certain number of milliseconds
        refreshTimeout = setTimeout(function() {
            update();
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
        // set our last update time to now since this is the first update
        lastUpdateMs = (new Date()).getTime();
        update();
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