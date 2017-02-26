const Generator = require('yeoman-generator'),
	chalk  = require('chalk'),
	yosay  = require('yosay'),
	hasbin = require('hasbin'),
	path   = require('path');

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
		this.pkgProps = false;
		this.pkg = false;

		this.deps = false;
		this.devDeps = false;
	}

	_package() {

		const pathToPkg = this.destinationPath('package.json');

		if (this.fs.exists(pathToPkg)) {
			return this.fs.readJSON(pathToPkg);
		}

		return false;
	}

	_askForEditPackage() {

		const pkgOrNot = this._package();

		if (pkgOrNot) {
			this.pkg = pkgOrNot;
		}

		const editPackagePrompts = [{
			type:    'confirm',
			name:    'editPackage',
			message: `Would you ${pkgOrNot ? 'edit' : 'create'} package.json file?`,
			default: true
		}];

		return this.prompt(editPackagePrompts).then(({ editPackage }) => {

			if (editPackage) {
				return this._askForPackageInfo();
			}

			return null;
		});
	}

	_askForPackageInfo() {

		const destinationRoot = this.destinationRoot(),
			{ pkg, undef } = this;

		const packagePrompts = [{
			type:    'input',
			name:    'name',
			message: 'name:',
			default: pkg ? pkg.name : path.basename(destinationRoot)
		}, {
			type:     'input',
			name:     'version',
			message:  'version:',
			default:  pkg ? pkg.version : '1.0.0',
			validate: _ => /^\d+\.\d+\.\d+$/.test(_)
		}, {
			type:    'input',
			name:    'description',
			message: 'description:',
			default: pkg ? pkg.description : undef
		}, {
			type:    'input',
			name:    'repository',
			message: 'repository url:',
			default: pkg ? pkg.repository : undef
		}, {
			type:    'input',
			name:    'author',
			message: 'author:',
			default: pkg ? pkg.author : undef
		}, {
			type:    'list',
			name:    'license',
			message: 'license:',
			choices: [
				'MIT',
				'private'
			],
			default: 0
		}];

		return this.prompt(packagePrompts).then((pkgProps) => {
			this.pkgProps = pkgProps;
		});
	}

	_askForProjectType() {

		const projectTypePrompts = [{
			type:    'list',
			name:    'projectType',
			message: 'What type of project you want to create?',
			choices: [
				'Simple',
				'JavaScript',
				'ReactJS'
			],
			default: 0
		}];

		return this.prompt(projectTypePrompts).then((props) => {
			this.props = props;
		});
	}

	prompting() {

		this.log(yosay(`Welcome to the delightful ${chalk.green('trigen-frontend')} generator!`));

		return this._askForEditPackage().then(this._askForProjectType.bind(this));
	}

	_readTargetPackage() {

		let targetPkgPath = null;

		switch (this.props.projectType) {

			case 'JavaScript':
				targetPkgPath = this.templatePath('js/package.json');
				break;

			case 'ReactJS':
				targetPkgPath = this.templatePath('reactjs/package.json');
				break;

			case 'Simple': default:
				targetPkgPath = this.templatePath('simple/package.json');
				break;
		}

		return this.fs.readJSON(targetPkgPath);
	}

	_editPackage() {

		const targetPkg = this._readTargetPackage(),
			{ pkgProps } = this;

		let { pkg } = this;

		this.deps = Object.keys(targetPkg.dependencies);
		this.devDeps = Object.keys(targetPkg.devDependencies);

		if (!pkgProps) {
			return;
		}

		if (!pkg) {
			pkg = targetPkg;
		}

		Object.assign(pkg, pkgProps);

		pkg.engines = targetPkg.engines;
		pkg.scripts = targetPkg.scripts;
		pkg.browsers = targetPkg.browsers;
		pkg.babel = targetPkg.babel;

		this.pkg = pkg;
	}

	configuring() {
		this._editPackage();
	}

	writing() {

		const { pkg, pkgProps, props } = this;

		if (pkgProps && pkg) {

			this.fs.extendJSON(
				this.destinationPath('package.json'),
				this.pkg
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

		let projectFiles = null,
			readmeFile = null;

		switch (props.projectType) {

			case 'JavaScript':
				readmeFile = this.templatePath('js/README.md');
				projectFiles = [
					this.templatePath('js/.eslintrc.js'),
					this.templatePath('js/**/*'),
					`!${this.templatePath('js/package.json')}`,
					`!${readmeFile}`
				];
				break;

			case 'ReactJS':
				readmeFile = this.templatePath('reactjs/README.md');
				projectFiles = [
					this.templatePath('reactjs/.eslintrc.js'),
					this.templatePath('reactjs/**/*'),
					`!${this.templatePath('reactjs/package.json')}`,
					`!${readmeFile}`
				];
				break;

			case 'Simple': default:
				readmeFile = this.templatePath('simple/README.md');
				projectFiles = [
					this.templatePath('simple/**/*'),
					`!${this.templatePath('simple/package.json')}`,
					`!${readmeFile}`
				];
				break;
		}

		if (pkgProps) {
			this.fs.copyTpl(readmeFile, this.destinationPath('README.md'), pkgProps);
		}

		this.fs.copy(projectFiles, this.destinationRoot());
	}

	install() {
		return new Promise((resolve) => {
			hasbin.first(['yarn', 'npm'], (pm) => {

				switch (pm) {

					case 'npm':
						this.npmInstall(this.deps, { 'save': true });
						this.npmInstall(this.devDeps, { 'save-dev': true });
						break;

					case 'yarn': default:
						this.yarnInstall(this.deps);
						this.yarnInstall(this.devDeps, { 'dev': true });
						break;
				}

				resolve();
			});
		});
	}
};
