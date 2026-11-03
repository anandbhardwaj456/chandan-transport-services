import { NextFunction, Request, Response } from 'express';

import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  if ((error as any).name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [(error as Error).message],
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Something went wrong on the server',
  });
};
