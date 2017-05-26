/**
 * Gulpfile.js with tasks for frontend development.
 */

import gulp  from 'gulp';
import cache from 'gulp-cache';
import del   from 'del';
import path  from 'path';
import paths from './tasks/configs/paths';
import './tasks/server';
import './tasks/copy';
import './tasks/html';<% if (gulpTasks.includes('favicon')) { %>
import './tasks/favicon';<% } %><% if (gulpTasks.includes('webmanifest')) { %>
import './tasks/webmanifest';<% } %>
import './tasks/images';
import './tasks/style';
import './tasks/webpack';

gulp.task('cache:clear', (done) =>
	cache.clearAll(done)
);

gulp.task('clear', () =>
	del([
		path.join(paths.build.root, '**/*')
	])
);

gulp.task('watch', gulp.parallel(
	'html:watch',<% if (gulpTasks.includes('favicon')) { %>
	'favicon:watch',<% } %><% if (gulpTasks.includes('webmanifest')) { %>
	'webmanifest:watch',<% } %>
	'images:watch',
	'style:watch',
	'script:watch'
));

gulp.task('dev', gulp.series(
	gulp.parallel(
		'copy:dev',
		'webpack:dev',
		gulp.series(
			'style:dev',
			'html:dev'
		),<% if (gulpTasks.includes('favicon')) { %>
		'favicon:dev',<% } %><% if (gulpTasks.includes('webmanifest')) { %>
		'webmanifest:dev',<% } %>
		'images:dev'
	),
	'watch'
));

gulp.task('build', gulp.series(
	'clear',
	gulp.parallel(
		'copy:build',
		gulp.series(
			'style:build',
			'html:build'
		),<% if (gulpTasks.includes('favicon')) { %>
		'favicon:build',<% } %><% if (gulpTasks.includes('webmanifest')) { %>
		'webmanifest:build',<% } %>
		'images:build',
		'webpack:build'
	)
));

gulp.task('test', gulp.series(
	'html:lint',
	'style:lint',
	'script:lint'
));

gulp.task('default', gulp.series('dev'));
