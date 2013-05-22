/*jshint node:true */
var qunit = require('qunit');

qunit.run({
    code: {
		path: './src/oo.js',
		namespace: 'OO'
    },
    tests: [
		'./test/oo.test.js'
    ]
});
