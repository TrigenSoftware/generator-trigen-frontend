/**
 * Error reporter helper.
 */

import notify from './notify';

export default function errorReporter(error) {

	notify.onError(error);

	let errorString = error.toString(),
		errorStack  = error.stack;

	if (!/\n$/.test(errorString)) {
		errorString += '\n';
	}

	process.stderr.write(errorString);

	if (errorStack) {

		if (!/\n$/.test(errorStack)) {
			errorStack += '\n';
		}

		process.stderr.write(errorStack);
	}

	process.exitCode = 1;
	this.emit('end');
};
