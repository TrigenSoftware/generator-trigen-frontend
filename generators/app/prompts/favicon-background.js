const { getValue } = require('../helpers');

module.exports =
function askForFaviconBackground(generator, props) {

	const faviconBackgroundPrompts = [{
		type:    'input',
		name:    'faviconBackground',
		message: 'Background color for flattened icons:',
		default: getValue(
			[props, 'faviconBackground']
		)
	}];

	return generator.prompt(faviconBackgroundPrompts);
};
