const askForWebmanInfo = require('./webmanifest-info');

module.exports =
function askForEditWebman(generator, props, pkg, webman) {

	const editWebmanPrompts = [{
		type:    'confirm',
		name:    'editWebman',
		message: `Would you ${webman ? 'edit' : 'create'} manifest.json file?`,
		default: true
	}];

	return generator.prompt(editWebmanPrompts).then(({ editWebman }) => {

		if (editWebman) {
			return askForWebmanInfo(generator, props, pkg, webman)
				.then(webman => ({ webman }));
		}

		return {};
	});
};
