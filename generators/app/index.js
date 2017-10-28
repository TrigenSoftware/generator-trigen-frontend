/* eslint no-sync: 0 */
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const fs    = require('fs');

const { hasYarnOrNpm, gitInit } = require('./helpers');
const prompts = require('./prompts');
const editPackageJson = require('./edit-package-json');
const managePackageDeps = require('./manage-package-deps');
const editWebmanifest = require('./edit-webmanifest');
const getFiles = require('./get-files');

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
				throw new Error(chalk.red('`.yo-rc.json` file not found.'));
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
			this.templatePath(`${this.props.projectType}-package.json`)
		);
	}

	_editPackageJson() {

		const targetPkg = this._readTargetPackage(),
			{ props, pkg } = this;

		this.pkg = managePackageDeps(
			editPackageJson(pkg, targetPkg, props.pkg),
			{
				favicon:         props.gulpTasks.includes('favicon'),
				offline:         props.gulpTasks.includes('offline'),
				offlineManifest: props.gulpTasks.includes('offlineManifest'),
				sassLoader:      props.webpackLoaders.includes('sass'),
				svgLoader:       props.webpackLoaders.includes('svg')
			}
		);
	}

	_readTargetWebmanifest() {
		return this.fs.readJSON(
			this.templatePath('manifest.json')
		);
	}

	_editWebmanifest() {

		const targetWebman = this._readTargetWebmanifest(),
			{ webman: webmanProps } = this.props,
			{ webman } = this;

		this.webman = editWebmanifest(webman, targetWebman, webmanProps);
	}

	configuring() {
		this._editPackageJson();
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

		const files = getFiles(props.projectType, this.templatePath.bind(this), {
			license:     pkgProps && pkgProps.license == 'MIT',
			src:         !fs.existsSync(this.destinationPath('src')),
			favicon:     props.gulpTasks.includes('favicon'),
			webmanifest: props.gulpTasks.includes('webmanifest'),
			offline:     props.gulpTasks.includes('offline'),
			sassLoader:  props.webpackLoaders.includes('sass'),
			svgLoader:   props.webpackLoaders.includes('svg')
		});

		files.forEach(([type, dir, files]) => {

			if (type == 'template') {
				this.fs.copyTpl(files, this.destinationPath(dir), props);
			} else {
				this.fs.copy(files, this.destinationPath(dir));
			}
		});
	}

	_gitInit() {

		if (this.props.gitInit) {
			return gitInit(this.destinationRoot());
		}

		return Promise.resolve();
	}

	install() {
		return this._gitInit().then(() =>
			hasYarnOrNpm()
		).then((pm) => {

			const useYarn = pm != 'npm';

			if (useYarn) {
				this.yarnInstall();
			} else {
				this.npmInstall();
			}
		});
	}
};
