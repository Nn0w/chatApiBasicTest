import prisma from '../../utils/prisma';
import { CreateChatInput, GetUserChatsInput } from './chat schema';
import { WrongClientRequest } from '../../utils/customErrors';

//Do stuff with Chat records

async function findAllUsersInList(usernames: CreateChatInput['users']) {
  const userIdsInChatArr = [];
  for (const username of usernames) {
    const result = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        id: true,
      },
    });
    if (result === null) {
      //User not found, returns string if user not found
      return `User: ${username} not found`;
    }
    userIdsInChatArr.push(result.id);
  }
  return userIdsInChatArr;
}

export async function createChat(input: CreateChatInput) {
  //{"name": "chat_1", "users": ["<USER_ID_1>", "<USER_ID_2>"]}
  const chatName = input.name;
  const userNamesArr = input.users;

  const result = await findAllUsersInList(userNamesArr);
  if (typeof result === 'string') {
    // User not found
    const err = new WrongClientRequest(result);
    throw err;
  }
  const userIdsInChatArr = result;

  //https://www.prisma.io/docs/concepts/components/prisma-schema/relations/many-to-many-relations
  // Creates Chat, Creates UserChats, connects Chat with existing User records
  const chat = await prisma.chat.create({
    data: {
      name: chatName,
      users: {
        create: userIdsInChatArr.map(userId => ({
          assignedBy: 'server',
          assignedAt: new Date(),
          user: {
            connect: {
              id: userId,
            },
          },
        })),
      },
    },
  });

  return chat;
}

export async function getUserChats(input: GetUserChatsInput) {
  const userId = input.user;
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  console.log('User:', user);
  // User not found
  if (user === null) {
    const err = new WrongClientRequest(`User: ${userId} not found`);
    throw err;
  }
  // const chats = await prisma.chat.findMany();

  const userChatsIds = await prisma.usersChats.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      assignedAt: 'desc',
    },
    select: { chatId: true },
  });

  //check if found chats TODO
  // CONTINUE HERE
  const foundChats = await prisma.chat.findMany({
    where: {
      id: { in: userChatsIds.map(chatIdObj => chatIdObj.chatId) },
    },

    include: {
      users: true,
      messages: {
        orderBy: {
          created_at: 'desc',
        },
      },
    },
  });

  if (foundChats.length == 0) {
    return foundChats;
  }

  //Separate chats with no messages
  const emptyChats = [];
  const chatsWithMessages = [];
  for (const chat of foundChats) {
    if (chat.messages.length == 0) {
      emptyChats.push(chat);
    } else {
      chatsWithMessages.push(chat);
    }
  }

  //desc sort for chats with messages based at the last message date
  chatsWithMessages.sort((a, b) => {
    return b.created_at.getTime() - a.created_at.getTime();
  });

  const sortedChatsArray = chatsWithMessages.concat(emptyChats);
  // const chats = await prisma.usersChats.findMany({
  //   where: {
  //     userId: userId,
  //   },
  //   orderBy: {
  //     assignedAt: 'desc',
  //   },
  //   include: { chat: true },
  // });

  //Contain all chat fields
  //   • id - уникальный идентификатор чата
  // • name - уникальное имя чата
  // • users - список пользователей в чате, отношение многие-ко-многим
  // • created_at - время создания

  //Get rid of messages field //Continue here, before this each item contains all chat messages
  const sortedChatsArrayClean = sortedChatsArray.map(chat => ({
    id: chat.id,
    name: chat.name,
    // prettier-ignore
    users: chat.users.map((userData) => ({ userId: userData.userId })),
    created_at: chat.created_at,
  }));

  return sortedChatsArrayClean;
}
