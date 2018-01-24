import { applyProps } from './helpers';

export default function managePackageScripts(sourcePkg, props) {

	const { scripts } = sourcePkg;

	return {
		...sourcePkg,
		scripts: applyProps(scripts, props)
	};
}
