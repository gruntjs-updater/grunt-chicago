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

	grunt.registerMultiTask('chicago', 'Grunt plugin to handle JavaScript file imports', function() {
		var options = this.options({
			always_write : true,
		});

		var files = {},
			root = process.cwd();

		this.files.forEach(function(f) {

			f.src.filter(function(filepath) {

				if ( ! grunt.file.exists( filepath ) || ! grunt.file.isFile( filepath ) ) {
					return false;
				} else {
					return true;
				}

			}).map(function(filepath) {

				var abspath = path.resolve( root, filepath );

				if( ! f.dest || f.dest == 'src' ) {
					f.dest = filepath
				}

				if( ! files[ filepath ] ) {
					files[ filepath ] = {
						file : filepath,
						path : abspath,
						folder : path.dirname( abspath ),
						dest : f.dest,
					};
				}
			});
		});

		for( var key in files ) {
			var object = files[ key ],
				content = grunt.file.read( object.path );
			if( content.indexOf( '// @import' ) < 0 ) {
				if( options.always_write && object.file != object.dest ) {
					grunt.log.warn( "No imports found - Writing " + object.file + " to " + object.dest + "." );
					grunt.file.write( object.dest, content );
				}
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
			grunt.log.ok( "Writing file to " + object.dest + "." );
			grunt.file.write( object.dest, outputContent );
		}
	});

};
