/**
 * QUnit adapter for @web/test-runner.
 *
 * Bridges QUnit's event API to Web Test Runner's session lifecycle so that
 * WTR can collect per-test results, detect failures, and enforce timeouts.
 *
 * Loaded as a module script (`type="module"`) after QUnit and the test files
 * have been parsed.  QUnit.config.autostart must be set to false before this
 * script runs so that tests wait for QUnit.start() below.
 */

import {
	sessionStarted,
	sessionFinished,
	sessionFailed
} from '@web/test-runner-core/browser/session.js';

try {
	sessionStarted();

	const suiteMap = new Map();

	QUnit.on( 'testEnd', ( testEnd ) => {
		const moduleName = testEnd.fullName.length > 1 ? testEnd.fullName[ 0 ] : '';

		if ( !suiteMap.has( moduleName ) ) {
			suiteMap.set( moduleName, [] );
		}

		const result = {
			name: testEnd.name,
			passed: testEnd.status === 'passed' || testEnd.status === 'todo',
			skipped: testEnd.status === 'skipped',
			duration: testEnd.runtime
		};

		if ( testEnd.status === 'failed' ) {
			const err = testEnd.errors[ 0 ];
			if ( err ) {
				result.error = {
					message: err.message || 'Test failed',
					stack: err.stack || '',
					expected: JSON.stringify( err.expected ),
					actual: JSON.stringify( err.actual )
				};
			}
		}

		suiteMap.get( moduleName ).push( result );
	} );

	QUnit.on( 'runEnd', ( runEnd ) => {
		const suites = [];
		for ( const [ name, tests ] of suiteMap ) {
			suites.push( { name, suites: [], tests } );
		}

		sessionFinished( {
			passed: runEnd.status === 'passed',
			errors: [],
			testResults: {
				name: 'QUnit',
				suites,
				tests: []
			}
		} );
	} );

	QUnit.start();
} catch ( err ) {
	sessionFailed( err );
}
