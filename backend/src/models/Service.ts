import mongoose, { Schema, Document } from 'mongoose';

export interface IService extends Document {
  name: string;
  description: string;
  image: string;
  active: boolean;
  slug: string;
  category: string;
}

const serviceSchema = new Schema<IService>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  active: { type: Boolean, default: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, default: 'transport' },
});

const Service = mongoose.model<IService>('Service', serviceSchema);

export default Service;
