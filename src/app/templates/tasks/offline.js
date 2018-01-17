/**
 * Offline tasks.
 */

import path from 'path';
import gulp from 'gulp';<% if (gulpTasks.includes('offlineManifest')) { %>
import manifest from 'gulp-manifest';<% } %>
import workbox from 'workbox-build';
import notify from './helpers/notify';
import * as glob from './helpers/glob';
import paths from './configs/paths';
import offlineConfig from './configs/offline';
<% if (gulpTasks.includes('offlineManifest')) { %>
gulp.task('offline:manifest', () =>
	gulp.src(glob.joinBase(
		paths.build.root,
		offlineConfig.staticFiles
	), { base: paths.build.root })
		.pipe(manifest({
			hash:         true,
			preferOnline: false,
			filename:     'manifest.appcache',
			exclude:      'manifest.appcache',
			fallback:     `. ${offlineConfig.navigateFallback}`
		}))
		.pipe(gulp.dest(paths.build.root))
		.pipe(notify('App cache manifest is generated.'))
);
<% } %>
gulp.task('offline:sw', () =>
	glob.ls(path.join(paths.build.root, '**/sw.*.js')).then((files) => {

		const [globPatterns, globIgnores] = glob.splitYesNot(offlineConfig.staticFiles);

		return Promise.all(files.map(file =>
			workbox.injectManifest({
				swSrc:                     file,
				swDest:                    file,
				globDirectory:             paths.build.root,
				dontCacheBustUrlsMatching: /\.[a-z0-9]{10}\./,
				globPatterns,
				globIgnores
			})
		));
	}).then(() => {
		notify('Precache manifest is injected.', true);
	})
);

gulp.task('offline', gulp.parallel(<% if (gulpTasks.includes('offlineManifest')) { %>
	'offline:manifest',<% } %>
	'offline:sw'
));
