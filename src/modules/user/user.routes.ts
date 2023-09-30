import { FastifyInstance } from 'fastify';

import registerUserHandler from './user.handlers';

// Connects route with specified handlers for Users

async function userRoutes(server: FastifyInstance) {
  server.post('/add', registerUserHandler);
}

export default userRoutes;
