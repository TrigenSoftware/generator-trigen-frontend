/**
 * Paths
 */
<% if (gulpTasks.includes('webmanifest')) { %>
export default {
	src:  {
		html:     'src/**/*.html',
		manifest: 'src/manifest.json',<% if (gulpTasks.includes('favicon')) { %>
		favicon:  'src/favicon.svg',
		images:   [
			'src/**/*.{jpg,webp,png,svg,gif}',
			'!src/favicon.svg'
		],<% } else { %>
		images:   'src/**/*.{jpg,webp,png,svg,gif}',<% } %>
		styles:   'src/**/*.scss',
		copy:     [
			'src/**/*.!(html|jpg|webp|png|svg|gif|scss)',
			'!src/manifest.json'
		]
	},
	dev: <% if (gulpTasks.includes('favicon')) { %>{
		root:     '.tmp',
		favicons: '.tmp/favicons'
	}<% } else { %>{
		root: '.tmp'
	}<% } %>,
	build: <% if (gulpTasks.includes('favicon')) { %>{
		root:     'build',
		favicons: 'build/favicons'
	}<% } else { %>{
		root: 'build'
	}<% } %>
};
<% } else { %>
export default {
	src:  {
		html:    'src/**/*.html',<% if (gulpTasks.includes('favicon')) { %>
		favicon: 'src/favicon.svg',
		images:  [
			'src/**/*.{jpg,webp,png,svg,gif}',
			'!src/favicon.svg'
		],<% } else { %>
		images:  'src/**/*.{jpg,webp,png,svg,gif}',<% } %>
		styles:  'src/**/*.scss',
		copy:    'src/**/*.!(html|jpg|webp|png|svg|gif|scss)'
	},
	dev: <% if (gulpTasks.includes('favicon')) { %>{
		root:     '.tmp',
		favicons: '.tmp/favicons'
	}<% } else { %>{
		root: '.tmp'
	}<% } %>,
	build: <% if (gulpTasks.includes('favicon')) { %>{
		root:     'build',
		favicons: 'build/favicons'
	}<% } else { %>{
		root: 'build'
	}<% } %>
};
<% } %>