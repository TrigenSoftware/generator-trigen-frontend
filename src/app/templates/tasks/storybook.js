/**
 * Storybook tasks.
 */

import path from 'path';
import { spawn } from 'child_process';
import gulp from 'gulp';
import * as print from './helpers/print';
import paths from './configs/paths';

gulp.task('storybook', gulp.parallel('style:watch', 'script:watch', () => {

	const [bin, ...args] = `start-storybook -p 3001 -c .storybook`.split(' '),
		storybook = spawn(path.join('node_modules/.bin', bin), args);

	storybook.stdout.on('data', (data) => {
		print.log('Storybook', data);
	});

	storybook.stderr.on('data', (data) => {
		print.error('Storybook', data);
	});

	return storybook;
}));
