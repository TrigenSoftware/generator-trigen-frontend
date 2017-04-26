/**
 * Notify helper
 */

import notify_ from 'gulp-notify';

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

export default function notify(message, now) {

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
	notify_.onError('Error: <%%= error.message %>'),
	skipNotifyThrottleTimeout
);
