import fastify from 'fastify';
import fastifyCORS from 'fastify-cors';

import shortenUrl from './shortenUrl';

type Body = {
	url: string;
	code?: string;
};

const isPrd = process.env.NODE_ENV === 'production';
const port = process.env.PORT ? parseInt(process.env.PORT) : 8888;
const typeText = 'text/plain; charset=utf-8';
const typeJson = 'application/json; charset=utf-8';

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
		reply
			.status(405)
			.type(typeText)
			.send('Method Not Allowed');
	}
});

app.post('/', async (request, reply) => {
	const { body } = request;
	const { url, code }: Body = body ?? {};

	if (!url) {
		reply
			.status(400)
			.type(typeText)
			.send('No URL given.');

		return;
	}

	try {
		reply.type(typeJson);

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
		reply
			.status(500)
			.type(typeText)
			.send(err.toString());
	}
});

start();
