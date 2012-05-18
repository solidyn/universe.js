#! /bin/sh

rm -rf docs
mkdir docs
rm -rf build
mkdir build

# output files
export UNIVERSE_JS=build/universe.js
export EARTH_EXT_JS=build/UniverseEarthExtensions.js

# Write out the THREE.js files that we'll be including
cat lib/Three/ThreeWebGL.js > $UNIVERSE_JS
cat lib/Three/Detector.js >> $UNIVERSE_JS
cat lib/Three/ThreeExtras.js >> $UNIVERSE_JS
cat lib/Three/RequestAnimationFrame.js >> $UNIVERSE_JS
cat lib/Input/input.js >> $UNIVERSE_JS

# add everything in core
find src/core -name "*.js" |xargs cat  >> $UNIVERSE_JS

# add Universe.js itself
cat src/Universe.js >> $UNIVERSE_JS

# minify the thang
java -jar ./utils/yuicompressor-2.4.7.jar -o build/universe-min.js $UNIVERSE_JS

# grab everything for Extensions as a separate js
find src/EarthExtensions/utils -name "*.js" |xargs cat > $EARTH_EXT_JS
find src/EarthExtensions/propagators -name "*.js" |xargs cat >> $EARTH_EXT_JS
find src/EarthExtensions/objects -name "*.js" |xargs cat >> $EARTH_EXT_JS
find src/EarthExtensions/EarthExtensions.js -name "*.js" |xargs cat >> $EARTH_EXT_JS

# minification magic
java -jar ./utils/yuicompressor-2.4.7.jar -o build/UniverseEarthExtensions-min.js $EARTH_EXT_JS

# Create the docs
java -jar ./utils/jsdoc/jsrun.jar ./utils/jsdoc/app/run.js -a src/Universe.js src/EarthExtensions/EarthExtensions.js -t=utils/jsdoc/templates/universe_web --suppress -d=docs

# Instrument with jscoverage
./utils/jscoverage -v --no-instrument=lib --no-instrument=test --exclude=nbproject --exclude=.git --exclude=build --exclude=docs --exclude=examples --exclude=utils --exclude=build.sh --exclude=build_win.bat . /tmp/instrumented
mv /tmp/instrumented build/instrumented

echo "Test and coverage can be viewed at /build/instrumented/test"

# run jshint
java -jar ./utils/rhino1_7R3/js.jar utils/jshint-rhino.js `find src -name "*.js"` > build/jshint-output.txt
echo "JSHint output can be viewed at build/jshint-output.txt"