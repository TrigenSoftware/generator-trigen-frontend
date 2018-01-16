import glob from 'glob';
import fs   from 'fs';
import pkg  from '../../package.json';

const versions = Object.entries(pkg.devDependencies).reduce((versions, [dep, ver]) => {

	if (dep == 'gulp-cache' || /eslint/.test(dep)) {
		versions.push(ver);
	}

	return versions;

}, []).join('');

const configs = [
	...glob.sync('.eslintrc*'),
	...glob.sync('src/**/.eslintrc*')
].map((path) =>
	fs.readFileSync(path, 'utf8')
).join('');

export default function eslintCacheKey(file) {
	return `${versions}${configs}${file.contents.toString('base64')}`
}
