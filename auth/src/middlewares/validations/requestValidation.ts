import type { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import { normalizeError } from '../../shared/error';

export const validateRequest = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array().pop();
    if (error) {
      const errorResponse = normalizeError(error.msg);
      return res.status(400).send(errorResponse);
    }
  }

  next();
};
