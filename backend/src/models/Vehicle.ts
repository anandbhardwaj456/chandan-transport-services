import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicle extends Document {
  category: string;
  description: string;
  imageUrl: string;
  passengerCapacity: number;
  luggageCapacity: number;
  features: string[];
  active: boolean;
  pricingModel: string;
}

const vehicleSchema = new Schema<IVehicle>({
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  imageUrl: { type: String, default: '' },
  passengerCapacity: { type: Number, required: true },
  luggageCapacity: { type: Number, default: 0 },
  features: [{ type: String }],
  active: { type: Boolean, default: true },
  pricingModel: { type: String, default: 'per_km' },
});

const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);

export default Vehicle;
