export function objectToQueryString(obj: Record<string, any>): string {
	if (typeof obj !== 'object' || obj === null) {
		throw new Error('O argumento deve ser um objeto');
	}

	let queryString = '';

	for (const key in obj) {
		// eslint-disable-next-line no-prototype-builtins
		if (obj.hasOwnProperty(key)) {
			if (queryString.length > 0) {
				queryString += '&';
			}
			queryString += encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]);
		}
	}

	return queryString;
}

export function queryStringToObject(queryString: string): Record<string, string> {
	queryString = queryString.replace(/^\?/, '');

	const pairs = queryString.split('&');

	const result: Record<string, string> = {};

	for (const pair of pairs) {
		const [key, value] = pair.split('=');

		result[decodeURIComponent(key)] = decodeURIComponent(value || '');
	}

	return result;
}
