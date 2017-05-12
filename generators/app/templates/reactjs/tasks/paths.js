/**
 * Paths
 */
<% if (gulpTasks.includes('webmanifest')) { %>
export default {
	src:  {
		root:     'src',
		html:     'src/**/*.html',
		manifest: 'src/manifest.json',<% if (gulpTasks.includes('favicon')) { %>
		favicon:  'src/favicon.svg',
		images:   [
			'src/**/*.{jpg,webp,png,svg,gif}',
			'!src/favicon.svg'
		],<% } else { %>
		images:   'src/**/*.{jpg,webp,png,svg,gif}',<% } %>
		styles:   'src/**/*.scss',
		scripts:  [
			'src/app/main.js',
			'src/app/**/*.js'
		],
		copy:     [
			'src/**/*.!(html|jpg|webp|png|svg|gif|scss|js)',
			'!src/manifest.json'
		]
	},
	dev: <% if (gulpTasks.includes('favicon')) { %>{
		root:     '.tmp',
		favicons: '.tmp/favicons',
		app:      '.tmp/app'
	}<% } else { %>{
		root: '.tmp',
		app:  '.tmp/app'
	}<% } %>,
	build: <% if (gulpTasks.includes('favicon')) { %>{
		root:     'build',
		favicons: 'build/favicons',
		app:      'build/app'
	}<% } else { %>{
		root: 'build',
		app:  'build/app'
	}<% } %>
};
<% } else { %>
export default {
	src:  {
		root:    'src',
		html:    'src/**/*.html',<% if (gulpTasks.includes('favicon')) { %>
		favicon: 'src/favicon.svg',
		images:  [
			'src/**/*.{jpg,webp,png,svg,gif}',
			'!src/favicon.svg'
		],<% } else { %>
		images:  'src/**/*.{jpg,webp,png,svg,gif}',<% } %>
		styles:  'src/**/*.scss',
		scripts: [
			'src/app/main.js',
			'src/app/**/*.js'
		],
		copy:    'src/**/*.!(html|jpg|webp|png|svg|gif|scss|js)'
	},
	dev: <% if (gulpTasks.includes('favicon')) { %>{
		root:     '.tmp',
		favicons: '.tmp/favicons',
		app:      '.tmp/app'
	}<% } else { %>{
		root: '.tmp',
		app:  '.tmp/app'
	}<% } %>,
	build: <% if (gulpTasks.includes('favicon')) { %>{
		root:     'build',
		favicons: 'build/favicons',
		app:      'build/app'
	}<% } else { %>{
		root: 'build',
		app:  'build/app'
	}<% } %>
};
<% } %>