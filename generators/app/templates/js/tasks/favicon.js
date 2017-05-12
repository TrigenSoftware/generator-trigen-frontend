/**
 * Favicon tasks
 */

import gulp          from 'gulp';
import * as teleport from 'gulp-teleport';
import rev           from 'gulp-rev';
import newer         from 'gulp-newer';
import cache         from 'gulp-cache';
import size          from 'gulp-size';
import favicons      from 'gulp-favicons';
import srcset        from 'gulp-srcset';
import path          from 'path';
import notify        from './helpers/notify';
import { server }    from './server';
import revManifests  from './rev-manifests';
import paths         from './paths';<% if (gulpTasks.includes('webmanifest')) { %>
import manifest      from '../src/manifest.json';<% } %>

revManifests.push(
	'favicons-rev-manifest'
);

const faviconsOptions = <% if (faviconBackground || gulpTasks.includes('webmanifest')) { %>{
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
		// .pipe(newer(path.join(paths.dev.favicons, 'favicon.ico')))
		.pipe(favicons(faviconsOptions))
		<% if (gulpTasks.includes('webmanifest')) {
		%>.pipe(teleport.to('webmanifest', '**/*.json'))<%
		} else {
		%>.pipe(teleport.away('**/*.json'))<%
		} %>
		.pipe(teleport.to('favicons', '**/*.html'))
		.pipe(srcset([{
			match: '**/*.{png,svg}'
		}], {
			skipOptimization: true
		}))
		.pipe(gulp.dest(paths.dev.favicons))
		.pipe(notify('Favicons are updated.'))
		.pipe(server.stream({ once: true }))
);

gulp.task('favicon:build', () =>
	gulp.src(paths.src.favicon)
		.pipe(cache(favicons(faviconsOptions)))
		<% if (gulpTasks.includes('webmanifest')) {
		%>.pipe(teleport.to('webmanifest', '**/*.json'))<%
		} else {
		%>.pipe(teleport.away('**/*.json'))<%
		} %>
		.pipe(teleport.to('favicons', '**/*.html'))
		.pipe(size({ title: 'favicons' }))
		.pipe(cache(srcset([{ match: '**/*.{png,svg}' }])))
		.pipe(rev())
		.pipe(size({ title: 'favicons optimized' }))
		.pipe(gulp.dest(paths.build.favicons))
		.pipe(rev.manifest())
		.pipe(notify('Favicons are generated.'))
		.pipe(teleport.to('favicons-rev-manifest'))
);
