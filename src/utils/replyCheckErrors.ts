import { FastifyReply } from 'fastify';
import { Prisma } from '@prisma/client';
import { fastyErrReply } from './replyGenerators';
import { inspect } from 'util';
import { WrongClientRequest } from './customErrors';

interface KnownError {
  message: string;
  statusCode: number;
}

export enum HandledErrorCodes {
  P2002 = 'P2002',
  P2003 = 'P2003',
}

export type ErrorHandlerMap = Map<HandledErrorCodes, KnownError>;

function getErrCodeMapOrUseDefault(
  customErrCodeMap: ErrorHandlerMap | null,
  errorCode: HandledErrorCodes,
  defaultErrorInfo: KnownError,
) {
  let errCustomResult = undefined;
  if (customErrCodeMap) {
    errCustomResult = customErrCodeMap.get(errorCode);
  }
  if (errCustomResult === undefined) {
    errCustomResult = defaultErrorInfo;
  }
  return errCustomResult;
}

export type ActionToCreateErrCustomResult = (
  prismaKnownErr: Prisma.PrismaClientKnownRequestError,
) => KnownError | null;

function replyOnPrismaClientKnownError(
  reply: FastifyReply,
  errorCodeToHandle: HandledErrorCodes,
  prismaKnownErr: Prisma.PrismaClientKnownRequestError,
  errCodeMap: ErrorHandlerMap | null,
  defaultErrInfo: KnownError,
  actionChangingErrCustomResult: null | ActionToCreateErrCustomResult,
) {
  if (prismaKnownErr.code === errorCodeToHandle) {
    let errCustomResult = getErrCodeMapOrUseDefault(
      errCodeMap,
      HandledErrorCodes.P2002,
      defaultErrInfo,
    );

    if (actionChangingErrCustomResult) {
      const errNewCustomResult = actionChangingErrCustomResult(prismaKnownErr);
      if (errNewCustomResult) {
        errCustomResult = errNewCustomResult;
      }
    }

    const { message, statusCode } = errCustomResult;

    return fastyErrReply(reply, message, prismaKnownErr, statusCode);
  }
  return false;
}

export function handleErrAndReply(
  err: unknown,
  reply: FastifyReply,
  errCodeMap: ErrorHandlerMap | null = null,
  actionChangingErrCustomResult: null | ActionToCreateErrCustomResult = null,
) {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const prismaKnownErr = err as Prisma.PrismaClientKnownRequestError;
    let handledErrCodeResult: FastifyReply | boolean;

    // P2002
    handledErrCodeResult = replyOnPrismaClientKnownError(
      reply,
      HandledErrorCodes.P2002,
      prismaKnownErr,
      errCodeMap,
      {
        message: 'Record already exist',
        statusCode: 409,
      },
      actionChangingErrCustomResult,
    );
    if (handledErrCodeResult) {
      return handledErrCodeResult;
    }

    // P2003
    handledErrCodeResult = replyOnPrismaClientKnownError(
      reply,
      HandledErrorCodes.P2003,
      prismaKnownErr,
      errCodeMap,
      {
        message:
          'Wrong data in the data field, foreign key constraint failed during creation',
        statusCode: 409,
      },
      actionChangingErrCustomResult,
    );
    if (handledErrCodeResult) {
      return handledErrCodeResult;
    }

    // Generic Prisma Known Error Reply
    return fastyErrReply(reply, err.message, err, 400);
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    // Generic Prisma Validation Error Reply
    return fastyErrReply(
      reply,
      'Incorrect fields or field data in the request',
      err,
      400,
    );
  }

  if (err instanceof WrongClientRequest) {
    // Generic  WrongClientRecuest Error Reply
    return fastyErrReply(reply, err.message, err, err.statusCode);
  }

  console.error(inspect(err, { showHidden: true, depth: 5, colors: true }));

  return fastyErrReply(reply, 'Internal Server Error', err, 500);
}
