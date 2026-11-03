import app from './app.js';
import env from './config/env.js';
import { connectDatabase } from './config/db.js';

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(env.PORT, () => {
      console.log(`Chandan Transportation Services API running on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
