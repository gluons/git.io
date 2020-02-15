import axios from 'axios';

type Payload = {
	url: string;
	code?: string;
};
type Result = {
	shortUrl: string;
};

const proxyUrl = 'https://git-io-proxy.herokuapp.com/';

export default async function shortenUrl(url: string, code?: string): Promise<string> {
	if (!url) {
		throw new Error('No URL to shorten.');
	}

	const payload: Payload = {
		url
	};

	if (code) {
		payload.code = code;
	}

	const res = await axios.post<Result | string>(proxyUrl, payload);
	const { data, status } = res;

	if (status !== 200) {
		throw new Error(data.toString());
	}

	const { shortUrl } = data as Result;

	return shortUrl;
}
