import mongoose, { Schema, Document } from 'mongoose';

export interface IFareRule extends Document {
  name: string;
  pricingModel: 'fixed_route' | 'per_km' | 'round_trip' | 'custom';
  vehicleCategory: string;
  baseFare: number;
  perKmRate?: number;
  minimumDistance?: number;
  driverAllowance?: number;
  additionalCharges?: number;
  taxRate?: number;
  active: boolean;
  routeCode?: string;
  verified: boolean;
  corporateRates?: {
    eightHoursEightyKm?: number;
    twelveHoursOneTwentyKm?: number;
    outstationPerKm?: number;
  };
  additionalChargePolicy?: {
    extraHour?: number;
    extraKmPerKm?: number;
    tolls?: string;
    parking?: string;
    taxes?: string;
    minimumOutstationKmPerDay?: number;
  };
}

const fareRuleSchema = new Schema<IFareRule>({
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

const FareRule = mongoose.model<IFareRule>('FareRule', fareRuleSchema);

export default FareRule;
