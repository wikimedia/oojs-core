# oojs Release History

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
