
const common = [
	'README.md',
	'.editorconfig',
	'.gitfiles',
	'.htmllintrc',
	'.stylelintrc',
	'gulpfile.babel.js'
];

module.exports =
function getFiles(projectType, templatePath, {
	license, src,
	favicon, webmanifest
}) {
	
	const files = [];

	const rootFiles = common.map(_ => templatePath(_));;

	if (license) {
		rootFiles.unshift(templatePath('LICENSE'));
	}

	files.push(['template', './', rootFiles]);

	if (src) {

		const sources = [
			templatePath('src/**/*'),
			`!${templatePath('src/**/*.jpg')}`
		];

		if (!favicon) {
			sources.push(`!${templatePath('src/favicon.svg')}`);
		}

		if (projectType == 'simple') {
			sources.push(`!${templatePath('src/**/*.js')}`);
		}
		
		files.push(['template', './src', sources]);
		files.push(['copy', './src', [templatePath('src/**/*.jpg')]]);
	}

	const tasks = [
		templatePath('tasks/**/*')
	];

	if (!favicon) {
		tasks.push(`!${templatePath('tasks/favicon.js')}`);
	}

	if (!webmanifest) {
		tasks.push(`!${templatePath('tasks/webmanifest.js')}`);
	}

	if (projectType == 'simple') {
		tasks.push(`!${templatePath('tasks/script.js')}`);
		tasks.push(`!${templatePath('tasks/configs/webpack.js')}`);
		tasks.push(`!${templatePath('tasks/helpers/stringify-values.js')}`);
	}

	files.push(['template', './tasks', tasks]);

	return files;
}
