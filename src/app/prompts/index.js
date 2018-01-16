import askForProjectType from './project-type';
import askForEditPackage from './edit-package';
import askForGulpCustomize from './gulp-customize';
import askForWebpackCustomize from './webpack-customize';
import askForGitInit from './git-init';

const asks = [
	askForProjectType,
	askForEditPackage,
	askForGulpCustomize,
	askForWebpackCustomize,
	askForGitInit
];

export default async function prompts(generator, pkg, webman) {

	const props = generator.config.getAll();

	for (const ask of asks) {
		Object.assign(props, await ask(generator, props, pkg, webman));
	}

	generator.config.set(props);
	generator.config.save();

	return props;
}
