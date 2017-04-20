const { getValue } = require('../helpers');
const path = require('path');

const display = [
	'fullscreen',
	'standalone',
	'minimal-ui',
	'browser'
];

const orientation = [
	'any',
	'natural',
	'landscape',
	'landscape-primary',
	'landscape-secondary',
	'portrait',
	'portrait-primary',
	'portrait-secondary'
];

module.exports =
function askForWebmanInfo(generator, props, pkg, webman) {

	const destinationRoot = generator.destinationRoot();

	const webmanPrompts = [{
		type:    'input',
		name:    'name',
		message: 'name:',
		default: getValue(
			[webman, 'name'],
			[props, 'webman', 'name'],
			[props, 'pkg', 'name'],
			[pkg, 'name'],
			path.basename(destinationRoot)
		)
	}];

	return generator.prompt(webmanPrompts).then((result) => {

		const webmanPrompts = [{
			type:    'input',
			name:    'short_name',
			message: 'short name:',
			default: getValue(
				[webman, 'short_name'],
				[props, 'webman', 'short_name'],
				[result, 'name'],
				[props, 'pkg', 'name'],
				[pkg, 'name'],
				path.basename(destinationRoot)
			)
		}, {
			type:    'input',
			name:    'description',
			message: 'description:',
			default: getValue(
				[webman, 'description'],
				[props, 'webman', 'description'],
				[props, 'pkg', 'description'],
				[pkg, 'description']
			)
		}, {
			type:    'input',
			name:    'lang',
			message: 'language:',
			default: getValue(
				[webman, 'lang'],
				[props, 'webman', 'lang'],
				'en-US'
			)
		}, {
			type:    'list',
			name:    'display',
			message: 'display:',
			choices: display,
			default: getValue(
				[webman, 'display', _ => display.indexOf(_)],
				[props, 'webman', 'display', _ => display.indexOf(_)],
				1
			)
		}, {
			type:    'list',
			name:    'orientation',
			message: 'orientation:',
			choices: orientation,
			default: getValue(
				[webman, 'orientation', _ => orientation.indexOf(_)],
				[props, 'webman', 'orientation', _ => orientation.indexOf(_)],
				5
			)
		}, {
			type:    'input',
			name:    'scope',
			message: 'scope:',
			default: getValue(
				[webman, 'scope'],
				[props, 'webman', 'scope'],
				'/'
			)
		}, {
			type:    'input',
			name:    'start_url',
			message: 'start_url:',
			default: getValue(
				[webman, 'start_url'],
				[props, 'webman', 'start_url'],
				'/?homescreen=1'
			)
		}, {
			type:    'input',
			name:    'background_color',
			message: 'background_color:',
			default: getValue(
				[webman, 'background_color'],
				[props, 'webman', 'background_color']
			)
		}];

		return generator.prompt(webmanPrompts).then(_ => Object.assign(result, _));

	}).then((result) => {

		const webmanPrompts = [{
			type:    'input',
			name:    'theme_color',
			message: 'theme_color:',
			default: getValue(
				[webman, 'theme_color'],
				[props, 'webman', 'theme_color'],
				[result, 'background_color']
			)
		}];

		return generator.prompt(webmanPrompts).then(_ => Object.assign(result, _));
	});
};
