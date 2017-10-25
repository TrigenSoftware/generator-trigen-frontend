const { getValue } = require('../helpers');
const askForPackageInfo = require('./package-info');

module.exports =
function askForEditPackage(generator, props, pkg) {

	const editPackagePrompts = [{
		type:    'confirm',
		name:    'editPackage',
		message: `Would you ${pkg ? 'edit' : 'create'} package.json file?`,
		default: getValue(
			[props, 'editPackage'],
			true
		)
	}];

	return generator.prompt(editPackagePrompts).then(({ editPackage }) => {

		if (editPackage) {
			return askForPackageInfo(generator, props, pkg)
				.then(pkg => ({ editPackage, pkg }));
		}

		return { editPackage };
	});
};
