/**
 * JavaScript tasks
 */

import gulp                 from 'gulp';
import gutil                from 'gulp-util';
import * as teleport        from 'gulp-teleport';
import TeleportFs           from 'gulp-teleport/lib/fs';
import esLint               from 'gulp-eslint';
import webpack              from 'webpack';
import WebpackDevMiddleware from 'webpack-dev-middleware';<% if (projectType == 'reactjs') { %>
import WebpackHotMiddleware from 'webpack-hot-middleware';<% } %>
import HttpProxyMiddleware  from 'http-proxy-middleware';
import path                 from 'path';
import notify               from './helpers/notify';
import errorReporter        from './helpers/error-reporter';
import revManifests         from './configs/rev-manifests';
import paths                from './configs/paths';
import browserSyncConfig    from './configs/browser-sync';
import offlineConfig        from './configs/offline';
import * as webpackConfig   from './configs/webpack';
import { server }           from './server';

revManifests.push(
	'script-rev-manifest'
);

const scriptsFiles = path.join(paths.src.app, '**/*.js');

gulp.task('script:watch', (done) => {
	gulp.watch(scriptsFiles, gulp.series('script:lint'));
	done();
});

gulp.task('script:lint', () =>
	gulp.src(scriptsFiles)
		.pipe(esLint())
		.pipe(esLint.format())
		.pipe(esLint.failAfterError())
		.on('error', errorReporter)
);

gulp.task('script:dev', (done) => {

	const { src, dev } = paths;

	const webpackDevCompiler = webpack(webpackConfig.dev({
		appRoot:    src.app,
		entries:    src.scripts,
		buildRoot:  dev.root,
		outputPath: dev.app,
		publicPath: path.join('/', dev.app.replace(dev.root, '')),
		envify:     {
			...offlineConfig
		}
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
	}));<% if (projectType == 'reactjs') { %>

	middleware.push(WebpackHotMiddleware(webpackDevCompiler, {
		reload: true
	}));<% } %>

	if (process.env.PROXY_API_URI) {
		middleware.push(HttpProxyMiddleware(process.env.PROXY_API_URI));
	}

	const browserSyncWebpackOptionsDev = {
		...browserSyncConfig,
		server: paths.dev.root,
		files:  ['**/*.!js'],
		middleware
	};

	server.init(browserSyncWebpackOptionsDev);
	done();
});

gulp.task('script:build', gulp.series('script:lint', (done) => {

	const { src, build } = paths;

	const webpackBuildCompiler = webpack(webpackConfig.build({
		appRoot:    src.app,
		entries:    src.scripts,
		buildRoot:  build.root,
		outputPath: build.app,
		publicPath: path.join('/', build.app.replace(build.root, '')),
		envify:     {
			...offlineConfig
		}
	}));

	webpackBuildCompiler.outputFileSystem = new TeleportFs((stream) => {

		stream('**/rev-manifest.json')
			.pipe(teleport.to('script-rev-manifest'));

		stream('**/webpack-manifest.json')
			.pipe(teleport.to('webpack-manifest'));

		stream('**/loader.*.js')
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
