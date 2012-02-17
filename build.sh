rm -rf docs/*
rm -rf build/*

# Write out the THREE.js files that we'll be including
cat lib/Three/ThreeWebGL.js > build/universe.js
cat lib/Three/Detector.js >> build/universe.js
cat lib/Three/ThreeExtras.js >> build/universe.js
cat lib/Three/RequestAnimationFrame.js >> build/universe.js

# add everything in core
find src/core -name "*.js" |xargs cat  >> build/universe.js

# add Universe.js itself
cat src/Universe.js >> build/universe.js

# minify the thang
java -jar ./utils/yuicompressor-2.4.7.jar -o build/universe-min.js build/universe.js

# grab everything for Extensions as a separate js
find src/EarthExtensions/utils -name "*.js" |xargs cat > build/UniverseEarthExtensions.js
find src/EarthExtensions/propagators -name "*.js" |xargs cat >> build/UniverseEarthExtensions.js
find src/EarthExtensions/objects -name "*.js" |xargs cat >> build/UniverseEarthExtensions.js
find src/EarthExtensions/EarthExtensions.js -name "*.js" |xargs cat >> build/UniverseEarthExtensions.js

# minification magic
java -jar ./utils/yuicompressor-2.4.7.jar -o build/UniverseEarthExtensions-min.js build/UniverseEarthExtensions.js

# Create the docs
java -jar ./utils/jsdoc/jsrun.jar ./utils/jsdoc/app/run.js -a src/Universe.js src/EarthExtensions/EarthExtensions.js -t=utils/jsdoc/templates/universe_web --suppress -d=docs

# Instrument with jscoverage

./utils/jscoverage -v --no-instrument=lib --no-instrument=test --exclude=nbproject --exclude=.git --exclude=build --exclude=docs --exclude=examples --exclude=utils --exclude=build.sh --exclude=build_win.bat . /tmp/instrumented
mv /tmp/instrumented build/instrumented

echo "Test and coverage can be viewed at /build/instrumented/test"