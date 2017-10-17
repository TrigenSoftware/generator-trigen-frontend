const { getValue } = require('../helpers');
const askForEditWebman = require('./edit-webmanifest');
const askForFaviconBackground = require('./favicon-background');

const serverProtocols = {
	'HTTP/2 + SSL':   'http2',
	'HTTP/1.1 + SSL': 'https',
	'HTTP/1.1':       'http1'
};

const serverProtocolsKeys = Object.keys(serverProtocols),
	serverProtocolsValues = serverProtocolsKeys.map(_ => serverProtocols[_]);

module.exports =
function askForGulpCustomize(generator, props, pkg, webman) {

	const gulpCustomizePrompts = [{
		type:    'list',
		name:    'serverProtocol',
		message: 'What protocol do you want to use with dev server?',
		choices: serverProtocolsKeys,
		default: getValue(
			[props, 'serverProtocol', _ => serverProtocolsValues.indexOf(_)],
			0
		),
		filter:  _ => serverProtocols[_]
	}, {
		type:    'checkbox',
		name:    'gulpTasks',
		message: 'What additional tasks do you whant to include into Gulp?',
		choices: [{
			name:    'favicon',
			checked: getValue(
				[props, 'gulpTasks', _ => _.includes('favicon')],
				false
			)
		}, {
			name:    'webmanifest',
			checked: getValue(
				[props, 'gulpTasks', _ => _.includes('webmanifest')],
				false
			)
		}]
	}];

	return generator.prompt(gulpCustomizePrompts).then((result) => {

		result.faviconBackground = false;

		if (result.gulpTasks.includes('webmanifest')) {
			return askForEditWebman(generator, props, pkg, webman)
				.then(_ => Object.assign(result, _));
		}

		if (result.gulpTasks.includes('favicon')
			&& !result.gulpTasks.includes('webmanifest')
		) {
			return askForFaviconBackground(generator, props, pkg, webman)
				.then(_ => Object.assign(result, _));
		}

		return result;
	});
};
