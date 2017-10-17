
export default function findIndex(key, value, array) {

	for (const index in array) {

		if (array[index][key].toString() == value) {
			return index;
		}
	}

	return -1;
}
