require('babel-register');
const path = require('path');
const { dev } = require('../tasks/configs/webpack');
const paths = require('../tasks/configs/paths').default;

module.exports = configureStorybook;

function configureStorybook(storybookBaseConfig) {

	const webpackConfig = dev({
		appRoot:    paths.src.appDir,
		entries:    paths.src.appEntries,
		outputPath: paths.dev.appDir,
	});

	Object.assign(storybookBaseConfig.resolve, webpackConfig.resolve);
	storybookBaseConfig.module = webpackConfig.module;

	storybookBaseConfig.plugins = storybookBaseConfig.plugins
		.filter(_ =>
			_.constructor.name != 'ProgressPlugin'
			&& _.constructor.name != 'UglifyJsPlugin'
		);

	return storybookBaseConfig;
}
