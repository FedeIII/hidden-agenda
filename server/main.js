import { createGameServer, DEFAULT_PORT } from './index';

// The process entry point. Kept apart from index.js so the server can be created in-process by
// tests without binding a port or installing signal handlers.

const port = Number(process.env.PORT) || DEFAULT_PORT;
const host = process.env.HOST || '127.0.0.1';

const server = createGameServer();

server.listen(port, host).then(address => {
	console.log(`hidden-agenda server listening on ${address.address}:${address.port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
	process.on(signal, () => {
		console.log(`${signal} received, shutting down`);
		server.close().then(() => process.exit(0));
	});
}
