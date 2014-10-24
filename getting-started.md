---
title: '- Getting Started'
description: A quick tutorial about modeling with universe.js
---

<div class="page-header">
    <h1>A tutorial on modeling your universe</h1>
</div>

### Include the libraries
To take full advantage of Universe.js, you need to include two files: 
`universe-min.js` and `universe-earth-extensions-min.js`. All dependencies needed
by universe.js are already included (Three.js, Input.js, etc).

    <!doctype html>
    <html lang="en">
        <head>
            ...
            <script src="js/universe-min.js"></script>
            <script src="js/universe-earth-extensions-min.js"></script>
            ...
        </head>

        <body>
            ...
        </body>
    </html>

### Add a div where the universe will be rendered

    <body>
        ...
        <h1>My first universe!</h1>
        <div id="universe"></div>
        ...
    </body>

### Initialize the 'verse

    <script>
        var universe = new UNIVERSE.Universe(
            // set the current time in the universe to now
            new Date(), 
            // render at 30fps
            30, 
            // pass in the DOM element where the universe should be rendered
            document.getElementById("universe"));
    </script>

### Add some celestial bodies

    <script>
        var earthExtensions = new UNIVERSE.EarthExtensions(universe, false);

        // when adding the Earth, both a day and night image can be provided
        earthExtensions.addEarth("img/world3000.jpg", "img/earth_lights_lrg-dim.png")

        earthExtensions.addMoon("img/moon_1024.jpg")

        earthExtensions.addSun();
    </script>


### Add a satellite!

    <script>
        // initial position of the satellite in the ECI
        // coordinate system
        var initialPosition = new UNIVERSE.ECICoordinates(
            -14213.99162,
            -39987.86471,
            -1115.314875,
            2.865601523,
            -1.007157587,
            -0.410247122
        );

        // variables for keeping track of the vehicle's 
        // starting time ('epoch')
        var epoch = new Date();

        // load a 3D model called "DSP" from a Three.js compatible
        // JSON file
        universe.addJsonGeometryModel("dsp", "models/DSP.json", function() {

            // when the model is loaded, create a space object and add
            // it to the universe
            earthExtensions.addSpaceObject(new UNIVERSE.SpaceObject(
                // unique id of the object
                "space_object_id",
                // friendly name of the object
                "space_object_name",
                // name of the 3D model used to represent the object
                "dsp",
                // an 'update' function that will be called every frame
                // before the object is drawn
                function(time, updateState) {
                    // determine how much time has elapsed since the start
                    // of the simulation
                    var universeDate = new Date(universe.getCurrentUniverseTime());
                    var elapsedTime = universeDate - epoch;
                    dt = 100;

                    // use an orbit propagator to determine where the vehicle
                    // is at the current time in the simulation
                    var location = OrbitPropagator.propagateOrbit(initialPosition, elapsedTime/1000, dt, epoch);
                    return location;
                },
                true,
                true,
                []
            ))
        });
    </script>

### Press play

    <script>
        // start playing the universe at the current time,
        // 500x playback speed, and no state changed callback
        universe.play(new Date(), 500, null);

        // when you want to stop the playback, hit pause
        // universe.pause();
    </script>

