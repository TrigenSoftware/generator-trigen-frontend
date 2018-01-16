import { getValue } from '../helpers';
import askForPackageInfo from './package-info';

export default async function askForEditPackage(generator, props, pkg) {

	const editPackagePrompts = [{
		type:    'confirm',
		name:    'editPackage',
		message: `Would you ${pkg ? 'edit' : 'create'} package.json file?`,
		default: getValue(
			[props, 'editPackage'],
			true
		)
	}];

	const { editPackage } = await generator.prompt(editPackagePrompts);

	if (editPackage) {

		const pkgInfo = await askForPackageInfo(generator, props, pkg);

		return {
			editPackage,
			pkg: pkgInfo
		};
	}

	return { editPackage };
}
