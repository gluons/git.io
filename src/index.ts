import fastify from 'fastify';
import fastifyCORS from 'fastify-cors';
import { HTTPError } from 'got';
import { STATUS_CODES } from 'http';

import shortenUrl from './shortenUrl';

type Body = {
	url: string;
	code?: string;
};

const isPrd = process.env.NODE_ENV === 'production';
const port = process.env.PORT ? parseInt(process.env.PORT) : 8888;

const app = fastify({
	logger: !isPrd ? { prettyPrint: true } : void 0
});
const start = async () => {
	try {
		const address = await app.listen(port, '0.0.0.0');

		app.log.info(`git.io proxy is running on ${address}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

app.register(fastifyCORS, {
	origin: '*'
});

app.route({
	method: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'PUT'],
	url: '/',
	handler(_, reply) {
		reply.status(405).send({
			error: STATUS_CODES[405]
		});
	}
});

app.post('/', async (request, reply) => {
	const { body } = request;
	const { url, code }: Body = body ?? {};

	reply.type('application/json; charset=utf-8');

	if (!url) {
		reply.status(400).send({
			error: 'No URL given.'
		});

		return;
	}

	try {
		const shortUrl = await shortenUrl(url, code);

		if (!shortUrl) {
			reply.status(204).send({
				shortUrl: ''
			});

			return;
		}

		reply.send({
			shortUrl
		});
	} catch (err) {
		if (err instanceof HTTPError) {
			const { response } = err;
			const { body, statusCode, statusMessage } = response;

			let errMsg = statusMessage;

			if (
				statusCode === 422 &&
				typeof body === 'string' &&
				body.length > 0
			) {
				errMsg = body;
			}

			reply.status(statusCode).send({
				error: errMsg
			});

			return;
		}

		const errMsg =
			typeof err?.message === 'string' ? err.message : err.toString();

		reply.status(500).send({
			error: errMsg
		});
	}
});

start();
