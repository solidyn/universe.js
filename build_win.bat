@echo off
rem Set the tool path to a location of git
set bin="C:\Program Files (x86)\Git\bin"

rm -rf docs

rem Write out the THREE.js files that we'll be including
cat lib/Three/ThreeWebGL.js > build/universe.js
cat lib/Three/Detector.js >> build/universe.js
cat lib/Three/ThreeExtras.js >> build/universe.js
cat lib/Three/RequestAnimationFrame.js >> build/universe.js

rem add everything in core
%bin%\find src/core -name "*.js" |xargs cat  >> build/universe.js

rem add Universe.js itself
cat src/Universe.js >> build/universe.js

rem minify the thang
java -jar ./utils/yuicompressor-2.4.7.jar -o build/universe-min.js build/universe.js

rem grab everything for Extensions as a separate js
%bin%\find src/EarthExtensions/utils -name "*.js" |xargs cat > build/UniverseEarthExtensions.js
%bin%\find src/EarthExtensions/propagators -name "*.js" |xargs cat >> build/UniverseEarthExtensions.js
%bin%\find src/EarthExtensions/objects -name "*.js" |xargs cat >> build/UniverseEarthExtensions.js
%bin%\find src/EarthExtensions/EarthExtensions.js -name "*.js" |xargs cat >> build/UniverseEarthExtensions.js

echo Minifying...
rem minification magic
java -jar ./utils/yuicompressor-2.4.7.jar -o build/UniverseEarthExtensions-min.js build/UniverseEarthExtensions.js

echo Creating docs...
rem Create the docs
java -jar ./utils/jsdoc/jsrun.jar ./utils/jsdoc/app/run.js -a src/Universe.js src/EarthExtensions/EarthExtensions.js -t=utils/jsdoc/templates/universe_web --suppress -d=docs

echo DONE
