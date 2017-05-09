/**
 * Server task
 */

import gulp       from 'gulp';
import { create } from 'browser-sync';
import paths      from './paths';

export const server = create();

export const browserSyncOptions = <% if (serverProtocol == 'http2') { %>{
	server:     paths.build.root,
	https:      true,
	httpModule: 'http2',
	open:       false,
	notify:     false
}<% } else if (serverProtocol == 'https') { %>{
	server: paths.build.root,
	https:  true,
	open:   false,
	notify: false
}<% } else if (serverProtocol == 'http1') { %>{
	server: paths.build.root,
	open:   false,
	notify: false
}<% } %>;

gulp.task('server:dev', (done) => {

	const browserSyncOptionsDev = {
		...browserSyncOptions,
		server: paths.dev.root
	};

	server.init(browserSyncOptionsDev);
	done();
});

gulp.task('server:build', (done) => {
	server.init(browserSyncOptions);
	done();
});
