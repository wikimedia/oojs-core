/*jshint node:true */
var qunit = require( 'qunit' );

qunit.setup({
	log: {
		summary: true,
		errors: true
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
