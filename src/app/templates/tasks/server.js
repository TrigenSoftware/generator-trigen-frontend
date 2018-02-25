/**
 * Server task.
 */

import gulp from 'gulp';
import { create } from 'browser-sync';
import HttpProxyMiddleware from 'http-proxy-middleware';
import HistoryApiFallbackMiddleware from 'connect-history-api-fallback';
import paths from './configs/paths';
import browserSyncConfig from './configs/browser-sync';

export const server = create();

gulp.task('server:dev', (done) => {<% if (projectType != 'simple') { %>

	const middleware = [];

	if (process.env.PROXY_SERVER_URI) {
		middleware.push(HttpProxyMiddleware(process.env.PROXY_SERVER_URI));
	}

	middleware.push(HistoryApiFallbackMiddleware());<% } %>

	const browserSyncConfigDev = {
		...browserSyncConfig,
		server: paths.dev.rootDir<% if (projectType != 'simple') { %>,
		middleware<% } %>
	};

	server.init(browserSyncConfigDev);
	done();
});

gulp.task('server:build', (done) => {<% if (projectType != 'simple') { %>

	const middleware = [];

	if (process.env.PROXY_SERVER_URI) {
		middleware.push(HttpProxyMiddleware(process.env.PROXY_SERVER_URI));
	}

	middleware.push(HistoryApiFallbackMiddleware());<% } %>

	const browserSyncConfigBuild = {
		...browserSyncConfig,
		server: paths.build.rootDir<% if (projectType != 'simple') { %>,
		middleware<% } %>
	};

	server.init(browserSyncConfigBuild);
	done();
});
