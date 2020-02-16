import axios, { AxiosError } from 'axios';

import ErrorResult from '@/types/ErrorResult';
import Payload from '@/types/Payload';
import Result from '@/types/Result';

const proxyUrl = 'https://git-io-proxy.herokuapp.com/';

export default async function shortenUrl(
	url: string,
	code?: string
): Promise<string> {
	if (!url) {
		throw new Error('No URL to shorten.');
	}

	const payload: Payload = {
		url
	};

	if (code) {
		payload.code = code;
	}

	try {
		const res = await axios.post<Result>(proxyUrl, payload);
		const { data } = res;

		const { shortUrl } = data;

		if (!shortUrl) {
			throw new Error('No result.');
		}

		return shortUrl;
	} catch (err) {
		const { response } = err as AxiosError<ErrorResult>;

		if (response) {
			const { data } = response;
			const errMsg = data.error ?? data.toString();

			throw new Error(errMsg);
		}

		throw err;
	}
}
