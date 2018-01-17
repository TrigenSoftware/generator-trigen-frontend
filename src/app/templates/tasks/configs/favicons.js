/**
 * Favicons config.
 */
<% if (gulpTasks.includes('webmanifest')) { %>
import manifest from '../../src/manifest.json';
<% } %>
export default <% if (faviconBackground || gulpTasks.includes('webmanifest')) { %>{
	background: <% if (gulpTasks.includes('webmanifest')) {
		%>manifest.background<%
	} else {
		%>'<%= faviconBackground %>'<%
	} %>,
	online:     false,
	path:       'favicons/',
	html:       'favicons.html',
	pipeHTML:   true,
	icons:      {
		android:      true,
		appleIcon:    { offset: 10 },
		appleStartup: true,
		firefox:      false,
		windows:      false,
		coast:        { offset: 20 },
		favicons:     true,
		yandex:       true
	}
}<% } else { %>{
	online:   false,
	path:     'favicons/',
	html:     'favicons.html',
	pipeHTML: true,
	icons:    {
		android:      true,
		appleIcon:    { offset: 10 },
		appleStartup: true,
		firefox:      false,
		windows:      false,
		coast:        { offset: 20 },
		favicons:     true,
		yandex:       true
	}
}<% } %>;
