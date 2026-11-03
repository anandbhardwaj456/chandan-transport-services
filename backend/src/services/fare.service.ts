import FareRule from '../models/FareRule.js';
import Route from '../models/Route.js';
import Vehicle from '../models/Vehicle.js';
import { ApiError } from '../utils/ApiError.js';

export type EstimateInput = {
  pickupLocation: string;
  destination: string;
  journeyType: 'one_way' | 'round_trip';
  pickupDate: string;
  pickupTime: string;
  passengers: number;
  vehicleCategory: string;
  returnDate?: string;
  returnTime?: string;
};

export const estimateFare = async (payload: EstimateInput) => {
  if (payload.pickupLocation.trim().toLowerCase() === payload.destination.trim().toLowerCase()) {
    throw new ApiError(400, 'Pickup and destination cannot be the same');
  }

  const route = await Route.findOne({
    origin: { $regex: new RegExp(payload.pickupLocation, 'i') },
    destination: { $regex: new RegExp(payload.destination, 'i') },
    status: 'active',
  });

  if (!route) {
    return {
      quoteRequired: true,
      message: 'This route is not currently supported. Please request a quote.',
      estimatedFare: 0,
      breakdown: {},
    };
  }

  const vehicle = await Vehicle.findOne({ category: payload.vehicleCategory, active: true });
  if (!vehicle) {
    throw new ApiError(404, 'Selected vehicle category is unavailable');
  }

  const rule = await FareRule.findOne({
    vehicleCategory: payload.vehicleCategory,
    active: true,
  }).sort({ createdAt: -1 });

  const baseFare = rule?.baseFare ?? 1200;
  const perKmRate = rule?.perKmRate ?? 18;
  const minimumDistance = rule?.minimumDistance ?? 15;
  const driverAllowance = rule?.driverAllowance ?? 250;
  const additionalCharges = rule?.additionalCharges ?? 0;
  const taxRate = rule?.taxRate ?? 5;
  const distanceKm = route.metadata?.distanceKm ?? 0;

  if (!distanceKm || distanceKm <= 0) {
    return {
      quoteRequired: true,
      message: 'Route distance is not available. A quote is required.',
      estimatedFare: 0,
      breakdown: {},
    };
  }

  const distanceCharge = Math.max(distanceKm, minimumDistance) * perKmRate;
  const totalBeforeTax = baseFare + distanceCharge + driverAllowance + additionalCharges;
  const taxes = Math.round(totalBeforeTax * (taxRate / 100));
  const total = totalBeforeTax + taxes;

  return {
    quoteRequired: false,
    message: 'Fare estimated successfully',
    estimatedFare: total,
    breakdown: {
      route: route.origin + ' to ' + route.destination,
      distanceKm,
      baseFare,
      perKmRate,
      distanceCharge,
      driverAllowance,
      additionalCharges,
      taxes,
      taxRate,
      total,
      journeyType: payload.journeyType,
    },
  };
};
