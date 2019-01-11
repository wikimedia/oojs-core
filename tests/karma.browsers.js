/* eslint-env node, es6 */

/**
 * Custom launchers for Karma
 *
 * See also https://karma-runner.github.io/1.0/config/browsers.html
 */
module.exports = {
	ChromeCustom: {
		base: 'ChromeHeadless',
		// Chrome requires --no-sandbox in Docker/CI.
		flags: ( process.env.CHROMIUM_FLAGS || '' ).split( ' ' )
	},

	/**
	 * SauceLabs (<https://saucelabs.com/platforms>)
	 */
	// Latest Chrome
	slChrome: {
		base: 'SauceLabs',
		browserName: 'chrome'
	},
	// Latest Firefox
	slFirefox: {
		base: 'SauceLabs',
		browserName: 'firefox'
	},
	// Latest Edge
	slEdge: {
		base: 'SauceLabs',
		platform: 'Windows 10',
		browserName: 'microsoftedge'
	},

	// Latest Safari
	slSafari: {
		base: 'SauceLabs',
		// Hardcode version as 11, because default/'latest'/'12'
		// all currently map to broken servers at SauceLabs. (2019-01-19)
		version: '11',
		browserName: 'safari'
	},
	// Latest IE
	slIE: {
		base: 'SauceLabs',
		platform: 'Windows 10',
		browserName: 'internet explorer'
	},

	// Oldest Safari that Sauce Labs provides
	slSafari9: {
		base: 'SauceLabs',
		browserName: 'safari',
		version: '9'
	},
	// Oldest IE we support
	slIE10: {
		base: 'SauceLabs',
		platform: 'Windows 8',
		browserName: 'internet explorer',
		version: '10'
	}
};
