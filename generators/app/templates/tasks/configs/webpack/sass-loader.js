/**
 * Webpack sass loader.
 */

import WebpackExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer             from 'autoprefixer';
import cssnano                  from 'cssnano';
import update                   from 'immutability-helper';
import autoprefixerConfig       from './autoprefixer';
import cssnanoConfig            from './cssnano';
import findIndex                from '../helpers/find-index';

export function base(config) {
	return update(config, {
		module: {
			rules: { $push: [{
				test: /\.scss$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader:  'css-loader',
					options: {
						importLoaders: 1
					}
				}, {
					loader: 'postcss-loader',
					options: {
						sourceMap: true,
						plugins: () => [
							autoprefixer(autoprefixerConfig)
						]
					}
				}, {
					loader:  'resolve-url-loader',
					options: {
						sourceMap: true,
						keepQuery: true
					}
				}, {
					loader:  'sass-loader',
					options: {
						sourceMap: true
					}
				}]
			}, {
				test: /\.css$/,
				use: [{
					loader: 'style-loader'
				}, {
					loader:  'css-loader',
					options: {}
				}, {
					loader: 'postcss-loader',
					options: {
						sourceMap: true
					}
				}]
			}, {
				test:   /\.(eot|woff|ttf)$/,
				loader: 'file-loader'
			}] }
		}
	});
}

export function dev(config) {

	const { rules } = config.module;

	return update(config, {
		module: {
			rules: {
				[findIndex('test', '/\\.scss$/', rules)]: {
					use: { 1: { options: { sourceMap: { $set: true } } } }
				},
				[findIndex('test', '/\\.css$/', rules)]: {
					use: { 1: { options: { sourceMap: { $set: true } } } }
				}
			}
		}
	});
}

export function build(config) {

	const { rules } = config.module;

	const extractSass = new WebpackExtractTextPlugin({
		filename:  '[name]-[contenthash:10].css',
		allChunks: true
	});

	return update(config, {
		module:  { rules: {
			[findIndex('test', '/\\.scss$/', rules)]: {
				use: { $apply: (use) =>
					extractSass.extract({
						use: update(use.splice(1), {
							1: { options: { plugins: { $set: () => [
								autoprefixer(autoprefixerConfig),
								cssnano(cssnanoConfig)
							] } } }
						})
					})
				}
			},
			[findIndex('test', '/\\.css$/', rules)]: {
				use: { $apply: (use) =>
					extractSass.extract({
						use: update(use.splice(1), {
							1: { options: { plugins: { $set: () => [
								cssnano(cssnanoConfig)
							] } } },
						})
					})
				}
			}
		},
		plugins: { $push: [extractSass] }
	});
}
