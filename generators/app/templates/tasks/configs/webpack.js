/**
 * Webpack configs.
 */

import webpack                    from 'webpack';
import WebpackBabelMinifyPlugin   from 'babel-minify-webpack-plugin';
import WebpackManifestPlugin      from 'webpack-manifest-plugin';
import WebpackChunkManifsetPlugin from 'chunk-manifest-webpack-plugin';
import update                     from 'immutability-helper';
import path                       from 'path';
import stringifyValues            from '../helpers/stringify-values';
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
			rules: [[{
				test:   /\.js$/,
				parser: {
					amd: false
				}
			}, {
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
	return update(configure(params), {<% if (projectType == 'reactjs') { %>
		entry:   { $unshift: [
			'react-hot-loader/patch',
			'webpack-hot-middleware/client?http://localhost:3000/&reload=true'
		] },<% } %>
		devtool: { $set: 'cheap-module-eval-source-map' },<% if (projectType == 'reactjs') { %>
		module:  { rules: {
			1: { query: { plugins: { $unshift: ['react-hot-loader/babel'] } } }
		} },<% } %>
		plugins: { $push: [
			new webpack.DefinePlugin({
				'process.env': {
					...stringifyValues(process.env),
					'NODE_ENV': `'development'`
				}
			}),<% if (projectType == 'reactjs') { %>
			new webpack.HotModuleReplacementPlugin(),<% } %>
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
			new webpack.DefinePlugin({
				'process.env': {
					...stringifyValues(process.env),
					'NODE_ENV': `'production'`
				}
			}),
			new webpack.HashedModuleIdsPlugin(),
			new WebpackManifestPlugin({
				fileName: 'rev-manifest.json',
				basePath: config.publicPath
			}),
			new WebpackChunkManifsetPlugin({
				filename: 'webpack-manifest.json'
			}),
			new WebpackBabelMinifyPlugin(),
			new webpack.optimize.CommonsChunkPlugin({
				name:      'main',
				children:  true,
				async:     true,
				minChunks: 2
			}),
			new webpack.optimize.CommonsChunkPlugin({
				name:      'loader',
				minChunks: Infinity
			})
		] }
	});
}
