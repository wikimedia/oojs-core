/**
 * Web Test Runner – Jenkins CI local browser testing.
 *
 * Uses WebDriver to drive system-installed Chrome and Firefox, avoiding
 * the need to download Playwright browser binaries in CI.
 *
 * Requires a WebDriver-compatible server (e.g. chromedriver, geckodriver,
 * or Selenium standalone) running on localhost:4444.
 */

import { webdriverLauncher } from '@web/test-runner-webdriver';

import { baseConfig } from './tests/wtr.conf.base.mjs';

console.log( 'Running browser tests via WebDriver (Jenkins CI config).' );

export default {
	...baseConfig,

	browsers: [
		webdriverLauncher( {
			capabilities: {
				browserName: 'chrome',
				'goog:chromeOptions': {
					args: [ '--headless=new', '--no-sandbox' ]
				}
			}
		} ),
		webdriverLauncher( {
			capabilities: {
				browserName: 'firefox',
				'moz:firefoxOptions': {
					args: [ '-headless' ]
				}
			}
		} )
	]
};
