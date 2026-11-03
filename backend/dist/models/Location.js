import mongoose, { Schema } from 'mongoose';
const locationSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    state: { type: String, default: 'Jharkhand' },
    active: { type: Boolean, default: true },
});
const Location = mongoose.model('Location', locationSchema);
export default Location;
