/*jshint node:true */

/**
 * Cover a wide range of browsers with (ideally) no more than 6 browsers (2 batches of 3).
 *
 * The below covers:
 * - Latest Chrome/Firefox (generally the same on any platform).
 * - IE 11 (latest).
 * - IE 9 (latest before ES5 support)
 * - IE 6 (oldest IE we support)
 * - Safari 5.1 on Mac (oldest IE we support that Sauce Labs provides)
 *
 * More info: https://saucelabs.com/platforms
 */
module.exports = {
	slChrome: {
		base: 'SauceLabs',
		browserName: 'chrome'
	},
	slFirefox: {
		base: 'SauceLabs',
		browserName: 'firefox'
	},
	slSafari5Mac: {
		base: 'SauceLabs',
		platform: 'OSX 10.6',
		browserName: 'safari',
		version: '5'
	},
	slIE11: {
		base: 'SauceLabs',
		platform: 'Windows 7',
		browserName: 'internet explorer',
		version: '11'
	},
	slIE9: {
		base: 'SauceLabs',
		platform: 'Windows 7',
		browserName: 'internet explorer',
		version: '9'
	},
	slIE6: {
		base: 'SauceLabs',
		platform: 'Windows XP',
		browserName: 'internet explorer',
		version: '6'
	}
};
