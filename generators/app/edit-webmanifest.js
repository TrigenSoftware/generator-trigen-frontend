
module.exports =
function editWebmanifest(sourceWebman, targetWebman, webmanProps) {

	if (!webmanProps) {
		return sourceWebman;
	}

	const pkg = Object.assign(
		{},
		sourceWebman || targetWebman,
		webmanProps
	);

	Object.assign(webman, webmanProps);

	return webman;
}
