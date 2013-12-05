# OOjs Release History

## v1.0.5 / 2013-10-23

* core: Add simpleArrayUnion, simpleArrayIntersection and simpleArrayDifference (Timo Tijhof)
* build: Consistenetly use oojs as filename instead of oo (Timo Tijhof)
* core: Remove unused code for tracking mixins (Timo Tijhof)

## v1.0.4 / 2013-10-10

* core: Add getHash to core (Trevor Parscal)

## v1.0.3 / 2013-10-10

* core: Add oo.Registry and oo.Factory (Trevor Parscal)
* EventEmitter: Re-use #off in #connect and add context argument to #off (Trevor Parscal)
* readme: Add npm install and npm test to release process (Timo Tijhof)

## v1.0.2 / 2013-07-25

* core: Optimise oo.compare when a and b are equal by reference (Timo Tijhof)
* test: Fix false positive in nodejs EventEmitter test (Timo Tijhof)
* core: Make "constructor" non-enumerable in oo.inheritClass (Timo Tijhof)

## v1.0.1 / 2013-06-06

* license: Refer to OOJS Team and other contributors (Timo Tijhof)
* test: Fix oo.EventEmitter context test failure on nodejs (Timo Tijhof)

## v1.0.0 / 2013-06-06

* core: Don't copy non-plain objects in oo.copy (Timo Tijhof)
* core: Implement oo.isPlainObject (Timo Tijhof)
* core: Optimise reference to hasOwnProperty (Timo Tijhof)
* readme: Document release process (Timo Tijhof)
* core: Apply asymmetrical recursively in oo.compare (Timo Tijhof)
* test: Add tests for oo.compare (Timo Tijhof)
* core: Rename oo.compareObjects to oo.compare (Timo Tijhof)
* core: Remove obsolete oo.createObject (Timo Tijhof)
* docs: Add categories and include builtin classes (Timo Tijhof)

## v0.1.0 / 2013-06-05

* test: Add tests for oo.EventEmitter (Timo Tijhof)
* build: Optimise watch configuration (Timo Tijhof)
* build: Upgrade to grunt-contrib-jshint 0.5 and jshint 2 (Timo Tijhof)
* build: Add support for JSDuck (Timo Tijhof)
* core: Remove Object.create polyfill (Timo Tijhof)
* build: Make grunt use .jshintrc (Timo Tijhof)
* travis: Install grunt-cli before install instead of between install and test (Timo Tijhof)
* build: Implement build process to fix breakage in nodejs (Timo Tijhof)
* test: Minimise output from node-qunit (Timo Tijhof)
* build: Add grunt watch (Timo Tijhof)
* Initial import of utility functions and EventEmitter class (Trevor Parscal)
