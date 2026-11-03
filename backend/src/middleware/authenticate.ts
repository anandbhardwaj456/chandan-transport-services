import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import env from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/User.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next(new ApiError(401, 'Authentication required'));
    }

    const payload: any = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(payload.userId).select('-passwordHash');

    if (!user || user.status !== 'active') {
      return next(new ApiError(401, 'User account is unavailable'));
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(401, 'Invalid or expired token'));
  }
};
