import { exec } from 'child_process';
import hasbin from 'hasbin';

export function getValue(...values) {

	let result = global.undefined;

	values.some((value) => {

		if (Array.isArray(value)) {

			const [obj, ...keys] = value;

			let tres = obj,
				counter = 1;

			keys.some((key) => {

				if (typeof key == 'function') {
					tres = key(tres);
					counter++;
				} else
				if (typeof tres != 'undefined' && tres.hasOwnProperty(key)) {
					tres = tres[key];
					counter++;
				} else {
					return true;
				}

				return false;
			});

			if (value.length == counter) {
				result = tres;
			}

		} else {
			result = value;
		}

		return typeof result != 'undefined';
	});

	return result;
}

export function hasYarnOrNpm() {
	return new Promise((resolve) => {
		hasbin.first(['yarn', 'yarn', 'npm'], resolve);
	});
}

export function gitInit(cwd) {
	return new Promise((resolve, reject) => {
		exec('git init', { cwd }, (err) => {

			if (err) {
				reject(err);
				return;
			}

			exec('git add .', { cwd }, (err) => {

				if (err) {
					reject(err);
					return;
				}

				resolve();
			});
		});
	});
}