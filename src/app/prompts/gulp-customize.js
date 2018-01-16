import { getValue } from '../helpers';
import askForEditWebman from './edit-webmanifest';
import askForFaviconBackground from './favicon-background';
import askForOfflineFallback from './offline-fallback';

export default async function askForGulpCustomize(generator, props, pkg, webman) {

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
		}]
	}];

	if (props.projectType != 'simple') {
		gulpCustomizePrompts[0].choices.push({
			name:    'offline - precaching assets with ServiceWorker',
			value:   'offline',
			checked: getValue(
				[props, 'gulpTasks', _ => _.includes('offline')],
				false
			)
		});
	}

	const result = await generator.prompt(gulpCustomizePrompts);

	result.faviconBackground = false;

	if (result.gulpTasks.includes('webmanifest')) {

		const edit = await askForEditWebman(generator, props, pkg, webman);

		Object.assign(result, edit);

	} else
	if (result.gulpTasks.includes('favicon')) {

		const edit = await askForFaviconBackground(generator, props, pkg, webman);

		Object.assign(result, edit);
	}

	if (result.gulpTasks.includes('offline')) {

		const { offlineFallback } = await askForOfflineFallback(generator, props, pkg, webman);

		if (offlineFallback) {
			result.gulpTasks.push('offlineManifest');
		}
	}

	return result;
}
