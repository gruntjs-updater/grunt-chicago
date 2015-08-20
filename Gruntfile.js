/*
 * grunt-chicago
 * https://github.com/eriknielsen/grunt-chicago
 *
 * Copyright (c) 2015 Erik Nielsen
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

	grunt.initConfig({
		jshint: {
			all: [
			'Gruntfile.js',
			'tasks/*.js',
			'<%= nodeunit.tests %>'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		clean: {
			tests: ['tmp']
		},

		chicago: {
			default_options : {
				// files : {
				// 	src : [ 'tmp/test.js', 'tmp' ]
				// }
				files: [{
					expand: true,
					cwd: 'tmp',
					src: [ '*.js', '!*.min.js' ],
					dest: 'dist',
					ext: '.js',
					extDot : 'last'
				}]
			},
		},

		nodeunit: {
			tests: ['test/*_test.js']
		}

	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');

	grunt.registerTask('test', ['clean', 'chicago', 'nodeunit']);

	grunt.registerTask('default', ['jshint', 'test']);

};
