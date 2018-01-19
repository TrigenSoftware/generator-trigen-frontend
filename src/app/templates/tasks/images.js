/**
 * Images tasks.
 */

import gulp from 'gulp';
import * as teleport from 'gulp-teleport';
import rev from 'gulp-rev';
import revFormat from 'gulp-rev-format';
import newer from 'gulp-newer';
import cache from 'gulp-cache';
import size from 'gulp-size';
import srcset from 'gulp-srcset';
import notify from './helpers/notify';
import cacheStore from './configs/cache';
import revManifests from './configs/rev-manifests';
import paths from './configs/paths';
import { server } from './server';

revManifests.push(
	'images-rev-manifest'
);

gulp.task('images:watch', (done) => {
	gulp.watch(paths.src.images, gulp.series('images:dev'));
	done();
});

gulp.task('images:dev', () =>
	gulp.src(paths.src.images)
		.pipe(newer(paths.dev.imagesDir))
		.pipe(srcset([{
			match: '**/*.jpg'
		}, {
			match: '**/*.png'
		}, {
			match: '**/*.svg'
		}], {
			skipOptimization: true
		}))
		.pipe(gulp.dest(paths.dev.imagesDir))
		.pipe(notify('Images are updated.'))
		.pipe(server.stream({ once: true }))
);

gulp.task('images:build', () =>
	gulp.src(paths.src.images)
		.pipe(size({ title: 'images' }))
		.pipe(cache(srcset([{
			match: '**/*.jpg'
		}, {
			match: '**/*.png'
		}, {
			match: '**/*.svg'
		}]), {
			name:      'images',
			fileCache: cacheStore
		}))
		.pipe(rev())
		.pipe(revFormat({ prefix: '.' }))
		.pipe(size({ title: 'images optimized' }))
		.pipe(gulp.dest(paths.build.imagesDir))
		.pipe(rev.manifest())
		.pipe(notify('Images are generated.'))
		.pipe(teleport.to('images-rev-manifest'))
);
