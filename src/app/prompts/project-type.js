import { getValue } from '../helpers';

const projectTypes = {
	Simple:     'simple',
	JavaScript: 'js',
	ReactJS:    'reactjs'
};

const projectTypesKeys = Object.keys(projectTypes),
	projectTypesValues = projectTypesKeys.map(_ => projectTypes[_]);

export default function askForProjectType(generator, props) {

	const projectTypePrompts = [{
		type:    'list',
		name:    'projectType',
		message: 'What type of project do you want to create?',
		choices: projectTypesKeys,
		default: getValue(
			[props, 'projectType', _ => projectTypesValues.indexOf(_)],
			0
		),
		filter:  _ => projectTypes[_]
	}];

	return generator.prompt(projectTypePrompts);
}
