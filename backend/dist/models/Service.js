import mongoose, { Schema } from 'mongoose';
const serviceSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: '' },
    active: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, default: 'transport' },
});
const Service = mongoose.model('Service', serviceSchema);
export default Service;
