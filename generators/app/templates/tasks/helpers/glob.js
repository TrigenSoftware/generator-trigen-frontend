/**
 * Glob helpers.
 */

import glob     from 'glob';
import { join } from 'path';

export function joinBase(base, patterns) {
	return patterns.map((pattern) => {

		const not = pattern[0] == '!';

		return not
			? `!${join(base, pattern.replace(/^!/, ''))}`
			: join(base, pattern);
	});
}

export function splitYesNot(patterns) {

	const yes = [],
		not = [];

	patterns.forEach((pattern) => {

		if (pattern[0] == '!') {
			not.push(pattern.replace('!', ''));
		} else {
			yes.push(pattern);
		}
	});

	return [yes, not];
}

export function ls(pattern) {
	return new Promise((resolve, reject) => {
		glob(pattern, (err, files) => {

			if (err) {
				reject(err);
				return;
			}

			resolve(files);
		})
	});
}
