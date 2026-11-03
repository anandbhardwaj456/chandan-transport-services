import { z } from 'zod';
export const registerSchema = z.object({
    name: z.string().min(2, 'Name is required').max(100),
    email: z.string().email('Please provide a valid email'),
    phone: z.string().min(10, 'Mobile number is required').max(15),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});
export const loginSchema = z.object({
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(6, 'Password is required'),
});
