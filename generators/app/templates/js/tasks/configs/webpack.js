/**
 * Webpack configs.
 */

import webpack                    from 'webpack';
import WebpackBabiliPlugin        from 'babili-webpack-plugin';
import WebpackChunkHash           from 'webpack-chunk-hash';
import WebpackManifestPlugin      from 'webpack-manifest-plugin';
import WebpackChunkManifsetPlugin from 'chunk-manifest-webpack-plugin';
import update                     from 'immutability-helper';
import path                       from 'path';
import pkg                        from '../../package.json';

const cwd = process.cwd();

function configure({ root, entry, dest, publicPath: _publicPath }) {

	const entries = Array.isArray(entry)
		? entry
		: [entry];

	let publicPath = _publicPath;

	if (typeof publicPath != 'string') {
		publicPath = path.join('/', path.basename(dest), '/');
	}

	return {
		entry:   entries.map(_ => path.join(cwd, _)),
		output:  {
			path:             path.join(cwd, dest),
			filename:         '[name].js',
			chunkFilename:    '[name].js',
			hashDigestLength: 10,
			publicPath
		},
		resolve: {
			alias: {
				'~': path.join(cwd, root)
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

export function dev(params) {
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

export function build(params) {

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
