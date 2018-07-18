import StylablePlugin from 'stylable-webpack-plugin';
import StylelintPlugin from 'stylelint-webpack-plugin';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import update from 'immutability-helper';
import findIndex from '../../helpers/findIndex';

const autoprefixProcessor = postcss([
	autoprefixer()
]);

function postProcessor(stylableResult) {
	autoprefixProcessor.process(stylableResult.meta.outputAst).sync();
	return stylableResult;
}

export function base(config) {
	return update(config, {
		module: {
			rules: { $push: [{
				test:    /\.(eot|woff|ttf|jpg|webp|png|gif)$/,
				loader:  'file-loader',
				options: {
					name: '[name].[hash:10].[ext]'
				}
			}] }
		}
	});
}

export function dev(config) {

	const stylablePlugin = new StylablePlugin({
		rootScope:      false,
		transformHooks: { postProcessor }
	});

	return update(config, {
		plugins: { $push: [
			new StylelintPlugin({
				files: '**/*.st.css'
			}),
			stylablePlugin
		] }
	});
}

export function build(config) {

	const stylablePlugin = new StylablePlugin({
		filename:       '[name].[chunkhash].css',
		rootScope:      false,
		outputCSS:      true,
		includeCSSInJS: false,
		transformHooks: { postProcessor },
		optimize:       {
			removeUnusedComponents:   true,
			removeComments:           true,
			removeStylableDirectives: true,
			classNameOptimizations:   true,
			shortNamespaces:          true,
			minify:                   true
		}
	});

	return update(config, {
		module: {
			rules: {
				[findIndex('loader', 'file-loader', config.module.rules)]: {
					options: {
						name: { $set: '[name].[hash:10].[ext]' }
					}
				}
			}
		},
		plugins: { $push: [
			new StylelintPlugin({
				files:       '**/*.st.css',
				failOnError: true
			}),
			stylablePlugin
		] }
	});
}
