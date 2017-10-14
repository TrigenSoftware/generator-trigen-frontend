
export default function stringifyValues(object) {

	const stringifiedObject = {};

	for (const key in object) {
		stringifiedObject[key] = `'${object[key]}'`;
	}

	return stringifiedObject;
}
