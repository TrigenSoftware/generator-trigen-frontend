
const common = [
	'README.md',
	'.env',
	'.editorconfig',
	'.gitignore',
	'.htmllintrc',
	'.stylelintrc',
	'.eslintrc.js',
	'.postcssrc.js',
	'gulpfile.babel.js'
];

export default function getFiles(projectType, templatePath, {
	license, src,
	favicon, webmanifest,
	offline, storybook,
	sassLoader, svgLoader
}) {

	const files = [],
		rootFiles = common.map(_ => templatePath(_));

	if (license) {
		rootFiles.unshift(templatePath('LICENSE'));
	}

	files.push(['template', './', rootFiles]);

	if (src) {

		const sources = [
			templatePath('src/**/*'),
			`!${templatePath('src/**/*.jpg')}`
		];

		const copySources = [
			templatePath('src/**/*.jpg')
		];

		if (!favicon) {
			sources.push(`!${templatePath('src/favicon.svg')}`);
		}

		if (projectType == 'simple') {
			sources.push(`!${templatePath('src/**/*.js')}`);
		}

		if (!offline) {
			sources.push(`!${templatePath('src/offline.html')}`);
			sources.push(`!${templatePath('src/app/sw.js')}`);
		}

		if (sassLoader) {
			copySources.push(`!${templatePath('src/images/**/*.jpg')}`);
		} else {
			copySources.push(`!${templatePath('src/app/**/*.jpg')}`);
		}

		files.push(['template', './src', sources]);
		files.push(['copy', './src', copySources]);
	}

	const tasks = [
		templatePath('tasks/**/*')
	];

	if (!favicon) {
		tasks.push(`!${templatePath('tasks/favicon.js')}`);
		tasks.push(`!${templatePath('tasks/configs/favicons.js')}`);
	}

	if (!webmanifest) {
		tasks.push(`!${templatePath('tasks/webmanifest.js')}`);
	}

	if (!storybook) {
		tasks.push(`!${templatePath('tasks/storybook.js')}`);
		tasks.push(`!${templatePath('tasks/helpers/print.js')}`);
	} else {
		files.push(['copy', './.storybook', templatePath('.storybook/**/*')]);
	}

	if (projectType == 'simple') {
		tasks.push(`!${templatePath('.eslintrc.js')}`);
		tasks.push(`!${templatePath('tasks/script.js')}`);
		tasks.push(`!${templatePath('tasks/helpers/find-index.js')}`);
		tasks.push(`!${templatePath('tasks/configs/webpack/**/*.js')}`);
	}

	if (projectType == 'simple' || !sassLoader && !svgLoader && !offline) {
		tasks.push(`!${templatePath('tasks/helpers/apply-reducers.js')}`);
	}

	if (projectType == 'simple' || !sassLoader) {
		tasks.push(`!${templatePath('tasks/configs/webpack/sass-loader.js')}`);
	}

	if (projectType == 'simple' || !svgLoader) {
		tasks.push(`!${templatePath('tasks/helpers/icon-component.js')}`);
		tasks.push(`!${templatePath('tasks/helpers/svg-to-component.js')}`);
		tasks.push(`!${templatePath('tasks/configs/webpack/svg-loader.js')}`);
	}

	if (projectType == 'simple' || !offline) {
		tasks.push(`!${templatePath('tasks/offline.js')}`);
		tasks.push(`!${templatePath('tasks/helpers/glob.js')}`);
		tasks.push(`!${templatePath('tasks/configs/offline.js')}`);
		tasks.push(`!${templatePath('tasks/configs/webpack/sw-loader.js')}`);
	}

	files.push(['template', './tasks', tasks]);

	return files;
}
