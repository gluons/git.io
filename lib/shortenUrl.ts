import axios from 'axios';

export default async function shortenUrl(url: string, code?: string): Promise<string> {
	if (!url) {
		throw new Error('No URL to shorten.');
	}

	const params = new URLSearchParams();

	params.append('url', url);

	if (code) {
		params.append('code', code);
	}

	const res = await axios.post('https://git.io', params, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});

	if (res.status !== 201) {
		throw new Error(`${res.data}`);
	}

	const shortUrl: string = res.headers['location'];

	return shortUrl;
}
