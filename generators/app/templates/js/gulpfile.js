/**
 * Gulpfile.js with tasks for frontend JavaScript development.
 */

/**
 * Requirements
 */

const { notify, reportError<% if (gulpTasks.includes('favicon')) {
		%>, faviconsReplacer<% if (gulpTasks.includes('webmanifest')) {
			%>, setIcons<%
	} %><% } %> } = require('./helpers'),<% if (gulpTasks.includes('favicon')) { %>
	path     = require('path'),
	del      = require('del'),
	gulp     = require('gulp'),
	gutil    = require('gulp-util'),
	replace  = require('gulp-replace'),
	teleport = require('gulp-teleport'),<% if (gulpTasks.includes('webmanifest')) { %>
	json     = require('gulp-json-editor'),<% } %>
	sm       = require('gulp-sourcemaps'),
	broSync  = require('browser-sync').create(),
<% } else { %>
	path    = require('path'),
	del     = require('del'),
	gulp    = require('gulp'),
	gutil   = require('gulp-util'),
	replace = require('gulp-replace'),
	sm      = require('gulp-sourcemaps'),
	broSync = require('browser-sync').create(),
<% } %>
	procss   = require('gulp-progressive-css'),
	htmlmin  = require('gulp-htmlmin'),
	htmlLint = require('gulp-html-linter'),
<% if (gulpTasks.includes('favicon')) { %>
	favicons = require('gulp-favicons'),
	srcset   = require('gulp-srcset'),
<% } else { %>
	srcset = require('gulp-srcset'),
<% } %>
	importer  = require('sass-modules-importer'),
	csso      = require('gulp-cssnano'),
	auto      = require('gulp-autoprefixer'),
	sass      = require('gulp-sass'),
	styleLint = require('gulp-stylelint'),

	webpack = require('webpack'),
	esLint  = require('gulp-eslint'),
<% if (gulpTasks.includes('favicon') && gulpTasks.includes('webmanifest')) { %>
	pkg    = require('./package.json'),
	webman = require('./src/manifest.json'),
	wpk    = require('./webpack.config');
<% } else { %>
	pkg = require('./package.json'),
	wpk = require('./webpack.config');
<% } %>
/**
 * Configs
 */

const { browsers } = pkg.engines;

const htmlminOptions = {
	removeComments:                true,
	collapseWhitespace:            true,
	collapseBooleanAttributes:     true,
	removeAttributeQuotes:         true,
	removeRedundantAttributes:     true,
	useShortDoctype:               true,
	removeEmptyAttributes:         true,
	removeScriptTypeAttributes:    true,
	removeStyleLinkTypeAttributes: true,
	minifyJS:                      true
};
<% if (gulpTasks.includes('webmanifest')) { %>
const paths = {
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
	copy:    'src/**/*.!(html|jpg|webp|png|svg|gif|scss|js)',
	dist:    <% if (gulpTasks.includes('favicon')) { %>{
		root:     'dist',
		favicons: 'dist/favicons',
		app:      'dist/app'
	}<% } else { %>{
		root: 'dist',
		app:  'dist/app'
	}<% } %>
};
<% } else { %>
const paths = {
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
	],
	dist:     <% if (gulpTasks.includes('favicon')) { %>{
		root:     'dist',
		favicons: 'dist/favicons',
		app:      'dist/app'
	}<% } else { %>{
		root: 'dist',
		app:  'dist/app'
	}<% } %>
};
<% } %>
/**
 * HTML tasks
 */

gulp.task('html:watch', (done) => {
	gulp.watch(paths.html, gulp.series('html:dev'));
	done();
});

gulp.task('html:lint', () =>
	gulp.src(paths.html)
		.pipe(htmlLint())
		.pipe(htmlLint.format())
		.pipe(htmlLint.failOnError())
		.on('error', reportError)
);

gulp.task('html:dev', gulp.parallel('html:lint', () =>
	gulp.src(paths.html)<% if (gulpTasks.includes('favicon')) { %>
		.pipe(teleport.wait('favicons'))
		.pipe(replace(
			'<link rel="shortcut icon" href="favicon.svg">',
			faviconsReplacer(teleport)
		))<% } %>
		.pipe(gulp.dest(paths.dist.root))
		.pipe(broSync.stream())
		.pipe(notify('HTML files are updated.'))
));

