import { FastifyReply } from 'fastify';

interface ErrDescription {
  message: string;
  error: unknown;
  statusCode: number;
}

export function fastyErrReply(
  reply: FastifyReply,
  message: string,
  err: unknown,
  statusCode: number,
) {
  const errDescrpt: ErrDescription = {
    message: message,
    error: err,
    statusCode: statusCode,
  };

  return reply.code(statusCode).send(errDescrpt);
}
