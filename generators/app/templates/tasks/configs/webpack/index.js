/**
 * Webpack configs.
 */
<%

const webpackLoadersExist = Boolean(webpackLoaders.length);

function printWebpackReducers(env) {
	
	const loaders = webpackLoaders
		.map(_ => `${_}Loader.${env}`)
		.join(', ');

	return `[${loaders}]`;
}

%>
import webpack                    from 'webpack';
import WebpackBabelMinifyPlugin   from 'babel-minify-webpack-plugin';
import WebpackManifestPlugin      from 'webpack-manifest-plugin';
import WebpackChunkManifsetPlugin from 'chunk-manifest-webpack-plugin';
import update                     from 'immutability-helper';
import path                       from 'path';
import stringifyValues            from '../helpers/stringify-values';
import findIndex                  from '../helpers/find-index';<% if (webpackLoadersExist) { %>
import applyReducers              from '../helpers/apply-reducers';<% } %>
import pkg                        from '../../package.json';<% if (webpackLoaders.includes('sass')) { %>
import * as sassLoader            from './sass-loader';<% } %><% if (webpackLoaders.includes('svg')) { %>
import * as svgLoader             from './svg-loader';<% } %>

const cwd = process.cwd();

function base({
	root, entry, dest,
	publicPath: _publicPath
}) {

	const entries = Array.isArray(entry)
		? entry
		: [entry];

	const { babel } = pkg;

	let publicPath = _publicPath;

	if (typeof publicPath != 'string') {
		publicPath = path.join('/', path.basename(dest), '/');
	}

	return <% if (webpackLoadersExist) {
		%>applyReducers(<%- printWebpackReducers('base') %>, <%
	} %>{
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
				test:   /\.js$/,
				parser: {
					amd: false
				}
			}, {
				test:    /\.js$/,
				exclude: /node_modules/,
				loader:  'babel-loader',
				query:   update(babel, {
					babelrc: { $set: false },
					presets: {
						[findIndex(0, 'env', babel.presets)]: {
							1: {
								modules: { $set: false }
							}
						}
					}
				})
			}]
		},
		plugins: []
	}<% if (webpackLoadersExist) { %>)<% } %>;
}

export function dev(params) {

	const config = base(params),
		{ rules } = config.module;

	return <% if (webpackLoadersExist) {
		%>applyReducers(<%- printWebpackReducers('dev') %>, <%
	} %>update(config, {<% if (projectType == 'reactjs') { %>
		entry:   { $unshift: [
			'react-hot-loader/patch',
			'webpack-hot-middleware/client?http://localhost:3000/&reload=true'
		] },<% } %>
		devtool: { $set: 'cheap-module-eval-source-map' },<% if (projectType == 'reactjs') { %>
		module:  {
			rules: {
				[findIndex('loader', 'babel-loader', rules)]: {
					query: {
						plugins: { $unshift: ['react-hot-loader/babel'] }
					}
				}
			}
		},<% } %>
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
	})<% if (webpackLoadersExist) { %>)<% } %>;
}

export function build(params) {

	const config = base(params);

	return <% if (webpackLoadersExist) {
		%>applyReducers(<%- printWebpackReducers('build') %>, <%
	} %>update(config, {
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
	})<% if (webpackLoadersExist) { %>)<% } %>;
}
