/* eslint-env node */

/**
 * Cover a wide range of browsers with (ideally) no more than 9 browsers (3 batches of 3).
 *
 * More info: https://saucelabs.com/platforms
 */
module.exports = {
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
		browserName: 'safari'
	},
	// Latest IE
	slIE: {
		base: 'SauceLabs',
		platform: 'Windows 10',
		browserName: 'internet explorer'
	},

	// Oldest Safari that Sauce Labs provides
	slSafari7: {
		base: 'SauceLabs',
		browserName: 'safari',
		version: '7'
	},
	// Oldest IE we support
	slIE10: {
		base: 'SauceLabs',
		platform: 'Windows 8',
		browserName: 'internet explorer',
		version: '10'
	}
};
