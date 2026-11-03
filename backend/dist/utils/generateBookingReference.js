export const generateBookingReference = () => {
    const value = Array.from({ length: 8 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 32)]).join('');
    return `CTS-${value}`;
};
