'use strict';

module.exports = {
	// Custom launchers
	// https://karma-runner.github.io/1.0/config/browsers.html
	//
	// SauceLabs platforms
	// https://saucelabs.com/products/supported-browsers-devices
	customLaunchers: {
		ChromeCustom: {
			base: 'ChromeHeadless',
			// Allow Docker/CI to set --no-sandbox if needed.
			flags: ( process.env.CHROMIUM_FLAGS || '' ).split( ' ' )
		},
		slChromeLatest: {
			base: 'SauceLabs',
			browserName: 'chrome',
			browserVersion: 'latest'
		},
		slFirefoxESR: {
			base: 'SauceLabs',
			browserName: 'Firefox',
			browserVersion: '78'
		},
		slEdgeLatest: {
			base: 'SauceLabs',
			platform: 'Windows 11',
			browserName: 'MicrosoftEdge',
			browserVersion: 'latest'
		},
		slSafariLatest: {
			base: 'SauceLabs',
			platform: 'macOS 12',
			version: 'latest',
			browserName: 'safari'
		},
		slSafari12: {
			// Oldest Safari that Sauce Labs provides
			base: 'SauceLabs',
			platform: 'macOS 11',
			browserName: 'safari',
			version: '14'
		}
	},
	frameworks: [ 'qunit' ],
	files: [
		'dist/oojs.js',
		'tests/setup-browser.js',
		'tests/unit/*.js'
	],
	singleRun: true,
	autoWatch: false,
	captureTimeout: 90000,
	// browsers: [],
	// preprocessors: {},
	reporters: [ 'dots' ]
};
