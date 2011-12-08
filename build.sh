find src -name "*.js" |xargs cat  > build/universe.js

java -jar ./utils/yuicompressor-2.4.7.jar -o build/universe-min.js build/universe.js
