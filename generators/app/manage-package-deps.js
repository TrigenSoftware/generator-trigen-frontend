
module.exports =
function managePackageDeps(sourcePkg, props) {

	const { devDependencies: depsSource } = sourcePkg;
		devDependencies = {};

	Object.keys(depsSource).forEach((dep) => {

		if (dep[0] == '#') {

			const not = dep[1] == '!',
				propKey = dep.replace(/[#!]/g, ''),
				propVal = props[propKey];

			if (not && !propVal || !not && propVal) {
				Object.assign(devDependencies, depsSource[dep]);
			}

			return;
		}

		devDependencies[dep] = depsSource[dep];
	});

	return Object.assign({}, sourcePkg, { devDependencies });
}
