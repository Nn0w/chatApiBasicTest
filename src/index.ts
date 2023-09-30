import { fastify } from 'fastify';
import config from './config';
import userRoutes from './modules/user/user.routes';
import prisma from './utils/prisma';
import chatRoutes from './modules/chat/chat.routes';
import messageRoutes from './modules/message/message.routes';

const app = fastify({
  logger: true,
});

// Register plugins
app.register(userRoutes, { prefix: 'users' });
app.register(chatRoutes, { prefix: 'chats' });
app.register(messageRoutes, { prefix: 'messages' });

app.get('/health', async (request, reply) => {
  return { status: 'OK' };
});

app.listen({ port: config.PORT }, async function (err, address) {
  if (err) {
    app.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
  // Server is now listening on ${address}
  console.log(`Server listening at ${address}`);
});
