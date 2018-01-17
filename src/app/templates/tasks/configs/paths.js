/**
 * Paths.
 */
<% if (gulpTasks.includes('webmanifest')) { %>
export default {
	src:  {
		root:     'src',
		html:     'src/**/*.html',
		manifest: 'src/manifest.json',<% if (gulpTasks.includes('favicon')) { %>
		favicon:  'src/favicon.svg',<% } %>
		images:   'src/images/**/*.{jpg,webp,png,svg,gif}',
		styles:   'src/**/*.scss',
		app:      'src/app',
		scripts:  {
			main: 'src/app/main.js'
		},
		copy:     [
			'src/**/*.!(html|jpg|webp|png|svg|gif|scss|js)',
			'!src/manifest.json'
		]
	},
	dev: <% if (gulpTasks.includes('favicon')) { %>{
		root:     '.tmp',
		favicons: '.tmp/favicons',
		images:   '.tmp/images',
		app:      '.tmp/app'
	}<% } else { %>{
		root:   '.tmp',
		images: '.tmp/images',
		app:    '.tmp/app'
	}<% } %>,
	build: <% if (gulpTasks.includes('favicon')) { %>{
		root:     'build',
		favicons: 'build/favicons',
		images:   'build/images',
		app:      'build/app'
	}<% } else { %>{
		root:   'build',
		images: 'build/images',
		app:    'build/app'
	}<% } %>
};
<% } else { %>
export default {
	src:  {
		root:    'src',
		html:    'src/**/*.html',<% if (gulpTasks.includes('favicon')) { %>
		favicon: 'src/favicon.svg',<% } %>
		images:  'src/images/**/*.{jpg,webp,png,svg,gif}',
		styles:  'src/**/*.scss',
		app:     'src/app',
		scripts: {
			main: 'src/app/main.js'
		},
		copy:    'src/**/*.!(html|jpg|webp|png|svg|gif|scss|js)'
	},
	dev: <% if (gulpTasks.includes('favicon')) { %>{
		root:     '.tmp',
		favicons: '.tmp/favicons',
		images:   '.tmp/images',
		app:      '.tmp/app'
	}<% } else { %>{
		root:   '.tmp',
		images: '.tmp/images',
		app:    '.tmp/app'
	}<% } %>,
	build: <% if (gulpTasks.includes('favicon')) { %>{
		root:     'build',
		favicons: 'build/favicons',
		images:   'build/images',
		app:      'build/app'
	}<% } else { %>{
		root:   'build',
		images: 'build/images',
		app:    'build/app'
	}<% } %>
};
<% } %>
