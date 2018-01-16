import { getValue } from '../helpers';
import askForWebmanInfo from './webmanifest-info';

export default async function askForEditWebman(generator, props, pkg, webman) {

	const editWebmanPrompts = [{
		type:    'confirm',
		name:    'editWebman',
		message: `Would you ${webman ? 'edit' : 'create'} manifest.json file?`,
		default: getValue(
			[props, 'editWebman'],
			true
		)
	}];

	const { editWebman } = await generator.prompt(editWebmanPrompts);

	if (editWebman) {

		const webmanInfo = await askForWebmanInfo(generator, props, pkg, webman);

		return {
			editWebman,
			webman: webmanInfo
		};
	}

	return { editWebman };
}
