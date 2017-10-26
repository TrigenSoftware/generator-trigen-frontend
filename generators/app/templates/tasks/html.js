/**
 * HTML tasks
 */

import gulp           from 'gulp';
import * as teleport  from 'gulp-teleport';
import revReplace     from 'gulp-rev-replace';
import newer          from 'gulp-newer';
import size           from 'gulp-size';
import replace        from 'gulp-replace';
import merge          from 'gulp-merge-json';
import twig           from 'gulp-twig';
import progressiveCss from 'gulp-progressive-css';
import htmlmin        from 'gulp-htmlmin';
import htmlLint       from 'gulp-html-linter';
import notify         from './helpers/notify';
import errorReporter  from './helpers/error-reporter';
import revManifests   from './configs/rev-manifests';
import paths          from './configs/paths';
import htmlminConfig  from './configs/htmlmin';
import { server }     from './server';
<% if (gulpTasks.includes('favicon')) { %>
function replaceFavicon() {
	return replace(
		'<link rel="shortcut icon" href="favicon.svg">',
		() => teleport.get('favicons')
			.map(_ => _.contents.toString('utf8'))
			.join('')
			.replace(/(\s\n)*<link\s+rel=("|'|)manifest("|'|)\s*[^>]+(\/|)>/, '')
	);
}
<% } %><% if (projectType != 'simple') { %>
function injectWebpackLoader() {
	return replace(
		/<script/,
		() => `<script>window.webpackManifest=${
			[
				...teleport.get('webpack-manifest'),
				...teleport.get('webpack-loader')
			]
				.map(_ => _.contents.toString('utf8'))
				.join(';')
		}</script><script`
	);
}<% } %>

gulp.task('html:watch', (done) => {
	gulp.watch(paths.src.html, gulp.series('html:dev'));
	done();
});

gulp.task('html:lint', () =>
	gulp.src(paths.src.html)
		.pipe(htmlLint())
		.pipe(htmlLint.format())
		.pipe(htmlLint.failOnError())
		.on('error', errorReporter)
);

gulp.task('html:dev', gulp.parallel('html:lint', () =>
	gulp.src(paths.src.html)
		.pipe(newer(paths.dev.root))
		.pipe(twig({
			data: { ...process.env }
		}))<% if (gulpTasks.includes('favicon')) { %>
		.pipe(teleport.wait('favicons'))
		.pipe(replaceFavicon())<% } %>
		.pipe(gulp.dest(paths.dev.root))
		.pipe(notify('HTML files are updated.'))
		.pipe(server.stream({ once: true }))
));

gulp.task('html:build', gulp.series('html:lint', () =>
	gulp.src(paths.src.html)
		.pipe(twig({
			data: { ...process.env }
		}))<% if (gulpTasks.includes('favicon')) { %>
		.pipe(teleport.wait('favicons'))
		.pipe(replaceFavicon())<% } %>
		.pipe(revReplace({
			manifest: teleport.waitStream(revManifests)
				.pipe(merge({ fileName: 'rev-manifest.json' }))
				.pipe(teleport.clone('rev-manifest'))
		}))
		.pipe(progressiveCss({ base: paths.build.root }))<% if (projectType != 'simple') { %>
		.pipe(teleport.wait(['webpack-manifest', 'webpack-loader']))
		.pipe(injectWebpackLoader())<% } %>
		.pipe(size({ title: 'html' }))
		.pipe(htmlmin(htmlminConfig))
		.on('error', errorReporter)
		.pipe(size({ title: 'html optimized' }))
		.pipe(teleport.from('rev-manifest'))
		.pipe(gulp.dest(paths.build.root))
		.pipe(notify('HTML files are compiled.'))
));
