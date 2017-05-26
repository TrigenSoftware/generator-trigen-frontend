/**
 * Style tasks
 */

import gulp                from 'gulp';
import * as teleport       from 'gulp-teleport';
import rev                 from 'gulp-rev';
import revReplace          from 'gulp-rev-replace';
import size                from 'gulp-size';
import sassModulesImporter from 'sass-modules-importer';
import sass                from 'gulp-sass';
import sourcemaps          from 'gulp-sourcemaps';
import cssnano             from 'gulp-cssnano';
import autoprefixer        from 'gulp-autoprefixer';
import styleLint           from 'gulp-stylelint';
import errorReporter       from './helpers/error-reporter';
import notify              from './helpers/notify';
import revManifests        from './configs/rev-manifests';
import paths               from './configs/paths';
import autoprefixerConfig  from './configs/autoprefixer';
import { server }          from './server';

revManifests.push(
	'style-rev-manifest'
);

gulp.task('style:watch', (done) => {
	gulp.watch(paths.src.styles, gulp.series('style:dev'));
	done();
});

gulp.task('style:lint', () =>
	gulp.src(paths.src.styles)
		.pipe(styleLint({
			reporters:      [{ formatter: 'string', console: true }],
			failAfterError: true
		}))
		.on('error', errorReporter)
);

gulp.task('style:dev', gulp.parallel('style:lint', () =>
	gulp.src(paths.src.styles)
		.pipe(sourcemaps.init())
			.pipe(sass({ importer: sassModulesImporter() }))
			.on('error', errorReporter)
			.pipe(autoprefixer(autoprefixerConfig))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.dev.root))
		.pipe(notify('Styles are updated.'))
		.pipe(server.stream())
));

gulp.task('style:build', gulp.series('style:lint', () =>
	gulp.src(paths.src.styles)
		.pipe(sass({ importer: sassModulesImporter() }))
		.on('error', errorReporter)
		.pipe(size({ title: 'styles' }))
		.pipe(autoprefixer(autoprefixerConfig))
		.pipe(cssnano({
			reduceIdents: false,
			zindex:       false
		}))
		.pipe(revReplace({
			manifest: teleport.waitStream('images-rev-manifest')
		}))
		.pipe(rev())
		.pipe(size({ title: 'styles optimized' }))
		.pipe(gulp.dest(paths.build.root))
		.pipe(rev.manifest())
		.pipe(notify('Styles are compiled.'))
		.pipe(teleport.to('style-rev-manifest'))
));
