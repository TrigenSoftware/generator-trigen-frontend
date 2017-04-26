/**
 * HTML tasks
 */

import gulp           from 'gulp';<% if (gulpTasks.includes('favicon')) { %>
import teleport       from 'gulp-teleport';
import replace        from 'gulp-replace';<% } %>
import progressiveCss from 'gulp-progressive-css';
import htmlmin        from 'gulp-htmlmin';
import htmlLint       from 'gulp-html-linter';
import notify         from './helpers/notify';
import errorReporter  from './helpers/error-reporter';
import { server }     from './server';
import paths          from './paths';

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
<% } %>
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
	gulp.src(paths.src.html)<% if (gulpTasks.includes('favicon')) { %>
		.pipe(teleport.wait('favicons'))
		.pipe(replaceFavicon())<% } %>
		.pipe(gulp.dest(paths.dist.root))
		.pipe(server.stream())
		.pipe(notify('HTML files are updated.'))
));

gulp.task('html:build', gulp.series('html:lint', () =>
	gulp.src(paths.src.html)<% if (gulpTasks.includes('favicon')) { %>
		.pipe(teleport.wait('favicons'))
		.pipe(replaceFavicon())<% } %>
		.pipe(progressiveCss({ base: paths.dist.root }))
		.pipe(htmlmin(htmlminOptions))
		.on('error', errorReporter)
		.pipe(gulp.dest(paths.dist.root))
		.pipe(notify('HTML files are compiled.'))
));
