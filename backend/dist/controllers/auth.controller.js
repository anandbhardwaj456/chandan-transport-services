import { loginUser, registerUser } from '../services/auth.service.js';
import { sendSuccess } from '../utils/ApiResponse.js';
export const register = async (req, res, next) => {
    try {
        const { user, token } = await registerUser(req.body);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return sendSuccess(res, 201, 'Registration successful', { user });
    }
    catch (error) {
        next(error);
    }
};
export const login = async (req, res, next) => {
    try {
        const { user, token } = await loginUser(req.body);
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return sendSuccess(res, 200, 'Login successful', { user });
    }
    catch (error) {
        next(error);
    }
};
export const logout = (_req, res) => {
    res.clearCookie('token');
    return sendSuccess(res, 200, 'Logged out successfully');
};
export const me = async (req, res, next) => {
    try {
        res.json({ success: true, data: req.user });
    }
    catch (error) {
        next(error);
    }
};
export const forgotPassword = async (_req, res) => {
    return sendSuccess(res, 200, 'Password reset instructions have been queued if the provider is configured.');
};
export const resetPassword = async (_req, res) => {
    return sendSuccess(res, 200, 'Password reset request accepted.');
};
