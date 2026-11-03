import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  slug: string;
  state: string;
  active: boolean;
}

const locationSchema = new Schema<ILocation>({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  state: { type: String, default: 'Jharkhand' },
  active: { type: Boolean, default: true },
});

const Location = mongoose.model<ILocation>('Location', locationSchema);

export default Location;
