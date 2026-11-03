export const sendSuccess = (res: any, statusCode = 200, message = 'Success', data?: unknown) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};
