import mongoose, { Schema } from 'mongoose';
const routeSchema = new Schema({
    origin: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    routeType: { type: String, enum: ['one_way', 'round_trip', 'local'], default: 'one_way' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    metadata: { type: Schema.Types.Mixed },
});
const Route = mongoose.model('Route', routeSchema);
export default Route;
