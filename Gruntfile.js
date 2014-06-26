/*!
 * Grunt file
 */

/*jshint node:true */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-concat' );
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-qunit-istanbul' );
	grunt.loadNpmTasks( 'grunt-jscs-checker' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		clean: {
			dist: 'dist/*'
		},
		concat: {
			options: {
				banner: grunt.file.read( 'src/banner.txt' )
			},
			oojs: {
				dest: 'dist/oojs.js',
				src: [
					'src/intro.js.txt',
					'src/core.js',
					'src/util.js',
					'src/EventEmitter.js',
					'src/Registry.js',
					'src/Factory.js',
					'src/export.js',
					'src/outro.js.txt'
				]
			},
			jquery: {
				dest: 'dist/oojs.jquery.js',
				src: [
					'src/intro.js.txt',
					'src/core.js',
					'src/util/jquery.js',
					'src/EventEmitter.js',
					'src/Registry.js',
					'src/Factory.js',
					'src/export.js',
					'src/outro.js.txt'
				]
			}
		},
		jshint: {
			options: {
				jshintrc: true
			},
			dev: [
				'*.js',
				'{src,test}/**/*.js'
			],
			dist: 'dist/**/*.js'
		},
		jscs: {
			dev: '<%= jshint.dev %>'
		},
		qunit: {
			options: {
				coverage: {
					src: [ 'dist/oojs.js', 'dist/oojs.jquery.js' ],
					instrumentedFiles: 'dist/tmp/coverage',
					htmlReport: 'dist/coverage',
					lcovReport: 'dist/lcov'
				}
			},
			all: [
				'test/index.html',
				'test/index.jquery.html'
			]
		},
		watch: {
			files: [
				'<%= jshint.dev %>',
				'<%= qunit.all %>',
				'.{jscsrc,jshintignore,jshintrc}'
			],
			tasks: 'test'
		}
	} );

	grunt.registerTask( 'git-build', function () {
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

	grunt.registerTask( 'build', [ 'clean', 'concat' ] );
	grunt.registerTask( 'test', [ 'git-build', 'build', 'jshint', 'jscs', 'qunit' ] );
	grunt.registerTask( 'default', 'test' );
};
