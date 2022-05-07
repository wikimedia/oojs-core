'use strict';

module.exports = {
	// Custom launchers
	// https://karma-runner.github.io/1.0/config/browsers.html
	//
	// SauceLabs platforms
	// https://saucelabs.com/platforms
	customLaunchers: {
		ChromeCustom: {
			base: 'ChromeHeadless',
			// Allow Docker/CI to set --no-sandbox if needed.
			flags: ( process.env.CHROMIUM_FLAGS || '' ).split( ' ' )
		},
		slChromeLatest: {
			base: 'SauceLabs',
			browserName: 'chrome'
		},
		slFirefoxLatest: {
			base: 'SauceLabs',
			browserName: 'firefox'
		},
		slEdgeLatest: {
			base: 'SauceLabs',
			platform: 'Windows 11',
			browserName: 'microsoftedge'
		},
		slIE11: {
			base: 'SauceLabs',
			platform: 'Windows 10',
			browserName: 'internet explorer'
		},
		slSafariLatest: {
			base: 'SauceLabs',
			platform: 'macOS 10.15',
			version: 'latest',
			browserName: 'safari'
		},
		slSafari12: {
			// Oldest Safari that Sauce Labs provides
			base: 'SauceLabs',
			platform: 'macOS 10.13',
			browserName: 'safari',
			version: '12.1'
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
