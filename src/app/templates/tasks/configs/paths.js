/**
 * Paths.
 */

export default {
	src:  {
		rootDir:    'src',
		html:       'src/**/*.html',<% if (gulpTasks.includes('webmanifest')) { %>
		manifest:   'src/manifest.json',<% } %><% if (gulpTasks.includes('favicon')) { %>
		favicon:    'src/favicon.svg',<% } %>
		images:     'src/images/**/*.{jpg,webp,png,svg,gif}',
		styles:     'src/**/*.scss',
		scripts:    'src/app/**/*.js',
		appDir:     'src/app',
		appEntries: {
			main: 'src/app/main.js'
		},
		copy:       <% if (gulpTasks.includes('webmanifest')) { %>[
			<% } %>'src/**/*.!(html|jpg|webp|png|svg|gif|scss|js)'<% if (gulpTasks.includes('webmanifest')) { %>,
			'!src/manifest.json'
		]<% } %>
	},
	dev: <% if (gulpTasks.includes('favicon')) { %>{
		rootDir:     '.tmp',
		faviconsDir: '.tmp/favicons',
		imagesDir:   '.tmp/images',
		appDir:      '.tmp/app'
	}<% } else { %>{
		rootDir:   '.tmp',
		imagesDir: '.tmp/images',
		appDir:    '.tmp/app'
	}<% } %>,
	build: <% if (gulpTasks.includes('favicon')) { %>{
		rootDir:     'build',
		faviconsDir: 'build/favicons',
		imagesDir:   'build/images',
		appDir:      'build/app'
	}<% } else { %>{
		rootDir:   'build',
		imagesDir: 'build/images',
		appDir:    'build/app'
	}<% } %>
};
