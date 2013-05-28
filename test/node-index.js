/*jshint node:true */
var qunit = require( 'qunit' );

qunit.setup({
	log: {
		// Results
		assertions: false,
		tests: false,
		summary: false,
		globalSummary: true,

		// Failures
		errors: true,

		// Progress
		testing: true
	}
});

qunit.run({
	code: {
		path: './src/oo.core.js',
		namespace: 'OO'
	},
	tests: [
		'./test/oo.core.test.js'
	]
});
