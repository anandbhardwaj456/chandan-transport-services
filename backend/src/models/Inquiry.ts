import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  phone: string;
  email?: string;
  message: string;
  inquiryType: 'general' | 'corporate';
  companyName?: string;
  serviceRequired?: string;
  expectedVehicles?: number;
  contractDuration?: string;
  pickupLocations?: string[];
  additionalRequirements?: string;
  status: 'new' | 'contacted' | 'closed';
}

const inquirySchema = new Schema<IInquiry>({
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

const Inquiry = mongoose.model<IInquiry>('Inquiry', inquirySchema);

export default Inquiry;
