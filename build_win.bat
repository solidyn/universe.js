@echo off
rem Set the tool path to a location of git
set bin="C:\Program Files (x86)\Git\bin"
set path=%bin%;%path%
rem Set your panda path here if you want to copy the build into a solidpanda folder
set panda=%USERPROFILE%\Documents\Work\Solidyn\SolidPanda\solidpanda\vendor\assets\javascripts


rm -rf docs/*

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

rem UNCOMMENT below to copy into solidpanda
rem echo Copying to Solidpanda
rem copy build\UniverseEarthExtensions.js %panda%
rem copy build\universe.js %panda%

# Instrument with jscoverage

./utils/jscoverage.exe -v --no-instrument=lib --no-instrument=test --exclude=nbproject --exclude=.git --exclude=build --exclude=docs --exclude=examples --exclude=utils --exclude=build.sh --exclude=build_win.bat . /tmp/instrumented
move /tmp/instrumented build/instrumented

echo "Test and coverage can be viewed at /build/instrumented/test

echo DONE
