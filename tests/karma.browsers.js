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
	 * SauceLabs platforms (<https://saucelabs.com/platforms>)
	 */
	// Latest Chrome
	slChromeLatest: {
		base: 'SauceLabs',
		browserName: 'chrome'
	},

	// Latest Firefox
	slFirefoxLatest: {
		base: 'SauceLabs',
		browserName: 'firefox'
	},

	// Latest Edge
	slEdgeLatest: {
		base: 'SauceLabs',
		platform: 'Windows 10',
		browserName: 'microsoftedge'
	},

	// Latest IE
	slIE11: {
		base: 'SauceLabs',
		platform: 'Windows 10',
		browserName: 'internet explorer'
	},

	// Latest Safari
	slSafariLatest: {
		base: 'SauceLabs',
		platform: 'macOS 10.15',
		version: 'latest',
		browserName: 'safari'
	},

	// Oldest Safari that Sauce Labs provides
	slSafari12: {
		base: 'SauceLabs',
		platform: 'macOS 10.13',
		browserName: 'safari',
		version: '12.1'
	}
};
