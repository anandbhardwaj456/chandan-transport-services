import { ApiError } from '../utils/ApiError.js';
export const errorHandler = (error, _req, res, _next) => {
    if (error instanceof ApiError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            errors: error.errors,
        });
    }
    if (error.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: [error.message],
        });
    }
    return res.status(500).json({
        success: false,
        message: 'Something went wrong on the server',
    });
};
