import { z } from 'zod';

// type Schema for input verification for Users

const UserSchema = z.object({
  username: z.string(),
});

export type CreateUserInput = z.infer<typeof UserSchema>;
