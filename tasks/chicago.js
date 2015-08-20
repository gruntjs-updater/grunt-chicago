/*
 * grunt-chicago
 * https://github.com/eriknielsen/grunt-chicago
 *
 * Copyright (c) 2015 Erik Nielsen
 * Licensed under the MIT license.
 */

'use strict';

if ( ! String.prototype.repeat ) {
	String.prototype.repeat = function(count) {
		'use strict';
		if (this == null) {
			throw new TypeError('can\'t convert ' + this + ' to object');
		}
		var str = '' + this;
		count = +count;
		if (count != count) {
			count = 0;
		}
		if (count < 0) {
			throw new RangeError('repeat count must be non-negative');
		}
		if (count == Infinity) {
			throw new RangeError('repeat count must be less than infinity');
		}
		count = Math.floor(count);
		if (str.length == 0 || count == 0) {
			return '';
		}
		if (str.length * count >= 1 << 28) {
			throw new RangeError('repeat count must not overflow maximum string size');
		}
		var rpt = '';
		for (;;) {
			if ((count & 1) == 1) {
				rpt += str;
			}
			count >>>= 1;
			if (count == 0) {
				break;
			}
			str += str;
		}
		return rpt;
	}
}

var path = require('path');

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('chicago', 'Grunt plugin to handle JavaScript file imports', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			punctuation: '.',
			separator: ', '
		});

		var files = {},
			root = process.cwd();

		// Iterate over all specified file groups.
		this.files.forEach(function(f) {

			f.src.filter(function(filepath) {
				if ( ! grunt.file.exists( filepath ) ) {
					return false;
				} else {
					return true;
				}
			}).map(function(filepath) {
				var abspath = path.resolve( root, filepath );
				if( grunt.file.isDir( filepath ) ) {
					grunt.file.recurse( filepath, function( abspath, rootdir, subdir, filename ) {
						if( ! files[ abspath ] ) {
							var _abspath = path.resolve( root, abspath );
							files[ abspath ] = {
								file : abspath,
								path : _abspath,
								folder : path.dirname( _abspath ),
							};
						}
					});
				} else {
					if( ! files[ filepath ] ) {
						files[ filepath ] = {
							file : filepath,
							path : abspath,
							folder : path.dirname( abspath ),
						};
					}
				}
			});
		});

		for( var key in files ) {
			var object = files[ key ],
				content = grunt.file.read( object.path );
			if( content.indexOf( '// @import' ) < 0 ) {
				continue;
			}
			var contentArray = content.split( '\n' );
			var outputArray = [];
			for( var i = 0; i < contentArray.length; i++ ) {
				var line = contentArray[i];
				if( line.indexOf( '// @import' ) < 0 ) {
					outputArray.push( line );
					continue;
				}
				var tabCount = (line.match(/\t/g) || []).length;
				var importFile = line
					.split('// @import')[1]
					.trim()
					.replace(/"/g, '')
					.replace(/'/g, '')
					.replace(/;/g, '')
					.trim();
				var importPath = path.normalize( path.resolve( object.folder, importFile ) ),
					importPathShort = importPath.replace( path.dirname( object.folder ) + '/', '' );
				if( ! grunt.file.exists( importPath ) || ! grunt.file.isFile( importPath ) ) {
					grunt.log.warn( "Unable to import " + importPathShort + " into " + object.file + " - File not found." );
					outputArray.push( line );
					continue;
				}
				grunt.log.ok( "Importing " + importPathShort + " into " + object.file + "." );
				var importContent = grunt.file.read( importPath );
				var importArray = importContent.split('\n');
				for( var _i = 0; _i < importArray.length; _i++ ) {
					outputArray.push( '\t'.repeat(tabCount) + importArray[_i] );
				}
			}
			var outputContent = outputArray.join( '\n' );
			grunt.file.write( object.path, outputContent );
		}
	});

};
