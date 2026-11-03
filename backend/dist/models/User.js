import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['customer', 'admin', 'booking_manager', 'driver'], default: 'customer' },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;
