'use strict';

module.exports = function ( config ) {
	config.set( Object.assign( require( './tests/karma.conf.base.js' ), {
		browsers: [ 'FirefoxHeadless', 'ChromeCustom' ],
		preprocessors: {
			'dist/*.js': [ 'coverage' ]
		},
		reporters: [ 'dots', 'coverage', 'karma-remap-istanbul' ],
		coverageReporter: {
			// https://github.com/karma-runner/karma-coverage/blob/v1.1.1/docs/configuration.md#check
			type: 'in-memory',
			check: { global: {
				functions: 100,
				statements: 99,
				branches: 99,
				lines: 99
			} }
		},
		remapIstanbulReporter: {
			reports: {
				'text-summary': null,
				html: 'coverage/',
				lcovonly: 'coverage/lcov.info',
				clover: 'coverage/clover.xml'
			}
		}
	} ) );
};
