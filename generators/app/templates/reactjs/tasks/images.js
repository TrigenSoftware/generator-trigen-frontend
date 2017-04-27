/**
 * Images tasks
 */

import gulp         from 'gulp';
import teleport     from 'gulp-teleport';
import rev          from 'gulp-rev';
import srcset       from 'gulp-srcset';
import notify       from './helpers/notify';
import { server }   from './server';
import revManifests from './rev-manifests';
import paths        from './paths';

revManifests.push(
	'images-rev-manifest'
);

gulp.task('images:watch', (done) => {
	gulp.watch(paths.src.images, gulp.series('images:dev'));
	done();
});

gulp.task('images:dev', () =>
	gulp.src(paths.src.images)
		.pipe(srcset([{
			match:  '**/*.jpg'
		}, {
			match:  '**/*.png'
		}, {
			match:  '**/*.svg'
		}]))
		.pipe(gulp.dest(paths.dist.root))
		.pipe(notify('Images are updated.'))
		.pipe(server.stream())
);

gulp.task('images:build', () =>
	gulp.src(paths.src.images)
		.pipe(srcset([{
			match:  '**/*.jpg'
		}, {
			match:  '**/*.png'
		}, {
			match:  '**/*.svg'
		}]))
		.pipe(rev())
		.pipe(gulp.dest(paths.dist.root))
		.pipe(rev.manifest())
		.pipe(notify('Images are generated.'))
		.pipe(teleport.to('images-rev-manifest'))
);
