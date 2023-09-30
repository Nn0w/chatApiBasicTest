import { FastifyInstance } from 'fastify';
import { addMessageHandler, getMessagesHandler } from './message.handlers';

// Connects route with specified handlers for Chat, depending on route

async function messageRoutes(server: FastifyInstance) {
  server.post('/add', addMessageHandler);
  server.post('/get', getMessagesHandler);
}

export default messageRoutes;
