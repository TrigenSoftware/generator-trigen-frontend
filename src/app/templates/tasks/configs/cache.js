/**
 * Cache config.
 */

import cache from 'gulp-cache';

export default new cache.Cache({
	tmpDir:       process.cwd(),
	cacheDirName: '.cache'
});
