import fs from 'fs';
import Generator from 'yeoman-generator';
import chalk from 'chalk';
import yosay from 'yosay';
import { hasYarnOrNpm, gitInit } from './helpers';
import prompts from './prompts';
import editPackageJson from './edit-package-json';
import managePackageScripts from './manage-package-scripts';
import managePackageDeps from './manage-package-deps';
import editWebmanifest from './edit-webmanifest';
import getFiles from './get-files';

export default class GeneratorTrigenFrontend extends Generator {

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

	async prompting() {

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

			return;
		}

		this.props = await prompts(this, this.pkg, this.webman);
	}

	_readTargetPackage() {
		return this.fs.readJSON(
			this.templatePath(`${this.props.projectType}-package.json`)
		);
	}

	_editPackageJson() {

		const targetPkg = this._readTargetPackage(),
			{ props, pkg } = this;

		const managerProps = {
			favicon:         props.gulpTasks.includes('favicon'),
			offline:         props.gulpTasks.includes('offline'),
			offlineManifest: props.gulpTasks.includes('offlineManifest'),
			storybook:       props.gulpTasks.includes('storybook'),
			sassLoader:      props.webpackLoaders.includes('sass'),
			svgLoader:       props.webpackLoaders.includes('svg')
		};

		this.pkg = [managePackageDeps, managePackageScripts].reduce(
			(pkg, manage) => manage(pkg, managerProps),
			editPackageJson(pkg, targetPkg, props.pkg)
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
			storybook:   props.gulpTasks.includes('storybook'),
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

		return null;
	}

	async install() {

		await this._gitInit();

		const pm = await hasYarnOrNpm(),
			useYarn = pm != 'npm';

		if (useYarn) {
			this.yarnInstall();
		} else {
			this.npmInstall();
		}
	}
}
