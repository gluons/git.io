import fastify from 'fastify';

import shortenUrl from './shortenUrl';

const isPrd = process.env.NODE_ENV === 'production';
const port = process.env.PORT ? parseInt(process.env.PORT) : 8888;

const app = fastify({
	logger: !isPrd ? { prettyPrint: true } : void 0
});
const start = async () => {
	try {
		const address = await app.listen(port);

		app.log.info(`git.io proxy is running on ${address}`);
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

app.route({
	method: ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'PUT'],
	url: '/',
	handler(_, reply) {
		reply
			.status(405)
			.header('Content-Type', 'text/plain; charset=UTF-8')
			.send('Method Not Allowed');
	}
});

app.post('/', async (request, reply) => {
	const { body } = request;

	reply.header('Access-Control-Allow-Origin', '*');

	try {
		reply.header('Content-Type', 'application/json; charset=utf-8');

		const shortUrl = await shortenUrl(body.url, body.code);

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
			.header('Content-Type', 'text/plain; charset=UTF-8')
			.status(500)
			.send(err.toString());
	}
});

start();
