/**
 * JavaScript tasks
 */

import gulp          from 'gulp';
import gutil         from 'gulp-util';
import teleport      from 'gulp-teleport';
import TeleportFs    from 'gulp-teleport/lib/fs';
import esLint        from 'gulp-eslint';
import webpack       from 'webpack';
import notify        from './helpers/notify';
import errorReporter from './helpers/error-reporter';
import { server }    from './server';
import revManifests  from './rev-manifests';
import paths         from './paths';
import webpackConfig from '../webpack.config';

revManifests.push(
	'script-rev-manifest'
);

const webpackDevCompiler = webpack(webpackConfig.dev(
	paths.src.scripts[0],
	paths.dist.app
));

const webpackBuildCompiler = webpack(webpackConfig.build(
	paths.src.scripts[0],
	paths.dist.app
));

webpackBuildCompiler.outputFileSystem = new TeleportFs((stream) => {

	stream('**/rev-manifest.json')
		.pipe(teleport.to('script-rev-manifest'));

	stream('**/webpack-manifest.json')
		.pipe(teleport.to('webpack-manifest'));
});

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
			notify('Scripts are updated.', true);
			server.reload();
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
