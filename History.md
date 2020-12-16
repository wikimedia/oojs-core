# OOjs Release History

## v5.0.0 / 2020-05-05
* [BREAKING CHANGE] Use jQuery v3.5.1, up from v3.5.0 (James D. Forrester)

## v4.0.0 / 2020-04-30
* [BREAKING CHANGE] Use jQuery v3.5.0, up from v3.4.1 (James D. Forrester)

## v3.0.1 / 2020-02-24
* EmitterList: Call OO.initClass for consistency with other classes (Thalia Chan)
* EventEmitter: Improve documentation for variadic args (Thalia Chan)
* docs: Fix typo in EventEmitter documentation (Thalia Chan)
* docs: Point to gerrit, not Phabricator Diffusion (James D. Forrester)

## v3.0.0 / 2019-08-26
* [BREAKING CHANGE] Update jQuery 3.2.1 -> 3.4.1 (Ed Sanders; James D. Forrester)
* [BREAKING CHANGE] EventEmitter.emit: catch exceptions from listeners (David Chan)
* EmitterList: Throw error on null/undefined item (Kosta Harlan)
* EventEmitter: Minor code simplifications (Timo Tijhof)
* Factory: Improve unit tests (Timo Tijhof)
* Factory: Support registration by name (Timo Tijhof)
* core: Use "OO" internally too, instead of "oo" (Prateek Saxena)
* docs: Convert from using JSDuck to JSDoc 3 (Prateek Saxena)

## v2.2.2 / 2018-06-14
* release: Add AUTHORS.txt back to package root (Timo Tijhof)
* release: Remove text files from dist/ (Timo Tijhof)

## v2.2.1 / 2018-06-14
* release: Add 'files' whitelist to package.json (Timo Tijhof)

## v2.2.0 / 2018-04-03
* [DEPRECATING CHANGE] Drop more code supporting ES3 / IE<=9 (Ed Sanders)
* core: Fix deleteProp() case where root object is empty (Ed Sanders)
* docs: Add intro for OO.Registry (Prateek Saxena)
* docs: Fix valid-jsdoc issues in EventEmitter and SortedEmitterList (Ed Sanders)

## v2.1.0 / 2017-05-31
* EmitterList: Fix moving an item to a lower index (Andrew Green)
* EventEmitter: Document disconnect() behaviour regarding array matching (Timo Tijhof)
* EventEmitter: Support passing once() handler to off() (Timo Tijhof)
* util: Simplify isPlainObject and fix two false positives (Timo Tijhof)
* release: Add README/AUTHORS/LICENCE to dist (James D. Forrester)

## v2.0.0 / 2017-04-04

This release drops support for ES3 environments. Where previously OOjs was
supported in IE 6-8 with an ES5 shim, it is no longer.

* [BREAKING CHANGE] core: Drop support for ES3 environments (James D. Forrester)
* core: Add `OO.isSubclass`, to test class inheritance (David Chan)
* core: Guard `OO.setProp()` against insufficient arguments (Ed Sanders)
* core: Implement `OO.deleteProp` (Ed Sanders)
* core: Improve error message for `inheritClass`/`mixinClass` called with undefined (Bartosz Dziewoński)
* core: Switch from `.parent` hack to use `.super` directly (James D. Forrester)
* EmitterList: Change insertItem from `@private` to `@protected` (Moriel Schottlender)
* SortedEmitterList: Emit the actual inserted index (Ed Sanders)
* docs: Make OO uppercase (Prateek Saxena)
* docs: Update Phabricator URL (James D. Forrester)
* docs: Replace git.wikimedia.org URL with Phabricator one (Paladox)
* release: Bump file copyright notices for year change (James D. Forrester)

## v1.1.10 / 2015-11-11
* EventEmitter: Allow disconnecting event handlers given by array (Moriel Schottlender)
* Add EmitterList class (Moriel Schottlender)
* Add SortedEmitterList class (Moriel Schottlender)
* core: Add binarySearch() utility from VisualEditor (Ed Sanders)
* build: Bump various devDependencies to latest (James D. Forrester)
* tests: Add QUnit web interface (Moriel Schottlender)
* AUTHORS: Update for the past few months (James D. Forrester)

## v1.1.9 / 2015-08-25
* build: Fix the build by downgrading Karma and removing testing of Safari 5 (Timo Tijhof)
* core: Remove dependency on Object.create (Bartosz Dziewoński)
* test: Don't use QUnit.supportsES5 (Bartosz Dziewoński)

## v1.1.8 / 2015-07-23
* EventEmitter: Remove TODO about return value of #emit and tweak tests (Bartosz Dziewoński)
* build: Add explicit dependency upon grunt-cli (Kunal Mehta)
* build: Various fixes for cdnjs support (James D. Forrester)

## v1.1.7 / 2015-04-28
* Factory: Remove unused, undocumented 'entries' property (Ed Sanders)
* Registry: Provide an unregister method (Ed Sanders)

