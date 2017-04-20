/* eslint no-sync: 0 */
const Generator = require('yeoman-generator');
const chalk   = require('chalk');
const yosay   = require('yosay');
const hasbin  = require('hasbin');
const fs      = require('fs');
const prompts = require('./prompts');

const commonFiles = {
	'editorconfig': '.editorconfig',
	'gitignore':    '.gitignore',
	'htmllintrc':   '.htmllintrc',
	'stylelintrc':  '.stylelintrc',
	'LICENSE':      'LICENSE',
	'helpers.js':   'helpers.js'
};

module.exports =
class GeneratorTrigenFrontend extends Generator {

	constructor(args, opts) {

		super(args, opts);

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

		const pkgOrNot  = this._package(),
			webmanOrNot = this._webmanifest();

		if (pkgOrNot) {
			this.pkg = pkgOrNot;
		}

		if (webmanOrNot) {
			this.webman = webmanOrNot;
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

		Object.keys(commonFiles).forEach((_from) => {

			const from = this.templatePath(_from),
				to = this.destinationPath(commonFiles[_from]);

			if (_from == 'LICENSE' && (!pkgProps || pkgProps.license != 'MIT')) {
				return;
			}

			this.fs.copy(from, to);
		});

		const projectFiles = [],
			projectDir = props.projectType,
			readmeFile = this.templatePath(`${projectDir}/README.md`),
			gulpFile   = this.templatePath(`${projectDir}/gulpfile.js`),
			indexHtml  = this.templatePath(`${projectDir}/src/index.html`);

		if (projectDir != 'simple') {
			projectFiles.push(this.templatePath(`${projectDir}/.eslintrc.js`));
		}

		projectFiles.push(
			this.templatePath(`${projectDir}/*`),
			`!${this.templatePath(`${projectDir}/package.json`)}`,
			`!${readmeFile}`,
			`!${gulpFile}`
		);

		if (!fs.existsSync(this.destinationPath('src'))) {
			projectFiles.push(this.templatePath(`${projectDir}/src/**/*`));
			projectFiles.push(this.templatePath(`!${indexHtml}`));
		}

		if (!props.gulpTasks.includes('favicon')) {
			projectFiles.push(`!${this.templatePath(`${projectDir}/src/favicon.svg`)}`);
		}

		if (pkgProps) {
			this.fs.copyTpl(readmeFile, this.destinationPath('README.md'), pkgProps);
		}

		this.fs.copyTpl(gulpFile, this.destinationPath('gulpfile.js'), props);
		this.fs.copyTpl(indexHtml, this.destinationPath('src/index.html'), props);
		this.fs.copy(projectFiles, this.destinationRoot());
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
