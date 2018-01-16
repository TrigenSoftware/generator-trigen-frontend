/**
 * Offline config
 */

export default {
	staticFiles:      [
		'*.html',
		<% if (webpackLoaders.includes('sass')) { %>// <% } %>'images/**/*',
		'app/**/*'
	],
	navigateFallback: 'offline.html'
};
