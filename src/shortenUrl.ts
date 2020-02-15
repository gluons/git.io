import got from 'got';

import Payload from './types/Payload';

export default async function shortenUrl(url: string, code?: string): Promise<string> {
	const payload: Payload = {
		url
	};

	if (code) {
		payload.code = code;
	}

	const res = await got.post('https://git.io', {
		form: payload
	});

	const location = res.headers.location;

	return location;
}
