import { z } from 'zod';

// type Schema for input verification for Chats
//{"name": "chat_1", "users": ["<USER_ID_1>", "<USER_ID_2>"]}
const ChatSchema = z.object({
  name: z.string(),
  users: z.array(z.string()),
});

const UserIdSchemaGetChats = z.object({
  user: z.string(),
});

export type GetUserChatsInput = z.infer<typeof UserIdSchemaGetChats>;

export type CreateChatInput = z.infer<typeof ChatSchema>;
