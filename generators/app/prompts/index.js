const askForEditPackage = require('./edit-package');
const askForProjectType = require('./project-type');
const askForGulpCustomize = require('./gulp-customize');
const askForWebpackCustomize = require('./webpack-customize');
const askForGitInit = require('./git-init');

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
		return askForWebpackCustomize(generator, props, pkg, webman);
	}).then((_) => {
		Object.assign(props, _);
		return askForGitInit(generator);
	}).then((_) => {
		Object.assign(props, _);
		generator.config.set(props);
		generator.config.save();
		return props;
	});
};
