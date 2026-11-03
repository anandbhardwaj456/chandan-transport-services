import dotenv from 'dotenv';
dotenv.config();
const env = {
    NODE_ENV: process.env.NODE_ENV ?? 'development',
    PORT: Number(process.env.PORT ?? 5000),
    MONGODB_URI: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/chandan_transportation',
    FRONTEND_URL: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    JWT_SECRET: process.env.JWT_SECRET ?? 'development-secret-key-change-me',
    COOKIE_SECRET: process.env.COOKIE_SECRET ?? 'development-cookie-secret-change-me',
    BUSINESS_WHATSAPP_NUMBER: process.env.BUSINESS_WHATSAPP_NUMBER ?? '',
    MAPS_API_KEY: process.env.MAPS_API_KEY ?? '',
    PAYMENT_KEY_ID: process.env.PAYMENT_KEY_ID ?? '',
    PAYMENT_KEY_SECRET: process.env.PAYMENT_KEY_SECRET ?? '',
    PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET ?? '',
};
export default env;
