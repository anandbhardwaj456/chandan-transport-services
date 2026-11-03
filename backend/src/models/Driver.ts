import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
  name: string;
  phone: string;
  licenseVerified: boolean;
  availabilityStatus: 'available' | 'busy' | 'off_duty';
  active: boolean;
}

const driverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  licenseVerified: { type: Boolean, default: false },
  availabilityStatus: { type: String, enum: ['available', 'busy', 'off_duty'], default: 'available' },
  active: { type: Boolean, default: true },
});

const Driver = mongoose.model<IDriver>('Driver', driverSchema);

export default Driver;
