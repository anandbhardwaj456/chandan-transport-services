import mongoose, { Schema, Document } from 'mongoose';

export interface IRoute extends Document {
  origin: string;
  destination: string;
  routeType: 'one_way' | 'round_trip' | 'local';
  status: 'active' | 'inactive';
  metadata?: Record<string, any>;
}

const routeSchema = new Schema<IRoute>({
  origin: { type: String, required: true, trim: true },
  destination: { type: String, required: true, trim: true },
  routeType: { type: String, enum: ['one_way', 'round_trip', 'local'], default: 'one_way' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  metadata: { type: Schema.Types.Mixed },
});

const Route = mongoose.model<IRoute>('Route', routeSchema);

export default Route;
