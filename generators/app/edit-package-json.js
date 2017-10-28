
module.exports =
function editPackageJson(sourcePkg, targetPkg, pkgProps) {

	if (!pkgProps) {
		return sourcePkg;
	}

	const pkg = Object.assign(
		{},
		sourcePkg || targetPkg,
		pkgProps
	);

	pkg.engines = targetPkg.engines;
	pkg.scripts = targetPkg.scripts;
	pkg.babel = targetPkg.babel;

	if (pkg.license == 'private') {
		pkg.license = 'UNLICENSED';
		pkg.private = true;
	}

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

	pkg.dependencies = targetPkg.dependencies;
	pkg.devDependencies = targetPkg.devDependencies;

	return pkg;
};
