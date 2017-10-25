const { getValue } = require('../helpers');
const askForWebmanInfo = require('./webmanifest-info');

module.exports =
function askForEditWebman(generator, props, pkg, webman) {

	const editWebmanPrompts = [{
		type:    'confirm',
		name:    'editWebman',
		message: `Would you ${webman ? 'edit' : 'create'} manifest.json file?`,
		default: getValue(
			[props, 'editWebman'],
			true
		)
	}];

	return generator.prompt(editWebmanPrompts).then(({ editWebman }) => {

		if (editWebman) {
			return askForWebmanInfo(generator, props, pkg, webman)
				.then(webman => ({ editWebman, webman }));
		}

		return { editWebman };
	});
};
