'use strict';

const { defineConfig, globalIgnores } = require( 'eslint/config' );
const wikimedia = require( 'eslint-config-wikimedia/flat' );

module.exports = defineConfig( [
	globalIgnores( [
		// Build
		'coverage/',
		'dist/',
		'docs/'
	] ),

	{
		extends: [ wikimedia( 'common' ) ],
		languageOptions: {
			globals: {
				OO: 'readonly'
			}
		}
	},
	{
		files: [
			'src/**/*.js',
			'tests/setup-browser.js'
		],
		extends: [ wikimedia( 'client/es6' ) ],
		rules: {
			'no-implicit-globals': 'off'
		}
	},
	{
		files: [
			'tests/**/*.js'
		],
		extends: [ wikimedia( 'client', 'qunit' ) ]
	},
	{
		files: [
			'eslint.config.js',
			'build.mjs',
			'web-test-runner.*.mjs',
			'tests/wtr.conf.base.mjs'
		],
		extends: [ wikimedia( 'server' ) ]
	},
	{
		files: [
			'tests/wtr-qunit-adapter.js'
		],
		extends: [ wikimedia( 'client' ) ],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module'
		}
	}
] );
