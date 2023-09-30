import prisma from '../../utils/prisma';
import { WrongClientRequest } from '../../utils/customErrors';
import { CreateMessageInput, GetMessagesInput } from './message.schema';

async function findUserInChat(chatId: string, userId: string) {
  const result = await prisma.usersChats.findMany({
    where: {
      chatId: chatId,
      userId: userId,
    },
    orderBy: {
      assignedAt: 'desc',
    },
    select: { chatId: true },
  });

  if (result.length === 0) {
    return `User with the id of ${userId} not found in chat with the id of ${chatId}`;
  }
}

async function findUserById(userId: string) {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
    },
  });

  if (result === null) {
    return `User with the id of ${userId} not found`;
  }
}

export async function createMessage(input: CreateMessageInput) {
  //{"chat": "<CHAT_ID>", "author": "<USER_ID>", "text": "hi"}
  const chatId = input.chat;
  const authorId = input.author;
  const messageText = input.text;

  // const result = await findUserById(authorId);
  //This new function checks if user is in the chat
  const result = await findUserInChat(chatId, authorId);
  if (typeof result === 'string') {
    // User not found
    const err = new WrongClientRequest(result);
    throw err;
  }

  const message = await prisma.message.create({
    data: {
      text: messageText,
      authorId: authorId,
      chatId: chatId,
    },
    include: {
      author: true,
      chat: true,
    },
  });

  return message;
}

export async function findChatMessages(input: GetMessagesInput) {
  const chatId = input.chat;

  const chatMessages = await prisma.chat.findUniqueOrThrow({
    where: {
      id: chatId,
    },
    select: {
      messages: {
        orderBy: {
          created_at: 'asc',
        },
      },
    },
  });

  const chatMessagesArray = chatMessages.messages;

  // return all fields
  // • id - уникальный идентификатор сообщения
  // • chat - ссылка на идентификатор чата, в который было отправлено сообщение
  // • author - ссылка на идентификатор отправителя сообщения, отношение многие-к-одному
  // • text - текст отправленного сообщения
  // • created_at - время создания
  //

  // prettier-ignore
  const cleanMessagesArray = chatMessagesArray.map((message) => ({
    id: message.id,
    chat: message.chatId,
    author: message.authorId,
    text: message.text,
    created_at: message.created_at
  }));
  return cleanMessagesArray;
}

// include: {
//   messages: {
//     orderBy: {
//       created_at: 'asc',
//     },
//   },
// },
