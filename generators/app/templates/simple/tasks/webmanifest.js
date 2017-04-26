/**
 * Web manifest tasks
 */

import gulp       from 'gulp';<% if (gulpTasks.includes('favicon')) { %>
import teleport   from 'gulp-teleport';
import json       from 'gulp-json-editor';<% } %>
import notify     from './helpers/notify';
import { server } from './server';
import paths      from './paths';
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
		.pipe(teleport.wait('favicon'))
		.pipe(setIcons())
		.pipe(gulp.dest(paths.dist.root))
		.pipe(server.stream())
		.pipe(notify('Web manifset is updated.'))
);

gulp.task('webmanifest:build', () =>
	gulp.src(paths.src.manifest)
		.pipe(teleport.wait('favicon'))
		.pipe(setIcons())
		.pipe(gulp.dest(paths.dist.root))
		.pipe(notify('Web manifset is compiled.'))
);<% } else { %>
gulp.task('webmanifest:dev', () =>
	gulp.src(paths.src.manifest)
		.pipe(gulp.dest(paths.dist.root))
		.pipe(server.stream())
		.pipe(notify('Web manifset is updated.'))
);

gulp.task('webmanifest:build', () =>
	gulp.src(paths.src.manifest)
		.pipe(gulp.dest(paths.dist.root))
		.pipe(notify('Web manifset is compiled.'))
);<% } %>
