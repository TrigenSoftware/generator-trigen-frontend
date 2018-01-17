/**
 * Copy tasks.
 */

import gulp from 'gulp';
import paths from './configs/paths';

gulp.task('copy:dev', () =>
	gulp.src(paths.src.copy)
		.pipe(gulp.dest(paths.dev.root))
);

gulp.task('copy:build', () =>
	gulp.src(paths.src.copy)
		.pipe(gulp.dest(paths.build.root))
);
