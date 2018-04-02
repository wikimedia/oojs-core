/* eslint-env node */

/**
 * Custom launchers for Karma
 *
 * See also https://karma-runner.github.io/1.0/config/browsers.html
 */
module.exports = {
	// Headless Chrome with sandboxing security disabled.
	// This is for use in Travis CI, which is already sandboxed
	// and has Docker configured in a way that breaks Chrome's
	// ability to create a secure sandbox.
	// - https://github.com/karma-runner/karma-chrome-launcher/issues/158
	// - https://github.com/travis-ci/docs-travis-ci-com/blob/c1da4af0/user/chrome.md#sandboxing
	ChromeHeadlessNoSandbox: {
		base: 'ChromeHeadless',
		flags: [ '--no-sandbox' ]
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
