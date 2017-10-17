
module.exports =
function editWebmanifest(sourceWebman, targetWebman, webmanProps) {

	if (!webmanProps) {
		return sourceWebman;
	}

	const webman = Object.assign(
		{},
		sourceWebman || targetWebman,
		webmanProps
	);

	return webman;
}
