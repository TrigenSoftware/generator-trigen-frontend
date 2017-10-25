
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

module.exports =
function getFiles(projectType, templatePath, {
	license, src,
	favicon, webmanifest,
	sassLoader, svgLoader,
	offline
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

		if (!offline) {
			sources.push(`!${templatePath('src/offline.html')}`);
			sources.push(`!${templatePath('src/app/sw.js')}`);
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
