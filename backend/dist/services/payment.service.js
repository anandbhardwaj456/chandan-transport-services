export const createPaymentOrder = async () => {
    return {
        provider: 'offline',
        success: true,
        orderId: 'offline-payment',
        message: 'Payment integration not configured; pay later flow is enabled.',
    };
};
export const verifyPayment = async () => {
    return { verified: true, provider: 'offline' };
};
