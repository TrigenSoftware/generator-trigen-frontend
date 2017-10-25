/**
 * Webpack configs.
 */
<%

if (gulpTasks.includes('offline')) {
	webpackLoaders.push('sw');
}

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
import { decamelize }             from 'humps';
import findIndex                  from '../../helpers/find-index';<% if (webpackLoadersExist) { %>
import applyReducers              from '../../helpers/apply-reducers';<% } %>
import pkg                        from '../../../package.json';<% if (webpackLoaders.includes('sass')) { %>
import * as sassLoader            from './sass-loader';<% } %><% if (webpackLoaders.includes('svg')) { %>
import * as svgLoader             from './svg-loader';<% } %><% if (webpackLoaders.includes('sw')) { %>
import * as swLoader              from './sw-loader';<% } %>

const cwd = process.cwd();

function defaultParams(params) {
	return {
		buildRoot:  params.outputPath,
		publicPath: '/',
		envify:     {},
		...params
	};
}

function base(inputParams) {

	const params = defaultParams(inputParams);

	const {
		appRoot, entries,
		buildRoot, outputPath,
		publicPath, envify
	} = params;

	const { babel } = pkg;

	return <% if (webpackLoadersExist) {
		%>applyReducers(<%- printWebpackReducers('base') %>, params, <%
	} %>{
		entry:    Object.entries(entries).reduce((entry, [name, src]) => ({
			...entry,
			[name]: path.resolve(cwd, src)
		}), {}),
		output:  {
			path:             path.resolve(cwd, outputPath),
			filename:         '[name].js',
			chunkFilename:    '[name].js',
			hashDigestLength: 10,
			publicPath
		},
		resolve: {
			alias: {
				'~': path.resolve(cwd, appRoot)
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
		plugins: [
			new webpack.DefinePlugin(
				Object.entries(envify).reduce((env, [key, value]) => ({
					...env,
					[`process.env.${decamelize(key).toUpperCase()}`]: JSON.stringify(value)
				}) , {})
			)
		]
	}<% if (webpackLoadersExist) { %>)<% } %>;
}

export function dev(inputParams) {

	const params = defaultParams(inputParams),
		config = base(params),
		{ rules } = config.module;

	return <% if (webpackLoadersExist) {
		%>applyReducers(<%- printWebpackReducers('dev') %>, params, <%
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
			new webpack.EnvironmentPlugin(Object.keys(process.env)),<% if (projectType == 'reactjs') { %>
			new webpack.HotModuleReplacementPlugin(),<% } %>
			new webpack.NamedModulesPlugin(),
			new webpack.NoEmitOnErrorsPlugin()
		] }
	})<% if (webpackLoadersExist) { %>)<% } %>;
}

export function build(inputParams) {

	const params = defaultParams(inputParams),
		config = base(params);

	return <% if (webpackLoadersExist) {
		%>applyReducers(<%- printWebpackReducers('build') %>, params, <%
	} %>update(config, {
		output:  {
			filename:      { $set: '[name].[chunkhash].js' },
			chunkFilename: { $set: '[name].[chunkhash].js' }
		},
		plugins: { $push: [
			new webpack.EnvironmentPlugin(Object.keys(process.env)),
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
