/**
 * Gulpfile.babel.js with tasks for frontend development.
 */

import path from 'path';
import gulp from 'gulp';
import dotenv from 'dotenv';
import del from 'del';
import cache from './tasks/configs/cache';
import paths from './tasks/configs/paths';
import './tasks/server';
import './tasks/copy';
import './tasks/html';<% if (gulpTasks.includes('favicon')) { %>
import './tasks/favicon';<% } %><% if (gulpTasks.includes('webmanifest')) { %>
import './tasks/webmanifest';<% } %>
import './tasks/images';
import './tasks/style';<% if (projectType != 'simple') { %>
import './tasks/script';<% } %><% if (gulpTasks.includes('offline')) { %>
import './tasks/offline';<% } %>

dotenv.config();

gulp.task('cache:clear', done =>
	cache.clear(null, done)
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
	),<% if (!webpackLoaders.includes('sass')) { %>
	'style:dev',<% } %>
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
	),<% if (!webpackLoaders.includes('sass')) { %>
	'style:build',<% } %><% if (projectType != 'simple') { %>
	'script:build',<% } %>
	'html:build'<% if (gulpTasks.includes('offline')) { %>,
	'offline'<% } %>
));

gulp.task('test', gulp.series(
	'html:lint',
	'style:lint'<% if (projectType != 'simple') { %>,
	'script:lint'<% } %>
));

gulp.task('default', gulp.series('dev'));
