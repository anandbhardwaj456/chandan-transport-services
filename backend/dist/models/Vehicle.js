import mongoose, { Schema } from 'mongoose';
const vehicleSchema = new Schema({
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    passengerCapacity: { type: Number, required: true },
    luggageCapacity: { type: Number, default: 0 },
    features: [{ type: String }],
    active: { type: Boolean, default: true },
    pricingModel: { type: String, default: 'per_km' },
});
const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
