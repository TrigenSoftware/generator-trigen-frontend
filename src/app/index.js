import fs from 'fs';
import Generator from 'yeoman-generator';
import chalk from 'chalk';
import yosay from 'yosay';
import {
	hasYarnOrNpm,
	gitInit
} from './helpers';
import prompts from './prompts';
import editPackageJson from './editPackageJson';
import editWebmanifest from './editWebmanifest';
import getFiles from './getFiles';

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

		const { silent } = this.options;
		const pkgOrNot = this._package();
		const webmanOrNot = this._webmanifest();

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
			this.templatePath('package.json')
		);
	}

	_editPackageJson() {

		const targetPkg = this._readTargetPackage();
		const { pkg: pkgProps } = this.props;
		const { pkg } = this;

		this.pkg = editPackageJson(pkg, targetPkg, pkgProps);
	}

	_readTargetWebmanifest() {
		return this.fs.readJSON(
			this.templatePath('src/manifest.json')
		);
	}

	_editWebmanifest() {

		const targetWebman = this._readTargetWebmanifest();
		const { webman: webmanProps } = this.props;
		const { webman } = this;

		this.webman = editWebmanifest(webman, targetWebman, webmanProps);
	}

	configuring() {
		this._editPackageJson();
		this._editWebmanifest();
	}

	writing() {

		const {
			pkg,
			webman,
			props
		} = this;
		const {
			pkg: pkgProps,
			webman: webmanProps
		} = props;

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

		const files = getFiles({
			license: pkgProps && pkgProps.license == 'MIT',
			src:     !fs.existsSync(this.destinationPath('src'))
		}, this.templatePath.bind(this));

		files.forEach(([
			isTemplate,
			destDir,
			files
		]) => {

			if (isTemplate) {
				this.fs.copyTpl(files, this.destinationPath(destDir), props);
			} else {
				this.fs.copy(files, this.destinationPath(destDir));
			}
		});
	}

	async _gitInit() {

		if (this.props.gitInit) {
			await gitInit(this.destinationRoot());
		}
	}

	async install() {

		await this._gitInit();

		const pm = await hasYarnOrNpm();
		const useYarn = pm != 'npm';

		if (useYarn) {
			this.yarnInstall();
		} else {
			this.npmInstall();
		}
	}
}
