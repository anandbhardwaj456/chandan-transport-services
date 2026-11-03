import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import env from '../config/env.js';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

const createToken = (userId: string, role: string) =>
  jwt.sign({ userId, role }, env.JWT_SECRET, { expiresIn: '7d' });

export const registerUser = async (payload: { name: string; email: string; phone: string; password: string }) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new ApiError(409, 'A user with this email already exists');
  }

  const passwordHash = await bcrypt.hash(payload.password, 10);

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    passwordHash,
    role: 'customer',
    status: 'active',
  });

  const token = createToken(user._id.toString(), user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const user = await User.findOne({ email: payload.email });

  if (!user || user.status !== 'active' || !user.passwordHash) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isValid = await bcrypt.compare(payload.password, user.passwordHash);

  if (!isValid) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = createToken(user._id.toString(), user.role);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
    token,
  };
};

export const getUserById = async (userId: string) => {
  return User.findById(userId).select('-passwordHash');
};
