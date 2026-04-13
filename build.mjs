/**
 * Build script for OOjs.
 *
 * Replaces Gruntfile.js. Concatenates source files into dist/oojs.js
 * with a version-stamped banner.
 *
 * Usage:
 *   node build.mjs dev      – concat with source map (for development)
 *   node build.mjs release  – concat + minify (for npm publish)
 */

import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'fs';

const sourceFiles = [
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

const mode = process.argv[ 2 ];
if ( mode !== 'dev' && mode !== 'release' ) {
	throw new Error( 'Usage: node build.mjs <dev|release>' );
}

const pkg = JSON.parse( readFileSync( 'package.json', 'utf8' ) );
const version = mode === 'dev' ? pkg.version + '-dev' : pkg.version;

const banner = readFileSync( 'src/banner.txt', 'utf8' )
	.replace( '<%= build.version %>', version );

// Clean
rmSync( 'dist', { recursive: true, force: true } );
rmSync( 'coverage', { recursive: true, force: true } );
mkdirSync( 'dist', { recursive: true } );

// Read and concatenate source files (joined with \n, matching
// the former grunt-contrib-concat default separator).
const contents = sourceFiles.map( ( f ) => readFileSync( f, 'utf8' ) );
const code = banner + contents.join( '\n' );

if ( mode === 'dev' ) {
	writeFileSync( 'dist/oojs.js', code + '\n//# sourceMappingURL=oojs.js.map' );
	writeFileSync( 'dist/oojs.js.map', generateSourceMap( contents ) );
	console.log( 'Built dist/oojs.js (dev, with source map).' );
} else {
	writeFileSync( 'dist/oojs.js', code );

	const { minify } = await import( 'terser' );
	const result = await minify( { 'oojs.js': code }, {
		sourceMap: {
			filename: 'oojs.min.js',
			url: 'oojs.min.js.map',
			includeSources: true
		},
		format: {
			preamble: '/*! OOjs v' + version + ' | License: MIT */'
		}
	} );
	writeFileSync( 'dist/oojs.min.js', result.code );
	writeFileSync( 'dist/oojs.min.js.map', result.map );
	console.log( 'Built dist/oojs.js + dist/oojs.min.js (release).' );
}

/**
 * Generate a source map for the concatenated dev build.
 *
 * Each output line maps 1:1 to the corresponding source line.
 * Banner lines and separator lines between files are unmapped.
 *
 * @param {string[]} fileContents Contents of each source file
 * @return {string} JSON source map
 */
function generateSourceMap( fileContents ) {
	const bannerLineCount = banner.split( '\n' ).length - 1;
	const mappingLines = [];

	// Empty mappings for banner lines
	for ( let i = 0; i < bannerLineCount; i++ ) {
		mappingLines.push( '' );
	}

	let prevSourceIdx = 0;
	let prevOrigLine = 0;

	for ( let fileIdx = 0; fileIdx < fileContents.length; fileIdx++ ) {
		const lines = fileContents[ fileIdx ].split( '\n' );
		// Files ending with \n produce an empty trailing element after split
		const lineCount = lines[ lines.length - 1 ] === '' ?
			lines.length - 1 : lines.length;

		for ( let line = 0; line < lineCount; line++ ) {
			const sourceIdxDelta = fileIdx - prevSourceIdx;
			const origLineDelta = line === 0 ? -prevOrigLine : 1;

			mappingLines.push(
				vlqEncode( 0 ) +
				vlqEncode( sourceIdxDelta ) +
				vlqEncode( origLineDelta ) +
				vlqEncode( 0 )
			);

			prevSourceIdx = fileIdx;
			prevOrigLine = line;
		}

		// Unmapped separator line between files
		if ( fileIdx < fileContents.length - 1 ) {
			mappingLines.push( '' );
		}
	}

	return JSON.stringify( {
		version: 3,
		file: 'oojs.js',
		sources: sourceFiles.map( ( f ) => '../' + f ),
		sourcesContent: fileContents,
		mappings: mappingLines.join( ';' )
	} );
}

/**
 * Encode an integer as a Base64 VLQ segment, per the source map v3 spec.
 *
 * @param {number} value
 * @return {string}
 */
/* eslint-disable no-bitwise */
function vlqEncode( value ) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	let vlq = value < 0 ? ( -value << 1 ) | 1 : value << 1;
	let encoded = '';
	do {
		let digit = vlq & 0x1f;
		vlq >>>= 5;
		if ( vlq > 0 ) {
			digit |= 0x20;
		}
		encoded += chars[ digit ];
	} while ( vlq > 0 );
	return encoded;
}
/* eslint-enable no-bitwise */
