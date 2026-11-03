import mongoose, { Schema } from 'mongoose';
const inquirySchema = new Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    message: { type: String, required: true },
    inquiryType: { type: String, enum: ['general', 'corporate'], default: 'general' },
    companyName: { type: String, trim: true },
    serviceRequired: { type: String, trim: true },
    expectedVehicles: { type: Number, min: 1 },
    contractDuration: { type: String, trim: true },
    pickupLocations: [{ type: String, trim: true }],
    additionalRequirements: { type: String, trim: true },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
}, { timestamps: true });
const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
