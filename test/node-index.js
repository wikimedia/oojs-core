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
		'./test/oo.core.test.js',
		'./test/oo.util.test.js',
		'./test/oo.EventEmitter.test.js',
		'./test/oo.Registry.test.js',
		'./test/oo.Factory.test.js'
	]
}, function ( err, report ) {
	if ( err || report.failed ) {
		process.exit( 1 );
	}
} );
