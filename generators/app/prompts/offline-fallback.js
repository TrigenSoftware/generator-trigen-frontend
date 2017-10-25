const { getValue } = require('../helpers');

module.exports =
function askForOfflineFallback(generator, props) {

	const offlineFallbackPrompts = [{
		type:    'confirm',
		name:    'offlineFallback',
		message: 'Do you whant to use AppCache as ServiceWorker-precaching fallback?',
		default: getValue(
			[props, 'gulpTasks', _ => _.includes('offlineManifest')],
			true
		)
	}];

	return generator.prompt(offlineFallbackPrompts);
};
