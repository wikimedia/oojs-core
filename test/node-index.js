/*jshint node:true */
var qunit = require( 'qunit' );

qunit.setup( {
	log: {
		summary: true,
		errors: true
	}
} );

qunit.run( {
	code: {
		path: './dist/oojs.js',
		namespace: 'OO'
	},
	tests: [
		'./test/unit/core.test.js',
		'./test/unit/util.test.js',
		'./test/unit/EventEmitter.test.js',
		'./test/unit/Registry.test.js',
		'./test/unit/Factory.test.js'
	]
}, function ( err, report ) {
	if ( err || report.failed ) {
		process.exit( 1 );
	}
} );
