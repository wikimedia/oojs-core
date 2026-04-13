/**
 * Shared Web Test Runner configuration.
 *
 * Defines the HTML harness that loads QUnit, the built library, and the
 * unit-test files, then hands control to the QUnit adapter.
 */

import { readdirSync } from 'fs';
import { resolve } from 'path';

const testsDir = new URL( '.', import.meta.url ).pathname;
const rootDir = resolve( testsDir, '..' );

// eslint-disable-next-line security/detect-non-literal-fs-filename
const testScriptTags = readdirSync( resolve( rootDir, 'tests/unit' ) )
	.filter( ( f ) => f.endsWith( '.js' ) )
	.sort()
	.map( ( f ) => `\t<script src="/tests/unit/${ f }"></script>` )
	.join( '\n' );

export const baseConfig = {
	rootDir,
	nodeResolve: true,

	// A single placeholder entry so that WTR creates exactly one test
	// session.  The real test files are loaded via testRunnerHtml below.
	files: [ 'tests/browser-entry.js' ],

	testFramework: {
		path: resolve( testsDir, 'wtr-qunit-adapter.js' )
	},

	testRunnerHtml: ( testFramework ) => `<!DOCTYPE html>
<html>
<body>
	<div id="qunit"></div>
	<div id="qunit-fixture"></div>
	<script src="/node_modules/qunit/qunit/qunit.js"></script>
	<script>QUnit.config.autostart = false;</script>
	<script src="/dist/oojs.js"></script>
	<script src="/tests/setup-browser.js"></script>
${ testScriptTags }
	<script type="module" src="${ testFramework }"></script>
</body>
</html>`
};
