import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

import { ApiError } from '../utils/ApiError.js';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new ApiError(400, 'Validation failed', result.error.issues));
    }

    req.body = result.data;
    next();
  };
};
