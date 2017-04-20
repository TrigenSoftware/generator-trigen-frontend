/**
 * Helpers for gulpfile.js
 */

/**
 * Requirements
 */

const notify_ = require('gulp-notify');

const skipNotifyThrottleTimeout = 1200;

let skipNotify = false,
	skipNotifyTimeout = null;

function skipNotifyThrottle(fn, timeout) {
	return (maybeCallback, ...args) => {

		if (skipNotify) {

			if (typeof maybeCallback == 'function') {
				maybeCallback();
			}

		} else {
			skipNotify = true;
			fn(maybeCallback, ...args);
		}

		if (skipNotifyTimeout !== null) {
			clearTimeout(skipNotifyTimeout);
		}

		skipNotifyTimeout = setTimeout(() => {
			skipNotify = false;
		}, timeout);
	};
}

/**
 * Notify proxy
 */

exports.notify = notify;
function notify(message, now) {

	if (now) {

		const notification = notify(message);

		notification._transform(true, null, () => 1);
		notification._flush(() => 1);

		return null;
	}

	const notification = notify_({
		message,
		sound:  'Glass',
		onLast: true
	});

	notification._flush = skipNotifyThrottle(
		notification._flush.bind(notification),
		skipNotifyThrottleTimeout
	);

	return notification;
}

notify.onError = skipNotifyThrottle(
	notify_.onError('Error: <%= error.message %>'),
	skipNotifyThrottleTimeout
);

/**
 * Error reporter helper
 */

exports.reportError =
function reportError(error) {

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

/**
 * Helper for set icons to webmanifset
 */

exports.setIcons =
function setIcons(teleport) {
	return (manifest) => {

		const { icons } = JSON.parse(teleport.get('webmanifest', true).shift());

		manifest.icons = icons;

		return manifest;
	};
};

/**
 * Helper for prepare favincons html
 */

exports.faviconsReplacer =
function faviconsReplacer(teleport) {
	return () => teleport.get('favicons', true)
		.join('')
		.replace(/(\s\n)*<link\s+rel=("|'|)manifest("|'|)\s*[^>]+(\/|)>/, '');
};
