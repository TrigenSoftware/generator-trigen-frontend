/* eslint no-sync: 0 */
const Generator = require('yeoman-generator');
const chalk   = require('chalk');
const yosay   = require('yosay');
const hasbin  = require('hasbin');
const fs      = require('fs');
const prompts = require('./prompts');

const commonFiles = [
	'.editorconfig',
	'.gitignore',
	'.htmllintrc',
	'.stylelintrc',
	'LICENSE'
];

const templateFiles = [
	'src/index.html',
	'README.md',
	'gulpfile.babel.js',
	'webpack.config.js',
	'tasks/**/*'
];

module.exports =
class GeneratorTrigenFrontend extends Generator {

	constructor(args, opts) {

		super(args, opts);

		this.option('silent', {
			description: 'Run generator without prompts, using defaults from .yo-rc.json.',
			alias:       'S',
			default:     false
		});

		this.props = {};
		this.pkg = false;
		this.webman = false;
	}

	_package() {

		const pathToPkg = this.destinationPath('package.json');

		if (this.fs.exists(pathToPkg)) {
			return this.fs.readJSON(pathToPkg);
		}

		return false;
	}

	_webmanifest() {

		const pathToWebman = this.destinationPath('src/manifest.json');

		if (this.fs.exists(pathToWebman)) {
			return this.fs.readJSON(pathToWebman);
		}

		return false;
	}

	prompting() {

		this.log(yosay(`Welcome to the delightful ${chalk.green('trigen-frontend')} generator!`));

		const { silent } = this.options,
			pkgOrNot     = this._package(),
			webmanOrNot  = this._webmanifest();

		if (pkgOrNot) {
			this.pkg = pkgOrNot;
		}

		if (webmanOrNot) {
			this.webman = webmanOrNot;
		}

		if (silent) {
			
			const props = this.config.getAll();

			if (!Object.keys(props).length) {
				this.log(chalk.red('`.yo-rc.json` file not found.'));
				process.exit(1);
			}

			this.props = props;

			return true;
		}

		return prompts(this, this.pkg, this.webman).then((props) => {
			this.props = props;
		});
	}

	_readTargetPackage() {
		return this.fs.readJSON(
			this.templatePath(`${this.props.projectType}/package.json`)
		);
	}

	_editPackage() {

		const targetPkg = this._readTargetPackage(),
			{ pkg: pkgProps } = this.props;

		let { pkg } = this;

		if (!pkgProps) {
			return;
		}

		if (!pkg) {
			pkg = targetPkg;
		}

		Object.assign(pkg, pkgProps);

		pkg.engines = targetPkg.engines;
		pkg.scripts = targetPkg.scripts;
		pkg.babel = targetPkg.babel;
		pkg.engines.browsers = pkg.browsers;

		if (pkg.babel && pkg.browsers && Array.isArray(pkg.babel.presets)) {
			pkg.babel.presets.some((preset) => {

				if (Array.isArray(preset) && preset[0] == 'env') {

					const options = preset[1];

					if (options && typeof options.targets != 'undefined') {
						options.targets.browsers = pkg.browsers.split(',').map(_ => _.trim());
					}

					return true;
				}

				return false;
			});
		}

		Reflect.deleteProperty(pkg, 'browsers');

		pkg.dependencies = targetPkg.dependencies;
		pkg.devDependencies = targetPkg.devDependencies;

		this.pkg = pkg;
	}

	_readTargetWebmanifest() {
		return this.fs.readJSON(
			this.templatePath('manifest.json')
		);
	}

	_editWebmanifest() {

		const targetWebman = this._readTargetWebmanifest(),
			{ webman: webmanProps } = this.props;

		let { webman } = this;

		if (!webmanProps) {
			return;
		}

		if (!webman) {
			webman = targetWebman;
		}

		Object.assign(webman, webmanProps);

		this.webman = webman;
	}

	configuring() {
		this._editPackage();
		this._editWebmanifest();
	}

	_getFiles() {

		const { props } = this,
			{ pkg: pkgProps } = props;

		const projectDir = props.projectType,
			root = [
				`!${this.templatePath(`${projectDir}/package.json`)}`
			],
			src = [
				this.templatePath(`${projectDir}/src/**/*`)
			],
			templates = templateFiles.map(_ =>
				this.templatePath(`${projectDir}/${_}`)
			);

		let skipSrc = false;

		commonFiles.reverse().forEach((file) => {

			if (file == 'LICENSE' && (!pkgProps || pkgProps.license != 'MIT')) {
				return;
			}

			root.unshift(this.templatePath(file));
		});

		templates.forEach((template) => {
			root.push(`!${template}`);
			src.push(`!${template}`);
		});

		if (fs.existsSync(this.destinationPath('src'))) {
			skipSrc = true;
			src.push(`!${this.templatePath(`${projectDir}/src/**/*`)}`);
			templates.push(`!${this.templatePath(`${projectDir}/src/**/*`)}`);
		}

		if (!props.gulpTasks.includes('favicon')) {
			src.push(`!${this.templatePath(`${projectDir}/src/favicon.svg`)}`);
			templates.push(`!${this.templatePath(`${projectDir}/tasks/favicon.js`)}`);
		}

		if (!props.gulpTasks.includes('webmanifest')) {
			templates.push(`!${this.templatePath(`${projectDir}/tasks/webmanifest.js`)}`);
		}

		return { root, skipSrc, src, templates };
	}

	writing() {

		const { pkg, webman, props } = this,
			{ pkg: pkgProps, webman: webmanProps } = props;

		if (pkgProps && pkg) {

			this.fs.extendJSON(
				this.destinationPath('package.json'),
				pkg
			);
		}

		if (webmanProps && webman) {

			this.fs.extendJSON(
				this.destinationPath('src/manifest.json'),
				webman
			);
		}

		const { root, skipSrc, src, templates } = this._getFiles();

		this.fs.copy(root, this.destinationRoot());

		if (!skipSrc) {
			this.fs.copy(src, this.destinationPath('src'));
		}

		this.fs.copyTpl(templates, this.destinationRoot(), props);
	}

	install() {
		return new Promise((resolve) => {
			hasbin.first(['yarn', 'npm'], (pm) => {

				const useYarn = pm != 'npm';

				if (useYarn) {
					this.yarnInstall();
				} else {
					this.npmInstall();
				}

				resolve();
			});
		});
	}
};
