import type { NextFunction, Request, Response } from 'express';
import {
  CustomError,
  type ErrorResponse,
  normalizeError,
} from '../shared/error';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let errorResponse: ErrorResponse;

  if (error instanceof CustomError) {
    errorResponse = error.serializeError();
  } else {
    errorResponse = normalizeError(error?.message || 'Something went wrong');
  }
  return res.status(500).send(errorResponse);
};
