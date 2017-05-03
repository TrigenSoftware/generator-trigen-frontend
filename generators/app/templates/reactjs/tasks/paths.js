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
		scripts:  [
			'src/app/main.js',
			'src/app/**/*.js'
		],
		copy:     [
			'src/**/*.!(html|jpg|webp|png|svg|gif|scss|js)',
			'!src/manifest.json'
		]
	},
	dist: <% if (gulpTasks.includes('favicon')) { %>{
		root:     'dist',
		favicons: 'dist/favicons',
		app:      'dist/app'
	}<% } else { %>{
		root: 'dist',
		app:  'dist/app'
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
		scripts: [
			'src/app/main.js',
			'src/app/**/*.js'
		],
		copy:    'src/**/*.!(html|jpg|webp|png|svg|gif|scss|js)'
	},
	dist: <% if (gulpTasks.includes('favicon')) { %>{
		root:     'dist',
		favicons: 'dist/favicons',
		app:      'dist/app'
	}<% } else { %>{
		root: 'dist',
		app:  'dist/app'
	}<% } %>
};
<% } %>