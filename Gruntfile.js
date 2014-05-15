/*!
 * Grunt file
 */

/*jshint node:true */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );
	grunt.loadNpmTasks( 'grunt-jscs-checker' );

	grunt.initConfig( {
		pkg: grunt.file.readJSON( 'package.json' ),
		build: {
			all: {
				dest: 'dist/oojs.js',
				src: [
					'src/intro.js.txt',
					'src/core.js',
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
				jshintrc: '.jshintrc'
			},
			dev: [ '*.js', '{src,test}/**/*.js' ],
			dist: 'dist/**/*.js'
		},
		jscs: {
			dev: '<%= jshint.dev %>'
		},
		qunit: {
			all: 'test/index.html'
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

	grunt.registerMultiTask( 'build', function () {
		var isBad = false,
			compiled = '',
			name = this.data.dest,
			src = this.data.src,
			version = grunt.config( 'pkg.version' );

		src.forEach( function ( filepath ) {
			var text = grunt.file.read( filepath );

			// Ensure files use only \n for line endings, not \r\n
			if ( /\x0d\x0a/.test( text ) ) {
				grunt.log.error( filepath + ': Incorrect line endings (\\r\\n)' );
				isBad = true;
			}

			compiled += text;
		} );

		if ( isBad ) {
			return false;
		}

		// Replace version and date placeholders
		compiled = compiled
			.replace( /@VERSION/g, version )
			.replace( /@DATE/g, new Date() );

		grunt.file.write( name, compiled );

		// Fail task if errors were logged.
		if ( this.errorCount ) {
			return false;
		}

		grunt.log.ok( 'File "' + name + '" created.' );
	} );

	grunt.registerTask( 'test', [ 'git-build', 'build', 'jshint', 'jscs', 'qunit' ] );
	grunt.registerTask( 'default', 'test' );
};
