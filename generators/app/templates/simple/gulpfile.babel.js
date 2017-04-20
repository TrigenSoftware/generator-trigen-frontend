/**
 * Gulpfile.js with tasks for frontend development.
 */

import gulp  from 'gulp';
import del   from 'del';
import path  from 'path';
import paths from './tasks/paths';
import './tasks/server';
import './tasks/html';
import './tasks/favicon';
import './tasks/webmanifest';
import './tasks/images';
import './tasks/style';

gulp.task('copy', () =>
	gulp.src(paths.src.copy)
		.pipe(gulp.dest(paths.dist.root))
);

gulp.task('clear', () =>
	del([
		path.join(paths.dist.root, '**/*')
	])
);

gulp.task('watch', gulp.parallel(
	'html:watch',<% if (gulpTasks.includes('webmanifest')) { %>
	'webmanifest:watch',<% } %><% if (gulpTasks.includes('favicon')) { %>
	'favicon:watch',<% } %>
	'images:watch',
	'style:watch'
));

gulp.task('dev', gulp.series(
	'server',
	gulp.parallel(
		'copy',
		gulp.series(
			'style:dev',
			'html:dev'
		),<% if (gulpTasks.includes('webmanifest')) { %>
		'webmanifest:dev',<% } %><% if (gulpTasks.includes('favicon')) { %>
		'favicon:dev',<% } %>
		'images:dev'
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
		'webmanifest:build',<% } %><% if (gulpTasks.includes('favicon')) { %>
		'favicon:build',<% } %>
		'images:build'
	)
));

gulp.task('default', gulp.series('dev'));
