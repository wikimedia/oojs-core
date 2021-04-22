'use strict';

module.exports = function ( config ) {
	config.set( Object.assign( require( './tests/karma.conf.base.js' ), {
		sauceLabs: {
			username: process.env.SAUCE_USERNAME || 'oojs',
			accessKey: process.env.SAUCE_ACCESS_KEY || '0e464279-3f2a-4ca0-9eb4-db220410bef0',
			recordScreenshots: false
		},
		concurrency: 4,
		captureTimeout: 90000,
		browsers: [
			// Latest versions of major browsers
			'slChromeLatest',
			'slFirefoxLatest',
			'slEdgeLatest',
			// Only supported version of Internet Explorer
			'slIE11',
			'slSafariLatest',
			// Earliest supported version of Safari
			'slSafari12'
		]
	} ) );
};
