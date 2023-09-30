import { fastify } from 'fastify';
import config from './config.js';
const app = fastify({
    logger: true,
});
// Register plugins
app.get('/health', async (request, reply) => {
    return { status: 'OKiDoki' };
});
app.listen({ port: config.PORT }, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }
    // Server is now listening on ${address}
    app.log.info(`Server listening at ${address}`);
});
