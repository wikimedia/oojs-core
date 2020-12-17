/*!
 * Grunt file
 *
 * To use the automated Sauce Labs setup (as we do in Jenkins), set
 * the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables (either one-time
 * via export, or from your bashrc). Then, run 'grunt ci'.
 * Sign up for free at https://saucelabs.com/signup/plan/free.
 */

/* eslint-env node, es6 */
module.exports = function ( grunt ) {
	var customLaunchers = require( './tests/karma.browsers.js' ),
		concatFiles = [
			'src/intro.js.txt',
			'src/core.js',
			'src/util.js',
			'src/EventEmitter.js',
			'src/EmitterList.js',
			'src/SortedEmitterList.js',
			'src/Registry.js',
			'src/Factory.js',
			'src/export.js',
			'src/outro.js.txt'
		];

	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-uglify' );
	grunt.loadNpmTasks( 'grunt-jsdoc' );
	grunt.loadNpmTasks( 'grunt-karma' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		clean: {
			docs: [ 'docs/' ],
			dist: [ 'dist', 'coverage' ]
		},
		concat: {
			release: {
				options: {
					banner: grunt.file.read( 'src/banner.txt' )
				},
				dest: 'dist/oojs.js',
				src: concatFiles
			},
			dev: {
				options: {
					banner: grunt.file.read( 'src/banner.txt' ),
					sourceMap: true
				},
				dest: 'dist/oojs.js',
				src: concatFiles
			},
			releasejquery: {
				options: {
					banner: grunt.file.read( 'src/banner.jquery.txt' )
				},
				dest: 'dist/oojs.jquery.js',
				src: [
					'src/intro.js.txt',
					'src/core.js',
					'src/util/jquery.js',
					'src/EventEmitter.js',
					'src/EmitterList.js',
					'src/SortedEmitterList.js',
					'src/Registry.js',
					'src/Factory.js',
					'src/export.js',
					'src/outro.js.txt'
				]
			}
		},
		uglify: {
			options: {
				banner: '/*! OOjs v<%= pkg.version %> | https://oojs.mit-license.org */',
				sourceMap: true,
				sourceMapIncludeSources: true,
				report: 'gzip'
			},
			js: {
				expand: true,
				src: 'dist/*.js',
				ext: '.min.js',
				extDot: 'last'
			}
		},
		jsdoc: {
			all: {
				options: {
					configure: '.jsdoc.json'
				}
			}
		},
		karma: {
			options: {
				frameworks: [ 'qunit' ],
				files: [
					'dist/oojs.js',
					'tests/testrunner.js',
					'tests/unit/*.js'
				],
				reporters: [ 'dots' ],
				singleRun: true,
				autoWatch: false,
				customLaunchers: customLaunchers,
				sauceLabs: {
					username: process.env.SAUCE_USERNAME || 'oojs',
					accessKey: process.env.SAUCE_ACCESS_KEY || '0e464279-3f2a-4ca0-9eb4-db220410bef0',
					recordScreenshots: false
				},
				captureTimeout: 90000
			},
			saucelabs: {
				browsers: [
					// Latest versions of major browsers
					'slChromeLatest',
					'slFirefoxLatest',
					'slEdgeLatest',
					// Only supported version of Internet Explorer
					'slIE11',
					'slSafariLatest',
					// Earliest supported version of Safari
					'slSafari12'
				]
			},
			// Primary unit test run (includes code coverage)
			main: {
				browsers: [ 'ChromeCustom' ],
				preprocessors: {
					'dist/*.js': [ 'coverage' ]
				},
				reporters: [ 'dots', 'coverage', 'karma-remap-istanbul' ],
				coverageReporter: {
					// https://github.com/karma-runner/karma-coverage/blob/v1.1.1/docs/configuration.md#check
					type: 'in-memory',
					check: { global: {
						functions: 100,
						statements: 99,
						branches: 99,
						lines: 99
					} }
				},
				remapIstanbulReporter: {
					reports: {
						'text-summary': null,
						html: 'coverage/',
						lcovonly: 'coverage/lcov.info',
						clover: 'coverage/clover.xml'
					}
				}
			},
			jquery: {
				browsers: [ 'ChromeCustom' ],
				options: {
					files: [
						'node_modules/jquery/dist/jquery.js',
						'dist/oojs.jquery.js',
						'tests/testrunner.js',
						'tests/unit/*.js'
					]
				}
			},
			firefox: {
				browsers: [ 'FirefoxHeadless' ]
			}
		}
	} );

	grunt.registerTask( 'set-pre-version', function () {
		var done = this.async();
		require( 'child_process' ).exec( 'git rev-parse HEAD', function ( err, stout, stderr ) {
			if ( !stout || err || stderr ) {
				grunt.log.err( err || stderr );
				done( false );
				return;
			}
			grunt.config.set( 'pkg.version', grunt.config( 'pkg.version' ) + '-pre (' + stout.slice( 0, 10 ) + ')' );
			grunt.verbose.writeln( 'Added git HEAD to pgk.version' );
			done();
		} );
	} );

	grunt.registerTask( 'build-release', [ 'clean', 'concat:release', 'concat:releasejquery', 'uglify' ] );
	grunt.registerTask( 'build-dev', [ 'set-pre-version', 'clean', 'concat:dev', 'concat:releasejquery' ] );
	grunt.registerTask( '_test', [ 'build-dev', 'karma:main', 'karma:jquery', 'karma:firefox', 'doc' ] );
	grunt.registerTask( 'doc', [ 'clean:docs', 'jsdoc' ] );
	grunt.registerTask( 'ci', [ '_test', 'karma:saucelabs' ] );

	if ( process.env.ZUUL_PIPELINE === 'gate-and-submit' ) {
		// During the merge pipeline, also include the cross-platform tests via SauceLabs
		grunt.registerTask( 'test', 'ci' );
	} else {
		grunt.registerTask( 'test', '_test' );
	}
};
