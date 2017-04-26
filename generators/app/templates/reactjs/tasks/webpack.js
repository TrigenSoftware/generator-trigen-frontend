/**
 * JavaScript tasks
 */

import gulp                 from 'gulp';
import gutil                from 'gulp-util';
import esLint               from 'gulp-eslint';
import webpack              from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import notify               from './helpers/notify';
import errorReporter        from './helpers/error-reporter';
import { browserSyncOptions, server } from './server';
import paths                from './paths';
import webpackConfig        from '../webpack.config';

const webpackDevCompiler = webpack(webpackConfig.dev(
	paths.src.scripts[0],
	paths.dist.app
));

const webpackBuildCompiler = webpack(webpackConfig.build(
	paths.src.scripts[0],
	paths.dist.app
));

const webpackDevMiddleware = WebpackDevMiddleware(webpackDevCompiler, {
	publicPath:  webpackDevCompiler.options.output.publicPath,
	stats:       {
		chunks: false,
		colors: true
	}
});

const webpackHotMiddleware = WebpackHotMiddleware(webpackDevCompiler, {
	reload: true
});

const browserSyncWebpackOptions = {
	...browserSyncOptions,
	files:      ['**/*.!js'],
	middleware: [webpackDevMiddleware, webpackHotMiddleware]
};

gulp.task('script:watch', (done) => {
	gulp.watch(paths.src.scripts, gulp.series('script:lint'))
		.on('change', () => {
			notify('Scripts are updated.', true);
		});
	done();
});

gulp.task('script:lint', () =>
	gulp.src(paths.src.scripts)
		.pipe(esLint())
		.pipe(esLint.format())
		.pipe(esLint.failAfterError())
		.on('error', errorReporter)
);

gulp.task('webpack:dev', (done) => {
	server.init(browserSyncWebpackOptions);
	done();
});

gulp.task('webpack:build', gulp.series('script:lint', done =>
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