gulp.task('html:build', gulp.series('html:lint', () =>
	gulp.src(paths.html)<% if (gulpTasks.includes('favicon')) { %>
		.pipe(teleport.wait('favicons'))
		.pipe(replace(
			'<link rel="shortcut icon" href="favicon.svg">',
			faviconsReplacer(teleport)
		))<% } %>
		.pipe(replace('ASSETS_VERSION', new Date().getTime()))
		.pipe(procss({ base: paths.dist.root }))
		.pipe(htmlmin(htmlminOptions))
		.on('error', reportError)
		.pipe(gulp.dest(paths.dist.root))
		.pipe(notify('HTML files are compiled.'))
));
<% if (gulpTasks.includes('webmanifest')) { %>
/**
 * Web manifest tasks
 */

gulp.task('webmanifest:watch', (done) => {
	gulp.watch(paths.manifest, gulp.series('webmanifest'));
	done();
});
<% if (gulpTasks.includes('favicon')) { %>
gulp.task('webmanifest', () =>
	gulp.src(paths.manifest)
		.pipe(teleport.wait('favicon'))
		.pipe(json(setIcons(teleport)))
		.pipe(gulp.dest(paths.dist.root))
);<% } else { %>
gulp.task('webmanifest', () =>
	gulp.src(paths.manifest)
		.pipe(gulp.dest(paths.dist.root))
);<% } %>
<% } %><% if (gulpTasks.includes('favicon')) { %>
/**
 * Favicon tasks
 */

gulp.task('favicon:watch', (done) => {
	gulp.watch(paths.favicon, gulp.series(
		'favicon',
		<% if (gulpTasks.includes('webmanifest')) {
			%>gulp.parallel(
			'webmanifest',
			'html:dev'
		)<% } else {
			%>'html:dev'<%
		} %>
	));
	done();
});

gulp.task('favicon', () =>
	gulp.src(paths.favicon)
		.pipe(favicons(<% if (faviconBackground || gulpTasks.includes('webmanifest')) { %>{
			background: <% if (gulpTasks.includes('webmanifest')) {
				%>webman.background<%
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
		}<% } %>))
		<% if (gulpTasks.includes('webmanifest')) {
			%>.pipe(teleport.from('webmanifest', '**/*.json'))<%
		} else {
			%>.pipe(teleport.away('**/*.json'))<%
		} %>
		.pipe(teleport.from('favicons', '**/*.html'))
		.pipe(srcset([{ match: '**/*.{png,svg}' }]))
		.pipe(gulp.dest(paths.dist.favicons))
);
<% } %>
/**
 * Images tasks
 */

gulp.task('images:watch', (done) => {
	gulp.watch(paths.images, gulp.series('images:dev'));
	done();
});

gulp.task('images:dev', () =>
	gulp.src(paths.images)
		.pipe(srcset([{
			match:  '**/*.jpg'
		}, {
			match:  '**/*.png'
		}, {
			match:  '**/*.svg'
		}]))
		.pipe(gulp.dest(paths.dist.root))
		.pipe(broSync.stream())
		.pipe(notify('Images are updated.'))
);

gulp.task('images:build', () =>
	gulp.src(paths.images)
		.pipe(srcset([{
			match:  '**/*.jpg'
		}, {
			match:  '**/*.png'
		}, {
			match:  '**/*.svg'
		}]))
		.pipe(gulp.dest(paths.dist.root))
		.pipe(notify('Images are generated.'))
);

/**
 * Style tasks
 */

gulp.task('style:watch', (done) => {
	gulp.watch(paths.styles, gulp.series('style:dev'));
	done();
});

gulp.task('style:lint', () =>
	gulp.src(paths.styles)
		.pipe(styleLint({
			reporters:      [{ formatter: 'string', console: true }],
			failAfterError: true
		}))
		.on('error', reportError)
);

gulp.task('style:dev', gulp.parallel('style:lint', () =>
	gulp.src(paths.styles)
		.pipe(sm.init())
			.pipe(sass({ importer: importer() }))
			.on('error', reportError)
			.pipe(auto({ browsers }))
		.pipe(sm.write())
		.pipe(gulp.dest(paths.dist.root))
		.pipe(broSync.stream())
		.pipe(notify('Styles are updated.'))
));

gulp.task('style:build', gulp.series('style:lint', () =>
	gulp.src(paths.styles)
		.pipe(sass({ importer: importer() }))
		.on('error', reportError)
		.pipe(auto({ browsers }))
		.pipe(csso({
			reduceIdents: false,
			zindex:       false
		}))
		.pipe(gulp.dest(paths.dist.root))
		.pipe(notify('Styles are compiled.'))
));

/**
 * Webpack compilers
 */

const webpackDevCompiler = webpack(wpk.dev(paths.scripts[0], paths.dist.app)),
	webpackBuildCompiler = webpack(wpk.build(paths.scripts[0], paths.dist.app));

/**
 * JavaScript tasks
 */

gulp.task('script:watch', (done) => {
	gulp.watch(paths.scripts, gulp.series('script:dev'));
	done();
});

gulp.task('script:lint', () =>
	gulp.src(paths.scripts)
		.pipe(esLint())
		.pipe(esLint.format())
		.pipe(esLint.failAfterError())
		.on('error', reportError)
);

gulp.task('script:dev', gulp.parallel('script:lint', done =>
	webpackDevCompiler.run((error, stats) => {

		if (error) {
			notify.onError(error);
			return done();
		}

		if (stats.hasErrors()) {
			notify.onError(new Error('Webpack compilation is failed.'));
		} else {
			broSync.reload();
			notify('Scripts are updated.', true);
		}

		gutil.log(`${gutil.colors.cyan('webpack')}:`, `\n${stats.toString({
			chunks: false,
			colors: true
		})}`);

		return done();
	})
));

gulp.task('script:build', gulp.series('script:lint', done =>
	webpackBuildCompiler.run((error, stats) => {

		if (error) {
			notify.onError(error);
			return done();
		}

		if (stats.hasErrors()) {
			notify.onError(new Error('Webpack compilation is failed.'));
		} else {
			notify('Scripts are compiled.', true);
		}

		gutil.log(`${gutil.colors.cyan('webpack')}:`, `\n${stats.toString({
			chunks: false,
			colors: true
		})}`);

		return done();
	})
));

/**
 * Other files tasks
 */

gulp.task('copy', () =>
	gulp.src(paths.copy)
		.pipe(gulp.dest(paths.dist.root))
);

gulp.task('clear', () =>
	del([
		path.join(paths.dist.root, '**/*')
	])
);

/**
 * Main tasks
 */

gulp.task('server', (done) => {
	broSync.init(<% if (serverProtocol == 'http2') { %>{
		server:     'dist',
		https:      true,
		httpModule: 'http2',
		open:       false,
		notify:     false
	}<% } else if (serverProtocol == 'https') { %>{
		server: 'dist',
		https:  true,
		open:   false,
		notify: false
	}<% } else if (serverProtocol == 'http1') { %>{
		server: 'dist',
		open:   false,
		notify: false
	}<% } %>);
	done();
});

gulp.task('watch', gulp.parallel(
	'html:watch',<% if (gulpTasks.includes('webmanifest')) { %>
	'webmanifest:watch',<% } %><% if (gulpTasks.includes('favicon')) { %>
	'favicon:watch',<% } %>
	'images:watch',
	'style:watch',
	'script:watch'
));

gulp.task('dev', gulp.series(
	'server',
	gulp.parallel(
		'copy',
		gulp.series(
			'style:dev',
			'html:dev'
		),<% if (gulpTasks.includes('webmanifest')) { %>
		'webmanifest',<% } %><% if (gulpTasks.includes('favicon')) { %>
		'favicon',<% } %>
		'images:dev',
		'script:dev'
	),
	'watch'
));

gulp.task('build', gulp.series(
	'clear',
	gulp.parallel(
		'copy',
		gulp.series(
			'style:build',
			'html:build'
		),<% if (gulpTasks.includes('webmanifest')) { %>
		'webmanifest',<% } %><% if (gulpTasks.includes('favicon')) { %>
		'favicon',<% } %>
		'images:build',
		'script:build'
	)
));

gulp.task('default', gulp.series('dev'));
