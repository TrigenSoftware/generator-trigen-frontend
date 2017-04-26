/**
 * Webpack configs.
 */

/**
 * Requirements
 */

const webpack = require('webpack'),
	WebpackBabiliPlugin = require('babili-webpack-plugin'),

	update = require('immutability-helper'),
	path = require('path'),

	pkg = require('./package.json'),

	defaultEntry = process.env.WEBPACK_ENTRY || './src/app/main.js',
	defaultDest  = process.env.WEBPACK_OUTPUT_PATH || './dist/app',

	config = configure(defaultEntry, defaultDest);

/**
 * Exports
 */

Reflect.defineProperty(config, 'dev', { value: configureDev });
Reflect.defineProperty(config, 'build', { value: configureBuild });

module.exports = config;

/**
 * Configurators
 */

function configure(entry, dest, _publicPath) {

	const entries = Array.isArray(entry)
		? entry
		: [entry];

	let publicPath = _publicPath;

	if (typeof publicPath != 'string') {
		publicPath = path.join(path.basename(dest), '/');
	}

	return {
		entry:   entries.map(_ => path.resolve(_)),
		output:  {
			path:     path.resolve(__dirname, dest),
			filename: '[name].js',
			publicPath
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

function configureDev(entry, dest, publicPath) {
	return update(configure(entry, dest, publicPath), {
		entry:   { $push: [
			'react-hot-loader/patch',
			'webpack-hot-middleware/client?http://localhost:3000/'
		] },
		devtool: { $set: 'cheap-module-eval-source-map' },
		module:  { rules: { 0: { query: { plugins: { $unshift: ['react-hot-loader/babel'] } } } } },
		plugins: { $push: [
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': `'development'`
				}
			}),
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NamedModulesPlugin(),
			new webpack.NoEmitOnErrorsPlugin()
		] }
	});
}

function configureBuild(entry, dest, publicPath) {
	return update(configure(entry, dest, publicPath), {
		plugins: { $push: [
			new webpack.DefinePlugin({
				'process.env': {
					'NODE_ENV': `'production'`
				}
			}),
			new webpack.optimize.OccurrenceOrderPlugin(),
			new WebpackBabiliPlugin()
		] }
	});
}
