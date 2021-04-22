'use strict';

module.exports = function ( config ) {
	config.set( Object.assign( require( './tests/karma.conf.base.js' ), {
		// Workaround for T280935, and T240955.
		// Firefox 68esr is incompatible with Docker (OK, covered by Sauce).
		// TODO: Try this again when Firefox 84esr reaches our CI images.
		browsers: ( process.env.ZUUL_PIPELINE ?
			[ 'ChromeCustom' ] :
			[ 'FirefoxHeadless', 'ChromeCustom' ]
		),
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
