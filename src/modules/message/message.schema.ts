import { z } from 'zod';

// type Schema for input verification for Messages
//{"chat": "<CHAT_ID>", "author": "<USER_ID>", "text": "hi"}
const MessageSchema = z.object({
  chat: z.string(),
  author: z.string(),
  text: z.string(),
});

const ChatMessagesSchema = z.object({
  chat: z.string(),
});

export type CreateMessageInput = z.infer<typeof MessageSchema>;
export type GetMessagesInput = z.infer<typeof ChatMessagesSchema>;
