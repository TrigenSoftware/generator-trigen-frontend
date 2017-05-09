/**
 * Copy tasks
 */

import gulp  from 'gulp';
import del   from 'del';
import paths from './paths';

gulp.task('copy:dev', () =>
	gulp.src(paths.src.copy)
		.pipe(gulp.dest(paths.dev.root))
);

gulp.task('copy:build', () =>
	gulp.src(paths.src.copy)
		.pipe(gulp.dest(paths.build.root))
);
