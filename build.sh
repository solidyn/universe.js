cat lib/Three/ThreeWebGL.js > build/universe.js
cat lib/Three/Detector.js >> build/universe.js
cat lib/Three/ThreeExtras.js >> build/universe.js
cat lib/Three/RequestAnimationFrame.js >> build/universe.js

find src -name "*.js" |xargs cat  >> build/universe.js

java -jar ./utils/yuicompressor-2.4.7.jar -o build/universe-min.js build/universe.js

java -jar ./utils/jsdoc/jsrun.jar ./utils/jsdoc/app/run.js -a src/Universe.js -t=utils/jsdoc/templates/jsdoc -d=docs