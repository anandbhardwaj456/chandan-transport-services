import Booking from '../models/Booking.js';
import { estimateFare } from './fare.service.js';
import { ApiError } from '../utils/ApiError.js';
import { generateBookingReference } from '../utils/generateBookingReference.js';

export const createBooking = async (payload: any) => {
  const existing = await Booking.findOne({ bookingReference: payload.bookingReference });
  if (existing) {
    throw new ApiError(409, 'Duplicate booking submission detected');
  }

  const routeCheck = await estimateFare({
    pickupLocation: payload.pickupLocation,
    destination: payload.destination,
    journeyType: payload.journeyType,
    pickupDate: payload.pickupDate,
    pickupTime: payload.pickupTime,
    passengers: payload.passengers,
    vehicleCategory: payload.vehicleCategory,
  });

  if (routeCheck.quoteRequired) {
    throw new ApiError(400, 'Quote required for this route and vehicle combination');
  }

  const bookingReference = generateBookingReference();

  const booking = await Booking.create({
    bookingReference,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    customerEmail: payload.customerEmail ?? '',
    pickupLocation: payload.pickupLocation,
    destination: payload.destination,
    journeyType: payload.journeyType,
    pickupDate: new Date(payload.pickupDate),
    pickupTime: payload.pickupTime,
    returnDate: payload.returnDate ? new Date(payload.returnDate) : undefined,
    returnTime: payload.returnTime,
    passengers: payload.passengers,
    vehicleCategory: payload.vehicleCategory,
    fareBreakdown: routeCheck.breakdown,
    pricingSnapshot: routeCheck.breakdown,
    status: 'pending_confirmation',
    paymentStatus: 'pending',
    notes: payload.notes,
  });

  return booking;
};

export const listBookings = async (query: any) => {
  const page = Math.max(1, Number(query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(query.limit ?? 10)));

  const filter: any = {};

  if (query.status) filter.status = query.status;
  if (query.journeyType) filter.journeyType = query.journeyType;

  const [items, total] = await Promise.all([
    Booking.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Booking.countDocuments(filter),
  ]);

  return { items, total, page, totalPages: Math.ceil(total / limit) };
};

export const getBookingByReference = async (reference: string) => {
  const booking = await Booking.findOne({ bookingReference: reference });

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  return booking;
};
