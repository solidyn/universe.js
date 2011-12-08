cat src/*.js > build/universe.js

java -jar ~/Downloads/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar -o build/universe-min.js build/universe.js
