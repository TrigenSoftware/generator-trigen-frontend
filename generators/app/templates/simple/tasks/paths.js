/**
 * Paths
 */
<% if (gulpTasks.includes('webmanifest')) { %>
export default const paths = {
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
	dist: <% if (gulpTasks.includes('favicon')) { %>{
		root:     'dist',
		favicons: 'dist/favicons'
	}<% } else { %>{
		root: 'dist'
	}<% } %>
};
<% } else { %>
export default const paths = {
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
	dist: <% if (gulpTasks.includes('favicon')) { %>{
		root:     'dist',
		favicons: 'dist/favicons'
	}<% } else { %>{
		root: 'dist'
	}<% } %>
};
<% } %>