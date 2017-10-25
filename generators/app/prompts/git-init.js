const hasbin = require('hasbin');
const fs = require('fs');
const { getValue } = require('../helpers');

function hasgit() {
	return new Promise((resolve) => {
		hasbin('git', resolve);
	});
}

module.exports =
function gitInit(generator, props) {
	return hasgit().then((hasgit) => {

		if (!hasgit || fs.existsSync(generator.destinationPath('.git'))) {
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
	});
}
