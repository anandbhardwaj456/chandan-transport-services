import mongoose, { Schema } from 'mongoose';
const driverSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    licenseVerified: { type: Boolean, default: false },
    availabilityStatus: { type: String, enum: ['available', 'busy', 'off_duty'], default: 'available' },
    active: { type: Boolean, default: true },
});
const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
