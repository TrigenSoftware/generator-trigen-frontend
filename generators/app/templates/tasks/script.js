/**
 * JavaScript tasks
 */

import gulp                 from 'gulp';
import gutil                from 'gulp-util';
import * as teleport        from 'gulp-teleport';
import TeleportFs           from 'gulp-teleport/lib/fs';
import esLint               from 'gulp-eslint';
import webpack              from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';<% if (projectType == 'react') { %>
import WebpackHotMiddleware from 'webpack-hot-middleware';<% } %>
import path                 from 'path';
import notify               from './helpers/notify';
import errorReporter        from './helpers/error-reporter';
import revManifests         from './configs/rev-manifests';
import paths                from './configs/paths';
import browserSyncConfig    from './configs/browser-sync';
import * as webpackConfig   from './configs/webpack';
import { server }           from './server';

revManifests.push(
	'script-rev-manifest'
);

gulp.task('script:watch', (done) => {
	gulp.watch(paths.src.scripts, gulp.series('script:lint'));
	done();
});

gulp.task('script:lint', () =>
	gulp.src(paths.src.scripts)
		.pipe(esLint())
		.pipe(esLint.format())
		.pipe(esLint.failAfterError())
		.on('error', errorReporter)
);

gulp.task('script:dev', (done) => {

	const webpackDevCompiler = webpack(webpackConfig.dev({
		root:  paths.src.app,
		entry: paths.src.scripts[0],
		dest:  paths.dev.app
	}));

	webpackDevCompiler.plugin('done', () => {
		notify('Scripts are updated.', true);
	});

	const middleware = [];

	middleware.push(WebpackDevMiddleware(webpackDevCompiler, {
		publicPath:  webpackDevCompiler.options.output.publicPath,
		stats:       {
			chunks:   false,
			children: false,
			modules:  false,
			colors:   true
		}
	}));<% if (projectType == 'react') { %>

	middleware.push(WebpackHotMiddleware(webpackDevCompiler, {
		reload: true
	}));<% } %>

	if (process.env.PROXY_API_URI) {
		middleware.push(HttpProxyMiddleware(process.env.PROXY_API_URI));
	}

	const browserSyncWebpackOptionsDev = {
		...browserSyncConfig,
		server:     paths.dev.root,
		httpModule: global.undefined,
		files:      ['**/*.!js'],
		middleware
	};

	server.init(browserSyncWebpackOptionsDev);
	done();
});

gulp.task('script:build', gulp.series('script:lint', (done) => {

	const webpackBuildCompiler = webpack(webpackConfig.build({
		root:  paths.src.app,
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
			chunks:   false,
			children: false,
			modules:  false,
			colors:   true
		})}`);

		return done();
	});
}));
