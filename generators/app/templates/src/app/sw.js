import Workbox from 'workbox-sw';

const workbox = new Workbox();

workbox.precache([]);
workbox.router.registerNavigationRoute(process.env.NAVIGATE_FALLBACK);
