const path = require( 'path' );
const fs = require( 'fs-extra' );
const rollup = require( 'rollup' );
const babel = require( 'rollup-plugin-babel' );
const nodeResolve = require( 'rollup-plugin-node-resolve' );
const { minify } = require( 'terser' );

const header = `/* @agilo/font-loader a lightweight font loader
Copyright (C) 2018 Agilo Ltd

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License along
with this program; if not, write to the Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
*/`;

const terserOptions = {
	sourceMap: false,
	mangle: {
		// Pass true to work around the Safari 10 loop iterator bug "Cannot
		// declare a let variable twice".
		// https://bugs.webkit.org/show_bug.cgi?id=171041
		safari10: true,
	},
	// Set this option to true to work around the Safari 10/11 await bug.
	// https://bugs.webkit.org/show_bug.cgi?id=176685
	output: {
		safari10: true,
		preamble: header,
	},
};

/**
 * Chunk transformer function called for each Rollup output chunk file.
 * @param {string} source Source code.
 * @return {Object}
 */
const transformChunk = function(source) {
	const result = minify(source, terserOptions);

	if (result.error) {
		throw result.error;
	}

	return result;
};

const rollupMinify = function() {
	return {
		name: 'minify',
		transformChunk: transformChunk,
	};
};


const inputOptions = {
	input: path.resolve( __dirname, '../src/index.js' ),
};

async function esBuild() {
	const outputOptions = {
		file: path.resolve( __dirname, '../dist/font-loader.es.js' ),
		format: 'esm',
		banner: header,
	};

	const bundle = await rollup.rollup( Object.assign(
		{},
		inputOptions
	) );

	await bundle.generate( outputOptions );
	await bundle.write( outputOptions );
};

async function esMinBuild() {
	const outputOptions = {
		file: path.resolve( __dirname, '../dist/font-loader.es.min.js' ),
		format: 'esm',
	};

	const bundle = await rollup.rollup( Object.assign(
		{},
		inputOptions,
		{
			plugins: [
				rollupMinify(),
			]
		}
	) );

	await bundle.generate( outputOptions );
	await bundle.write( outputOptions );
};

async function iifeBuild() {
	const outputOptions = {
		file: path.resolve( __dirname, '../dist/font-loader.js' ),
		format: 'iife',
		name: 'FontLoader',
		banner: header,
	};

	const bundle = await rollup.rollup( Object.assign(
		{},
		inputOptions,
		{
			plugins: [
				nodeResolve( {
					// some package.json files have a `browser` field which
					// specifies alternative files to load for people bundling
					// for the browser. If that's you, use this option, otherwise
					// pkg.browser will be ignored
					browser: true,
					extensions: [ '.mjs', '.js', '.json' ],
					customResolveOptions: {
						moduleDirectory: 'node_modules',
					},
				} ),
				babel( {
					presets: [
						[
							'@babel/preset-env',
							{
								modules: false,
								useBuiltIns: 'usage',
								ignoreBrowserslistConfig: true,
								targets: 'last 2 versions, > 1%, ie >= 9',
							}
						]
					]
				} ),
			]
		}
	) );

	await bundle.generate( outputOptions );
	await bundle.write( outputOptions );
};

async function iifeMinBuild() {
	const outputOptions = {
		file: path.resolve( __dirname, '../dist/font-loader.min.js' ),
		format: 'iife',
		name: 'FontLoader',
	};

	const bundle = await rollup.rollup( Object.assign(
		{},
		inputOptions,
		{
			plugins: [
				nodeResolve( {
					// some package.json files have a `browser` field which
					// specifies alternative files to load for people bundling
					// for the browser. If that's you, use this option, otherwise
					// pkg.browser will be ignored
					browser: true,
					extensions: [ '.mjs', '.js', '.json' ],
					customResolveOptions: {
						moduleDirectory: 'node_modules',
					},
				} ),
				babel( {
					presets: [
						[
							'@babel/preset-env',
							{
								modules: false,
								useBuiltIns: 'usage',
								ignoreBrowserslistConfig: true,
								targets: 'last 2 versions, > 1%, ie >= 9',
							}
						]
					]
				} ),
				rollupMinify(),
			]
		}
	) );

	await bundle.generate( outputOptions );
	await bundle.write( outputOptions );
};

console.log( 'Building...' );

fs.ensureDir( path.resolve( __dirname, '../dist' ) )
	.then( () => fs.emptyDir( path.resolve( __dirname, '../dist' ) ) )
	.then( () => Promise.all( [
		esBuild(),
		esMinBuild(),
		iifeBuild(),
		iifeMinBuild(),
	] ) )
	.then( () => console.log( 'Done.' ) );
