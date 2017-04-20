const askForEditPackage = require('./edit-package');
const askForProjectType = require('./project-type');
const askForGulpCustomize = require('./gulp-customize');

module.exports =
function prompts(generator, pkg, webman) {

	const props = generator.config.getAll();

	return askForProjectType(generator, props, pkg, webman).then((_) => {
		Object.assign(props, _);
		return askForEditPackage(generator, props, pkg, webman);
	}).then((_) => {
		Object.assign(props, _);
		return askForGulpCustomize(generator, props, pkg, webman);
	}).then((_) => {
		Object.assign(props, _);
		generator.config.set(props);
		generator.config.save();
		return props;
	});
};
