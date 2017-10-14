/**
 * Gulpfile.babel.js with tasks for frontend development.
 */

import gulp   from 'gulp';
import cache  from 'gulp-cache';
import dotenv from 'dotenv';
import del    from 'del';
import path   from 'path';
import paths  from './tasks/configs/paths';
import './tasks/server';
import './tasks/copy';
import './tasks/html';<% if (gulpTasks.includes('favicon')) { %>
import './tasks/favicon';<% } %><% if (gulpTasks.includes('webmanifest')) { %>
import './tasks/webmanifest';<% } %>
import './tasks/images';
import './tasks/style';
import './tasks/script';

dotenv.config();

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
	'style:watch'<% if (projectType != 'simple') { %>,
	'script:watch'<% } %>
));

gulp.task('dev', gulp.series(<% if (projectType == 'simple') { %>
	'server:dev',<% } %>
	gulp.parallel(
		'copy:dev',<% if (gulpTasks.includes('favicon')) { %>
		'favicon:dev',<% } %>
		'images:dev'<% if (gulpTasks.includes('webmanifest')) { %>,
		'webmanifest:dev'<% } %>
	),
	'style:dev',
	'html:dev',<% if (projectType != 'simple') { %>
	'script:dev',<% } %>
	'watch'
));

gulp.task('build', gulp.series(
	'clear',
	'copy:build',
	gulp.parallel(<% if (gulpTasks.includes('favicon')) { %>
		'favicon:build',<% } %>
		'images:build'<% if (gulpTasks.includes('webmanifest')) { %>,
		'webmanifest:build'<% } %>
	),
	'style:build',<% if (projectType != 'simple') { %>
	'script:build',<% } %>
	'html:build'
));

gulp.task('test', gulp.series(
	'html:lint',
	'style:lint'<% if (projectType != 'simple') { %>,
	'script:lint'<% } %>
));

gulp.task('default', gulp.series('dev'));
