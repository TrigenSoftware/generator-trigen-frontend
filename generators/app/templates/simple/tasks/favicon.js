/**
 * Favicon tasks
 */

import gulp       from 'gulp';
import teleport   from 'gulp-teleport';
import favicons   from 'gulp-favicons';
import srcset     from 'gulp-srcset';
import notify     from './helpers/notify';
import { server } from './server';
import paths      from './paths';<% if (gulpTasks.includes('webmanifest')) { %>
import webman     from '../src/manifest.json';<% } %>

const faviconsOptions = <% if (faviconBackground || gulpTasks.includes('webmanifest')) { %>{
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
}<% } %>;

gulp.task('favicon:watch', (done) => {
	gulp.watch(paths.src.favicon, gulp.series(
		'favicon:dev',
		<% if (gulpTasks.includes('webmanifest')) {
			%>gulp.parallel(
			'webmanifest:dev',
			'html:dev'
		)<% } else {
			%>'html:dev'<%
		} %>
	));
	done();
});

gulp.task('favicon:dev', () =>
	gulp.src(paths.src.favicon)
		.pipe(favicons(faviconsOptions))
		<% if (gulpTasks.includes('webmanifest')) {
		%>.pipe(teleport.from('webmanifest', '**/*.json'))<%
		} else {
		%>.pipe(teleport.away('**/*.json'))<%
		} %>
		.pipe(teleport.from('favicons', '**/*.html'))
		.pipe(srcset([{ match: '**/*.{png,svg}' }]))
		.pipe(gulp.dest(paths.dist.favicons))
		.pipe(server.stream())
		.pipe(notify('Favicons are updated.'))
);

gulp.task('favicon:build', () =>
	gulp.src(paths.src.favicon)
		.pipe(favicons(faviconsOptions))
		<% if (gulpTasks.includes('webmanifest')) {
		%>.pipe(teleport.from('webmanifest', '**/*.json'))<%
		} else {
		%>.pipe(teleport.away('**/*.json'))<%
		} %>
		.pipe(teleport.from('favicons', '**/*.html'))
		.pipe(srcset([{ match: '**/*.{png,svg}' }]))
		.pipe(gulp.dest(paths.dist.favicons))
		.pipe(notify('Favicons are generated.'))
);
