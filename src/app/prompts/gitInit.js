import fs from 'fs';
import hasbin from 'hasbin';
import { getValue } from '../helpers';

function hasgit() {
	return new Promise((resolve) => {
		hasbin('git', resolve);
	});
}

export default async function gitInit(generator, props) {

	const has = await hasgit();

	if (!has || fs.existsSync(generator.destinationPath('.git'))) {
		return {};
	}

	const gitInitPrompts = [{
		type:    'confirm',
		name:    'gitInit',
		message: `Would you init git repository and add sources into it?`,
		default: getValue(
			[props, 'gitInit'],
			true
		)
	}];

	return generator.prompt(gitInitPrompts);
}
