/**
 * JavaScript tasks
 */

import gulp          from 'gulp';
import gutil         from 'gulp-util';
import esLint        from 'gulp-eslint';
import webpack       from 'webpack';
import notify        from './helpers/notify';
import errorReporter from './helpers/error-reporter';
import { server }    from './server';
import paths         from './paths';
import webpackConfig from '../webpack.config';

const webpackDevCompiler = webpack(webpackConfig.dev(
	paths.src.scripts[0],
	paths.dist.app
));

const webpackBuildCompiler = webpack(webpackConfig.build(
	paths.src.scripts[0],
	paths.dist.app
));

gulp.task('script:watch', (done) => {
	gulp.watch(paths.src.scripts, gulp.series('script:dev'));
	done();
});

gulp.task('script:lint', () =>
	gulp.src(paths.src.scripts)
		.pipe(esLint())
		.pipe(esLint.format())
		.pipe(esLint.failAfterError())
		.on('error', errorReporter)
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
			server.reload();
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
