import mongoose, { Schema } from 'mongoose';
const fareRuleSchema = new Schema({
    name: { type: String, required: true },
    pricingModel: { type: String, enum: ['fixed_route', 'per_km', 'round_trip', 'custom'], default: 'per_km' },
    vehicleCategory: { type: String, required: true },
    baseFare: { type: Number, required: true },
    perKmRate: { type: Number, default: 0 },
    minimumDistance: { type: Number, default: 0 },
    driverAllowance: { type: Number, default: 0 },
    additionalCharges: { type: Number, default: 0 },
    taxRate: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    routeCode: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    corporateRates: {
        eightHoursEightyKm: { type: Number, min: 0 },
        twelveHoursOneTwentyKm: { type: Number, min: 0 },
        outstationPerKm: { type: Number, min: 0 },
    },
    additionalChargePolicy: {
        extraHour: { type: Number, min: 0 },
        extraKmPerKm: { type: Number, min: 0 },
        tolls: { type: String, trim: true },
        parking: { type: String, trim: true },
        taxes: { type: String, trim: true },
        minimumOutstationKmPerDay: { type: Number, min: 0 },
    },
});
const FareRule = mongoose.model('FareRule', fareRuleSchema);
export default FareRule;
