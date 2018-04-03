/* eslint-env node */
global.OO = require( '../dist/oojs.js' );

require( './unit/core.test.js' );
require( './unit/util.test.js' );
require( './unit/EventEmitter.test.js' );
require( './unit/EmitterList.test.js' );
require( './unit/SortedEmitterList.test.js' );
require( './unit/Registry.test.js' );
require( './unit/Factory.test.js' );
