/**
 * Webpack svg loader.
 */

import update    from 'immutability-helper';
import path      from 'path';
import findIndex from '../../helpers/find-index';
import paths     from '../paths';

const cwd = process.cwd();

export function base(config) {
	return update(config, {
		module: {
			rules: { $push: [{
				test: /\.svg$/,
				use:  [{
					loader:  'svg-sprite-loader',
					options: {
						runtimeGenerator: path.join(cwd, 'tasks/helpers/svg-to-component.js'),
						runtimeOptions:   {
							iconModule: path.join(cwd, paths.src.app, 'tasks/helpers/icon-component.js')
						}
					}
				}]
			}] }
		}
	});
}

export function dev(config) {
	return config;
}

export function build(config) {

	const { rules } = config.module;

	return update(config, {
		module:  { rules: {
			[findIndex('test', '/\\.svg$/', rules)]: {
				use: { $push: ['svgo-loader'] }
			}
		}}
	});
}
