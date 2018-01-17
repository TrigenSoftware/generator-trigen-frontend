/**
 * Webpack ServiceWorker loader.
 */

import path from 'path';
import update from 'immutability-helper';
import findIndex from '../../helpers/find-index';

const cwd = process.cwd();

export function base(config, { buildRoot }) {
	return update(config, {
		module: {
			rules: { $push: [{
				test:    /\/sw\.js$/,
				exclude: /node_modules/,
				loader:  'service-worker-loader',
				query:   {
					filename:   '[name].js',
					outputPath: path.resolve(cwd, buildRoot)
				}
			}] }
		}
	});
}

export function dev(config) {
	return config;
}

export function build(config) {
	return update(config, {
		module: {
			rules: {
				[findIndex('loader', 'service-worker-loader', config.module.rules)]: {
					query: {
						filename: { $set: '[name].[chunkhash].js' }
					}
				}
			}
		}
	});
}