## v1.1.6 / 2015-03-18
* core: Improve class related unit tests (Timo Tijhof)
* jsduck: Set --processes=0 to fix warnings-exit-nonzero (Timo Tijhof)
* core: Provide OO.unique for removing duplicates from arrays (Ed Sanders)

## v1.1.5 / 2015-02-25
* EventEmitter: Remove unneeded Array.prototype.slice call (Timo Tijhof)
* core: Use Node#isEqualNode to compare node objects (Ori Livneh)
* core: Recurse more frugally in OO.compare (David Chan)

## v1.1.4 / 2015-01-23
* util: Fix typo "siuch" in comment (Timo Tijhof)
* Factory: Enable v8 optimisation for `#create` (Ori Livneh)
* EventEmitter: Enable v8 optimisation for `#emit` (Ori Livneh)

## v1.1.3 / 2014-11-17
* core: Explicitly bypass undefined values in OO.compare() (Roan Kattouw)
* core: Add getProp() and setProp() methods (Roan Kattouw)

## v1.1.2 / 2014-11-05
* EventEmitter: Use hasOwn check in `#emit` (Ed Sanders)
* EventEmitter: Use hasOwn check in `#off` (Timo Tijhof)

## v1.1.1 / 2014-09-10
* core: Make OO.compare cover boolean as well as number and string primitives (James D. Forrester)

## v1.1.0 / 2014-08-31
* EventEmitter: Make #validateMethod private (Roan Kattouw)

## v1.0.12 / 2014-08-20

* release: Tell people which version they're using (James D. Forrester)
* Registry: Guard against Object prototype keys in lookup() (Ed Sanders)
* core: Add new OO.copy callback for all nodes, not just leaves (C. Scott Ananian)
* core: Use empty object as fallback when comparing to null/undefined (Ed Sanders)
* EventEmitter: Look up callbacks by name at call time (divec)

## v1.0.11 / 2014-07-23

* EventEmitter: Remove dead code that claims to prevent double bindings (Timo Tijhof)
* EventEmitter: Fix bug in disconnect loop for double un-bindings (Ed Sanders)
* EventEmitter: Support events named "hasOwnProperty" (Timo Tijhof)

## v1.0.10 / 2014-06-19

* test: Update qunitjs to v1.14.0 (Timo Tijhof)
* release: Implement build target optimised for jQuery (Timo Tijhof)
* core: Use bracket notation for 'super' for ES3 compatibility (James D. Forrester)
* core: Implement support for ES3 browsers (Timo Tijhof)

## v1.0.9 / 2014-04-01
* core: Add initClass method for initializing static in base classes (Ed Sanders)

## v1.0.8 / 2014-03-11
* Factory: Use Class.super instead of hard coding parent class (Timo Tijhof)
* Registry: Remove redundant type validation logic in #register (Timo Tijhof)
* core: Use Class.super instead of this.constructor.super (Timo Tijhof)
* core: Add a 'super' property to inheriting classes (Timo Tijhof)
* docs: Improve overall documentation and fix minor issues (Timo Tijhof)

## v1.0.7 / 2014-01-21
* release: Update dist build header and license file for 2014 (James D. Forrester)

## v1.0.6 / 2013-12-10
* docs: Change display name from OOJS to OOjs (Timo Tijhof)
* docs: Update references from GitHub to Wikimedia (Timo Tijhof)

## v1.0.5 / 2013-10-23

* core: Add simpleArrayUnion, simpleArrayIntersection and simpleArrayDifference (Timo Tijhof)
* core: Remove unused code for tracking mixins (Timo Tijhof)

## v1.0.4 / 2013-10-10

* core: Add getHash to core (Trevor Parscal)

## v1.0.3 / 2013-10-10

* core: Add OO.Registry and OO.Factory (Trevor Parscal)
* EventEmitter: Re-use #off in #connect and add context argument to #off (Trevor Parscal)
* docs: Add npm install and npm test to release process (Timo Tijhof)

## v1.0.2 / 2013-07-25

* core: Optimise OO.compare when a and b are equal by reference (Timo Tijhof)
* core: Make "constructor" non-enumerable in OO.inheritClass (Timo Tijhof)

## v1.0.1 / 2013-06-06

* docs: Refer to OOJS Team and other contributors (Timo Tijhof)

## v1.0.0 / 2013-06-06

* core: Don't copy non-plain objects in OO.copy (Timo Tijhof)
* core: Implement OO.isPlainObject (Timo Tijhof)
* core: Optimise reference to hasOwnProperty (Timo Tijhof)
* core: Apply asymmetrical recursively in OO.compare (Timo Tijhof)
* core: Rename OO.compareObjects to OO.compare (Timo Tijhof)
* core: Remove obsolete OO.createObject (Timo Tijhof)
* docs: Document release process (Timo Tijhof)
* docs: Add categories and include builtin classes (Timo Tijhof)

## v0.1.0 / 2013-06-05

* core: Remove Object.create polyfill (Timo Tijhof)
* Initial import of utility functions and EventEmitter class (Trevor Parscal)
