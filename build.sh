cat src/*.js > build/universe3d.js

java -jar ~/Downloads/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar -o build/universe3d-min.js build/universe3d.js
