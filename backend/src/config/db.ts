import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import env from './env.js';

let memoryServer: MongoMemoryServer | null = null;

export async function connectDatabase() {
  try {
    const uri = env.MONGODB_URI;
    await mongoose.connect(uri, {});
    console.log('MongoDB connected');
  } catch (error) {
    console.warn('Primary MongoDB connection failed, attempting in-memory fallback...');
    try {
      memoryServer = await MongoMemoryServer.create();
      const uri = memoryServer.getUri();
      await mongoose.connect(uri, {});
      console.log('In-memory MongoDB started and connected');
    } catch (memoryError) {
      console.error('Database connection failed:', memoryError);
      throw memoryError;
    }
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
}
