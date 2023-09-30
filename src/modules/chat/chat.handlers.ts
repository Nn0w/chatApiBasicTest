import { FastifyRequest, FastifyReply } from 'fastify';
import { createChat, getUserChats } from './chat.services';
import { CreateChatInput, GetUserChatsInput } from './chat schema';
import {
  handleErrAndReply,
  HandledErrorCodes,
  ErrorHandlerMap,
} from '../../utils/replyCheckErrors';

//Handles requests

export async function addChatHandler(
  request: FastifyRequest<{ Body: CreateChatInput }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const chat = await createChat(body);
    return reply.code(201).send({ id: chat.id });
  } catch (err) {
    const customErroInfo: ErrorHandlerMap = new Map([
      [
        HandledErrorCodes.P2002,
        { message: 'Chat already exist', statusCode: 409 },
      ],
    ]);

    return handleErrAndReply(err, reply, customErroInfo);
  }
}

export async function findChatsHandler(
  request: FastifyRequest<{ Body: GetUserChatsInput }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const chats = await getUserChats(body);
    return reply.code(200).send(chats);
  } catch (err) {
    // const customErroInfo: ErrorHandlerMap = new Map([
    //   [
    //     HandledErrorCodes.P2002,
    //     { message: 'Chat already exist', statusCode: 409 },
    //   ],
    // ]);

    return handleErrAndReply(err, reply);
  }
}
