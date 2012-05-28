# Universe.js

## Lightweight 3D modeling and simulation framework for your browser.

The main website is at http://universejs.com/
The documentation is at https://github.com/solidyn/Universe.js/wiki

## Usage

Download the [minified library](https://github.com/solidyn/Universe.js/dist/universe-min.js) 
and include it in your html.

`<script src="js/universe-min.js"></script>`

If you plan on modeling celestial bodies such as the Sun, Earth, and Moon, 
you will want to use the 
[Earth Extensions](https://github.com/solidyn/Universe.js/dist/universe-earth-extensions-min.js) 
plugin.

`<script src="js/universe-earth-extensions-min.js"></script>`

## Bugs

Found a bug? Please create an issue here on GitHub!

https://github.com/solidyn/universe.js/issues

## Contributing

* Fork the project.
* Make your feature addition or bug fix.
* Add tests for it.
* Commit, please do not mess with version or history.
* Send a pull request. Bonus points for topic branches.

## Supported browsers

Universe.js works everywhere WebGL does: http://www.doesmybrowsersupportwebgl.com/

Universe.js has been heavily tested on...
* Firefox - stable but pokey
* Chrome - faster but crash-prone

## Building and Testing

    ant dist

* open `test/index.html` in Firefox and Chrome and make sure everything passes
* open `build/jshint-output.txt` and tidy any messes you made
* make sure the examples in the `examples` folder still run

## Authors

* Chris Rothe - http://github.com/crothe

* Justin Rodriguez - http://github.com/trajan007

* Brian Davis - http://github.com/brianthedavis

* Brian Beyer - http://github.com/brianebeyer

## Copyright and License

Copyright (c) 2012 Solidyn Solutions, Inc. See LICENSE for details.