/**
 * Print helpers.
 */

import gutil from 'gulp-util';

function print(error, _title, _message = false) {

	const title = _message ? _title : false,
		message = _message ? _message : _title;

	let output = '';

	if (title) {
		output += `${gutil.colors.green(title)} `;
	}

	const trimmedString = (Buffer.isBuffer(message)
		? message.toString('utf8')
		: message
	).trim();

	output += error
		? gutil.colors.red(trimmedString)
		: trimmedString;

	gutil.log(output);
}

export function log(title, message) {
	print(false, title, message);
}

export function error(title, message) {
	print(true, title, message);
}
