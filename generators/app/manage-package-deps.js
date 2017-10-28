
module.exports =
function managePackageDeps(sourcePkg, props) {

	const { dependencies, devDependencies } = sourcePkg;

	return Object.assign({}, sourcePkg, {
		dependencies:    applyProps(dependencies, props),
		devDependencies: applyProps(devDependencies, props)
	});
};

function applyProps(deps, props) {
	return Object.keys(deps).reduce((result, dep) => {

		if (dep[0] == '#') {

			const not = dep[1] == '!',
				propKey = dep.replace(/[#!]/g, ''),
				propVal = props[propKey];

			if (not && !propVal || !not && propVal) {
				return Object.assign({}, result, deps[dep]);
			}

			return result;
		}

		return Object.assign({}, result, { [dep]: deps[dep] });
	}, {});
}
