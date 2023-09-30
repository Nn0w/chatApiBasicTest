import { FastifyRequest, FastifyReply } from 'fastify';
import { createUser } from './user.services';
import { CreateUserInput } from './user.schema';
import {
  ErrorHandlerMap,
  HandledErrorCodes,
  handleErrAndReply,
} from '../../utils/replyCheckErrors';
// Handles requests on a route

async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const newUser = await createUser(body);
    return reply.code(201).send({ id: newUser.id });
  } catch (err) {
    const customErroInfo: ErrorHandlerMap = new Map([
      [
        HandledErrorCodes.P2002,
        { message: 'User already exist', statusCode: 409 },
      ],
    ]);

    return handleErrAndReply(err, reply, customErroInfo);
  }
}

export default registerUserHandler;
