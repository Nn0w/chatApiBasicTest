import { FastifyInstance } from 'fastify';
import { addChatHandler, findChatsHandler } from './chat.handlers';

// Connects route with specified handlers for Chat, depending on route

async function chatRoutes(server: FastifyInstance) {
  server.post('/add', addChatHandler);
  server.post('/get', findChatsHandler);
}

export default chatRoutes;
