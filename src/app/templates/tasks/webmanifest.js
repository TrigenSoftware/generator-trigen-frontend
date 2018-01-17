/**
 * Web manifest tasks.
 */

import gulp from 'gulp';
import * as teleport from 'gulp-teleport';
import rev from 'gulp-rev';
import revFormat from 'gulp-rev-format';
import revReplace from 'gulp-rev-replace';
import newer from 'gulp-newer';
import size from 'gulp-size';<% if (gulpTasks.includes('favicon')) { %>
import json from 'gulp-json-editor';<% } %>
import notify from './helpers/notify';
import revManifests from './configs/rev-manifests';
import paths from './configs/paths';
import { server } from './server';

revManifests.push(
	'webmanifest-rev-manifest'
);
<% if (gulpTasks.includes('favicon')) { %>
function setIcons() {
	return json((manifest) => {

		const [iconsManifest] = teleport.get('webmanifest');

		if (iconsManifest) {

			const { icons } = JSON.parse(iconsManifest.contents.toString('utf8'));

			manifest.icons = icons;
		}

		return manifest;
	});
}
<% } %>
gulp.task('webmanifest:watch', (done) => {
	gulp.watch(paths.src.manifest, gulp.series('webmanifest:dev'));
	done();
});
<% if (gulpTasks.includes('favicon')) { %>
gulp.task('webmanifest:dev', () =>
	gulp.src(paths.src.manifest)
		.pipe(newer(paths.dev.root))
		.pipe(teleport.wait('webmanifest'))
		.pipe(setIcons())
		.pipe(gulp.dest(paths.dev.root))
		.pipe(notify('Web manifset is updated.'))
		.pipe(server.stream({ once: true }))
);

gulp.task('webmanifest:build', () =>
	gulp.src(paths.src.manifest)
		.pipe(teleport.wait('webmanifest'))
		.pipe(setIcons())
		.pipe(revReplace({
			manifest:            teleport.waitStream('favicons-rev-manifest', false, 240000),
			replaceInExtensions: ['.json']
		}))
		.pipe(rev())
		.pipe(revFormat({ prefix: '.' }))
		.pipe(size({ title: 'webmanifest' }))
		.pipe(gulp.dest(paths.build.root))
		.pipe(rev.manifest())
		.pipe(notify('Web manifset is compiled.'))
		.pipe(teleport.to('webmanifest-rev-manifest'))
);<% } else { %>
gulp.task('webmanifest:dev', () =>
	gulp.src(paths.src.manifest)
		.pipe(newer(paths.dev.root))
		.pipe(gulp.dest(paths.dev.root))
		.pipe(notify('Web manifset is updated.'))
		.pipe(server.stream({ once: true }))
);

gulp.task('webmanifest:build', () =>
	gulp.src(paths.src.manifest)
		.pipe(rev())
		.pipe(revFormat({ prefix: '.' }))
		.pipe(size({ title: 'webmanifest' }))
		.pipe(gulp.dest(paths.build.root))
		.pipe(rev.manifest())
		.pipe(notify('Web manifset is compiled.'))
		.pipe(teleport.to('webmanifest-rev-manifest'))
);<% } %>
