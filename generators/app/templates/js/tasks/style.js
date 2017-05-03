/**
 * Style tasks
 */

import gulp          from 'gulp';
import * as teleport from 'gulp-teleport';
import rev           from 'gulp-rev';
import revReplace    from 'gulp-rev-replace';
import sassModulesImporter from 'sass-modules-importer';
import sass          from 'gulp-sass';
import sourcemaps    from 'gulp-sourcemaps';
import cssnano       from 'gulp-cssnano';
import autoprefixer  from 'gulp-autoprefixer';
import styleLint     from 'gulp-stylelint';
import errorReporter from './helpers/error-reporter';
import notify        from './helpers/notify';
import { server }    from './server';
import revManifests  from './rev-manifests';
import paths         from './paths';
import pkg           from '../package.json';

revManifests.push(
	'style-rev-manifest'
);

const autoprefixerOptions = {
	browsers: pkg.engines.browsers
};

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
			.pipe(autoprefixer(autoprefixerOptions))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.dist.root))
		.pipe(notify('Styles are updated.'))
		.pipe(server.stream())
));

gulp.task('style:build', gulp.series('style:lint', () =>
	gulp.src(paths.src.styles)
		.pipe(sass({ importer: sassModulesImporter() }))
		.on('error', errorReporter)
		.pipe(autoprefixer(autoprefixerOptions))
		.pipe(cssnano({
			reduceIdents: false,
			zindex:       false
		}))
		.pipe(revReplace({
			manifest: teleport.waitStream('images-rev-manifest')
		}))
		.pipe(rev())
		.pipe(gulp.dest(paths.dist.root))
		.pipe(rev.manifest())
		.pipe(notify('Styles are compiled.'))
		.pipe(teleport.to('style-rev-manifest'))
));
