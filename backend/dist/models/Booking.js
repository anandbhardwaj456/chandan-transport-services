import mongoose, { Schema } from 'mongoose';
const bookingSchema = new Schema({
    bookingReference: { type: String, required: true, unique: true, index: true },
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    customerEmail: { type: String, default: '' },
    pickupLocation: { type: String, required: true },
    destination: { type: String, required: true },
    journeyType: { type: String, enum: ['one_way', 'round_trip'], default: 'one_way' },
    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true },
    returnDate: { type: Date },
    returnTime: { type: String },
    passengers: { type: Number, required: true, min: 1, max: 8 },
    vehicleCategory: { type: String, required: true },
    fareBreakdown: { type: Schema.Types.Mixed },
    pricingSnapshot: { type: Schema.Types.Mixed },
    status: {
        type: String,
        enum: ['pending_confirmation', 'confirmed', 'driver_assigned', 'in_progress', 'completed', 'cancellation_requested', 'cancelled', 'rejected'],
        default: 'pending_confirmation',
    },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'cash'], default: 'pending' },
    notes: { type: String },
    cancellationDetails: { type: Schema.Types.Mixed },
}, { timestamps: true });
const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
