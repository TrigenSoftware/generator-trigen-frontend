/**
 * Favicon tasks
 */

import gulp           from 'gulp';
import * as teleport  from 'gulp-teleport';
import rev            from 'gulp-rev';
import revFormat      from 'gulp-rev-format';
import cache          from 'gulp-cache';
import size           from 'gulp-size';
import favicons       from 'gulp-favicons';
import srcset         from 'gulp-srcset';
import notify         from './helpers/notify';
import cacheStore     from './configs/cache';
import revManifests   from './configs/rev-manifests';
import paths          from './configs/paths';
import faviconsConfig from './configs/favicons';
import { server }     from './server';

revManifests.push(
	'favicons-rev-manifest'
);

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
		.pipe(cache(favicons(faviconsConfig), {
			name: 'favicons'
		}))
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
		.pipe(cache(favicons(faviconsConfig), {
			name: 'favicons'
		}))
		<% if (gulpTasks.includes('webmanifest')) {
		%>.pipe(teleport.to('webmanifest', '**/*.json'))<%
		} else {
		%>.pipe(teleport.away('**/*.json'))<%
		} %>
		.pipe(teleport.to('favicons', '**/*.html'))
		.pipe(size({ title: 'favicons' }))
		.pipe(cache(srcset([{ match: '**/*.{png,svg}' }]), {
			name:      'optimized-favicons',
			fileCache: cacheStore
		}))
		.pipe(rev())
		.pipe(revFormat({ prefix: '.' }))
		.pipe(size({ title: 'favicons optimized' }))
		.pipe(gulp.dest(paths.build.favicons))
		.pipe(rev.manifest())
		.pipe(notify('Favicons are generated.'))
		.pipe(teleport.to('favicons-rev-manifest'))
);
