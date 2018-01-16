/**
 * Server task
 */

import gulp              from 'gulp';
import { create }        from 'browser-sync';
import paths             from './configs/paths';
import browserSyncConfig from './configs/browser-sync';

export const server = create();

gulp.task('server:dev', (done) => {

	const browserSyncConfigDev = {
		...browserSyncConfig,
		server: paths.dev.root
	};

	server.init(browserSyncConfigDev);
	done();
});

gulp.task('server:build', (done) => {

	const browserSyncConfigBuild = {
		...browserSyncConfig,
		server: paths.build.root
	};

	server.init(browserSyncConfigBuild);
	done();
});
