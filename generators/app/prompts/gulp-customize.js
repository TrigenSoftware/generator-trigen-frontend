const { getValue } = require('../helpers');
const askForEditWebman = require('./edit-webmanifest');
const askForFaviconBackground = require('./favicon-background');
const askForOfflineFallback = require('./offline-fallback');

module.exports =
function askForGulpCustomize(generator, props, pkg, webman) {

	const gulpCustomizePrompts = [{
		type:    'checkbox',
		name:    'gulpTasks',
		message: 'What additional tasks do you whant to include into Gulp?',
		choices: [{
			name:    'favicon - generating icons for different platforms',
			value:   'favicon',
			checked: getValue(
				[props, 'gulpTasks', _ => _.includes('favicon')],
				false
			)
		}, {
			name:    'webmanifest - web app manifest management',
			value:   'webmanifest',
			checked: getValue(
				[props, 'gulpTasks', _ => _.includes('webmanifest')],
				false
			)
		}, {
			name:    'offline - precaching assets with ServiceWorker',
			value:   'offline',
			checked: getValue(
				[props, 'gulpTasks', _ => _.includes('offline')],
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

		if (result.gulpTasks.includes('favicon')) {
			return askForFaviconBackground(generator, props, pkg, webman)
				.then(_ => Object.assign(result, _));
		}

		return result;

	}).then((result) => {

		if (result.gulpTasks.includes('offline')) {
			return askForOfflineFallback(generator, props, pkg, webman)
				.then(({ offlineFallback }) => {

					if (offlineFallback) {
						result.gulpTasks.push('offlineManifest');
					}

					return result;
				});
		}

		return result;
	});
};
