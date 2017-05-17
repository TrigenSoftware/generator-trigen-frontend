/**
 * JavaScript tasks
 */

import gulp                 from 'gulp';
import gutil                from 'gulp-util';
import * as teleport        from 'gulp-teleport';
import TeleportFs           from 'gulp-teleport/lib/fs';
import esLint               from 'gulp-eslint';
import webpack              from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';
import WebpackHotMiddleware from 'webpack-hot-middleware';
import path                 from 'path';
import notify               from './helpers/notify';
import errorReporter        from './helpers/error-reporter';
import { browserSyncOptions, server } from './server';
import revManifests         from './rev-manifests';
import paths                from './paths';
import webpackConfig        from '../webpack.config';

revManifests.push(
	'script-rev-manifest'
);

const appRoot = path.dirname(paths.src.scripts[0]);

const webpackDevCompiler = webpack(webpackConfig.dev({
	root:  appRoot,
	entry: paths.src.scripts[0],
	dest:  paths.dev.app
}));

const webpackBuildCompiler = webpack(webpackConfig.build({
	root:  appRoot,
	entry: paths.src.scripts[0],
	dest:  paths.build.app
}));

webpackBuildCompiler.outputFileSystem = new TeleportFs((stream) => {

	stream('**/rev-manifest.json')
		.pipe(teleport.to('script-rev-manifest'));

	stream('**/webpack-manifest.json')
		.pipe(teleport.to('webpack-manifest'));

	stream('**/loader-*.js')
		.pipe(teleport.to('webpack-loader'));
});

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

	const browserSyncWebpackOptionsDev = {
		...browserSyncOptions,
		server:     paths.dev.root,
		httpModule: global.undefined,
		files:      ['**/*.!js'],
		middleware: [webpackDevMiddleware, webpackHotMiddleware]
	};

	server.init(browserSyncWebpackOptionsDev);
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
