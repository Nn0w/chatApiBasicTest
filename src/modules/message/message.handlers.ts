import { FastifyRequest, FastifyReply } from 'fastify';
import {
  handleErrAndReply,
  ActionToCreateErrCustomResult,
} from '../../utils/replyCheckErrors';
import { CreateMessageInput, GetMessagesInput } from './message.schema';
import { createMessage, findChatMessages } from './message.services';
import { Prisma } from '@prisma/client';

//Handles requests

export async function addMessageHandler(
  request: FastifyRequest<{ Body: CreateMessageInput }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const message = await createMessage(body);
    return reply.code(201).send({ id: message.id });
  } catch (err) {
    // prettier-ignore
    const actionsOnCustomErrReply: ActionToCreateErrCustomResult = (prismaKnownErr: Prisma.PrismaClientKnownRequestError) => {
      if (prismaKnownErr.meta && 'field_name' in prismaKnownErr.meta) {
        const fieldNameValue = prismaKnownErr.meta['field_name'];
        if (
          typeof fieldNameValue === 'string' &&
          fieldNameValue.includes('Message_chatId_fkey (index)')
        ) {
          return {
            message: 'Chat with this ID doesnt exist',
            statusCode: 409,
          };
        } 
        
        if (
          typeof fieldNameValue === 'string' &&
          fieldNameValue.includes('Message_authorId_fkey (index)')
        ) {
          return {
            message: 'User with this ID doesnt exist',
            statusCode: 409,
          };
        } 
        
      }
      return null 
    };
    return handleErrAndReply(err, reply, null, actionsOnCustomErrReply);
  }
}

export async function getMessagesHandler(
  request: FastifyRequest<{ Body: GetMessagesInput }>,
  reply: FastifyReply,
) {
  const body = request.body;

  try {
    const chatMessages = await findChatMessages(body);
    return reply.code(200).send({ messages: chatMessages });
  } catch (err) {
    return handleErrAndReply(err, reply, null, null);
  }
}
