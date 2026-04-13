/**
 * Web Test Runner – local browser testing.
 *
 * Uses Playwright for speed (its bundled browsers launch faster than
 * WebDriver). Jenkins CI uses web-test-runner.jenkins.config.mjs with
 * WebDriver instead, to avoid downloading Playwright's browser binaries.
 */

import { playwrightLauncher } from '@web/test-runner-playwright';

import { baseConfig } from './tests/wtr.conf.base.mjs';

const browsers = [
	playwrightLauncher( { product: 'chromium' } ),
	playwrightLauncher( { product: 'firefox' } )
];

// WebKit (Safari's engine) is available via Playwright on macOS.
if ( process.platform === 'darwin' ) {
	browsers.push( playwrightLauncher( { product: 'webkit' } ) );
}

console.log(
	'Running browser tests via Playwright (local dev config): ' +
	browsers.map( ( b ) => b.name ).join( ', ' ) + '.'
);

export default {
	...baseConfig,

	browsers,

	coverage: true,
	coverageConfig: {
		include: [ 'dist/oojs.js' ],
		report: true,
		reportDir: 'coverage',
		reporters: [ 'html', 'lcovonly', 'clover', 'text-summary' ],
		threshold: {
			statements: 99,
			branches: 99,
			functions: 100,
			lines: 99
		}
	}
};
