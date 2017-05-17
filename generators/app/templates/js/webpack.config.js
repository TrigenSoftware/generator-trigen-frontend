/**
 * Webpack configs.
 */

/**
 * Imports
 */

import webpack                    from 'webpack';
import WebpackBabiliPlugin        from 'babili-webpack-plugin';
import WebpackChunkHash           from 'webpack-chunk-hash';
import WebpackManifestPlugin      from 'webpack-manifest-plugin';
import WebpackChunkManifsetPlugin from 'chunk-manifest-webpack-plugin';
import update                     from 'immutability-helper';
import path                       from 'path';
import pkg                        from './package.json';

const defaultRoot  = process.env.WEBPACK_ROOT  || './src/app';
const defaultEntry = process.env.WEBPACK_ENTRY || './src/app/main.js';
const defaultDest  = process.env.WEBPACK_DEST  || './dist/app';

const config = configure({
	root:  defaultRoot,
	entry: defaultEntry,
	dest:  defaultDest
});

/**
 * Exports
 */

Reflect.defineProperty(config, 'dev', { value: configureDev });
Reflect.defineProperty(config, 'build', { value: configureBuild });

export default config;

/**
 * Configurators
 */

function configure({ root, entry, dest, publicPath: _publicPath }) {

	const entries = Array.isArray(entry)
		? entry
		: [entry];

	let publicPath = _publicPath;

	if (typeof publicPath != 'string') {
		publicPath = path.join('/', path.basename(dest), '/');
	}

	return {
		entry:   entries.map(_ => path.resolve(_)),
		output:  {
			path:             path.resolve(__dirname, dest),
			filename:         '[name].js',
			chunkFilename:    '[name].js',
			hashDigestLength: 10,
			publicPath
		},
		resolve: {
			alias: {
				'~': path.join(__dirname, root)
			}
		},
		module:  {
			rules: [{
				test:    /\.js$/,
				exclude: /node_modules/,
				loader:  'babel-loader',
				query:   update(pkg.babel, {
					babelrc: { $set: false },
					presets: {
						0: { 1: { modules: { $set: false } } }
					}
				})
			}]
		},
		plugins: []
	};
}

function configureDev(params) {
	return update(configure(params), {
		devtool: { $set: 'cheap-module-eval-source-map' },
		plugins: { $push: [
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': `'development'`
				}
			}),
			new webpack.NamedModulesPlugin(),
			new webpack.NoEmitOnErrorsPlugin()
		] }
	});
}

function configureBuild(params) {

	const config = configure(params);

	return update(config, {
		output:  {
			filename:      { $set: '[name]-[chunkhash].js' },
			chunkFilename: { $set: '[name]-[chunkhash].js' }
		},
		plugins: { $push: [
			new webpack.optimize.CommonsChunkPlugin({
				name:      ['loader'],
				minChunks: Infinity,
			}),
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': `'production'`
				}
			}),
			new webpack.HashedModuleIdsPlugin(),
			new WebpackChunkHash(),
			new WebpackManifestPlugin({
				fileName: 'rev-manifest.json',
				basePath: config.publicPath
			}),
			new WebpackChunkManifsetPlugin({
				filename: 'webpack-manifest.json'
			}),
			new WebpackBabiliPlugin()
		] }
	});
}
