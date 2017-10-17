const hasbin = require('hasbin');
const fs     = require('fs');

function hasgit() {
	return new Promise((resolve) => {
		hasbin('git', resolve);
	});
}

module.exports =
function gitInit(generator) {
	hasgit().then((hasgit) => {

		if (!hasgit || fs.existsSync(generator.destinationPath('.git'))) {
			return {};
		}

		const gitInitPrompts = [{
			type:    'confirm',
			name:    'gitInit',
			message: `Would you init git repository and add sources into it?`,
			default: true
		}];

		return generator.prompt(gitInitPrompts);
	});
}
