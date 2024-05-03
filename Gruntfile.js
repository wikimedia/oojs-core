/*!
 * Grunt file
 *
 * To use the automated Sauce Labs setup (as we do in Jenkins), set
 * the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables (either one-time
 * via export, or from your bashrc). Then, run 'grunt ci'.
 * Sign up for free at https://saucelabs.com/signup/plan/free.
 */

'use strict';

module.exports = function ( grunt ) {
	const concatFiles = [
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

	grunt.initConfig( {
		clean: {
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
			}
		},
		uglify: {
			options: {
				banner: '/*! OOjs v<%= build.version %> | License: MIT */',
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
		}
	} );

	grunt.registerTask( 'set-meta', () => {
		grunt.config.set( 'build.version', require( './package.json' ).version );
	} );

	grunt.registerTask( 'set-dev', () => {
		grunt.config.set( 'build.version', grunt.config( 'build.version' ) + '-dev' );
	} );

	grunt.registerTask( 'build-release', [ 'set-meta', 'clean', 'concat:release', 'uglify' ] );
	grunt.registerTask( 'build-dev', [ 'set-meta', 'set-dev', 'clean', 'concat:dev' ] );
};
