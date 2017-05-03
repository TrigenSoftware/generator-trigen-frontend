/**
 * Web manifest tasks
 */

import gulp          from 'gulp';
import * as teleport from 'gulp-teleport';
import rev           from 'gulp-rev';
import revReplace    from 'gulp-rev-replace';<% if (gulpTasks.includes('favicon')) { %>
import json          from 'gulp-json-editor';<% } %>
import notify        from './helpers/notify';
import { server }    from './server';
import revManifests  from './rev-manifests';
import paths         from './paths';

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
		.pipe(teleport.wait('webmanifest'))
		.pipe(setIcons())
		.pipe(gulp.dest(paths.dist.root))
		.pipe(notify('Web manifset is updated.'))
		.pipe(server.stream({ once: true }))
);

gulp.task('webmanifest:build', () =>
	gulp.src(paths.src.manifest)
		.pipe(teleport.wait('webmanifest'))
		.pipe(setIcons())
		.pipe(revReplace({
			manifest:            teleport.waitStream('favicons-rev-manifest'),
			replaceInExtensions: ['.json']
		}))
		.pipe(rev())
		.pipe(gulp.dest(paths.dist.root))
		.pipe(rev.manifest())
		.pipe(notify('Web manifset is compiled.'))
		.pipe(teleport.to('webmanifest-rev-manifest'))
);<% } else { %>
gulp.task('webmanifest:dev', () =>
	gulp.src(paths.src.manifest)
		.pipe(gulp.dest(paths.dist.root))
		.pipe(notify('Web manifset is updated.'))
		.pipe(server.stream({ once: true }))
);

gulp.task('webmanifest:build', () =>
	gulp.src(paths.src.manifest)
		.pipe(rev())
		.pipe(gulp.dest(paths.dist.root))
		.pipe(rev.manifest())
		.pipe(notify('Web manifset is compiled.'))
		.pipe(teleport.to('webmanifest-rev-manifest'))
);<% } %>
