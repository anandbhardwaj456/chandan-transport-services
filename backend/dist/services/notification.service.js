export const sendBookingNotification = async (booking) => {
    return {
        delivered: false,
        provider: 'not_configured',
        message: `Booking ${booking.bookingReference} is queued for confirmation.`,
    };
};
