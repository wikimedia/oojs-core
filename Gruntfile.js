/*!
 * Grunt file
 *
 * @package OOJS
 */

/*jshint node:true */
module.exports = function ( grunt ) {
	grunt.loadNpmTasks( 'grunt-contrib-jshint' );
	grunt.loadNpmTasks( 'grunt-contrib-qunit' );
	grunt.loadNpmTasks( 'grunt-contrib-watch' );

	grunt.initConfig({
		jshint: {
			all: ['*.js', 'src/*.js', 'test/*.js']
		},
		qunit: {
			all: ['test/index.html']
		},
		watch: {
			all: {
				files: ['<%= jshint.all %>'],
				tasks: ['test']
			}
		}
	});

	grunt.registerTask( 'test', ['jshint', 'qunit'] );
	grunt.registerTask( 'default', ['test'] );
};
