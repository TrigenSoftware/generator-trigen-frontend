import { getValue } from '../helpers';

export default async function askForWebpackCustomize(generator, props) {

	if (props.projectType == 'simple') {
		return { webpackLoaders: [] };
	}

	const webpackCustomizePrompts = [{
		type:    'checkbox',
		name:    'webpackLoaders',
		message: 'What additional loaders do you whant to include into Webpack?',
		choices: [{
			name:    'SASS and CSS loaders',
			value:   'sass',
			checked: getValue(
				[props, 'webpackLoaders', _ => _.includes('sass')],
				false
			)
		}]
	}];

	if (props.projectType == 'reactjs') {
		webpackCustomizePrompts[0].choices.push({
			name:    'SVG sprite loader for ReactJS',
			value:   'svg',
			checked: getValue(
				[props, 'webpackLoaders', _ => _.includes('svg')],
				false
			)
		});
	}

	return generator.prompt(webpackCustomizePrompts);
}
