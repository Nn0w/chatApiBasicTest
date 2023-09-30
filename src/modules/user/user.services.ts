import prisma from '../../utils/prisma';
import { CreateUserInput } from './user.schema';

//Do stuff with User records

export async function createUser(input: CreateUserInput) {
  const user = await prisma.user.create({
    data: input,
  });
  return user;
}
