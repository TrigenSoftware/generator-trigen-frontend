
export default function getFiles(templatePath, {
	license,
	src
}) {

	const allFiles = [
		templatePath('.*'),
		templatePath('**/*')
	];
	const files = [
		[false, './', allFiles],
		[true, './', ['README.md']]
	];

	if (license) {
		allFiles.push(`!${templatePath('LICENSE')}`);
	}

	if (src) {
		allFiles.push(`!${templatePath('src/**/*')}`);
	}

	return files;
}
