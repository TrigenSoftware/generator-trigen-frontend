import { applyProps } from './helpers';

export default function managePackageDeps(sourcePkg, props) {

	const { dependencies, devDependencies } = sourcePkg;

	return {
		...sourcePkg,
		dependencies:    applyProps(dependencies, props),
		devDependencies: applyProps(devDependencies, props)
	};
}
