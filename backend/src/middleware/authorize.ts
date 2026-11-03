import { NextFunction, Response } from 'express';

import { ApiError } from '../utils/ApiError.js';
import { AuthRequest } from './authenticate.js';

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You are not authorized to perform this action'));
    }

    next();
  };
};
